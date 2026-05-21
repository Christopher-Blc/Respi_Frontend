import React, { useMemo, useRef } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurViewCompat } from '../general/BlurViewCompat';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../context/ThemeContext';
import createReservasTabStyles from '../../style/bookingsTab.styles';
import { sameDay, formatDateDisplay } from '../../utils/bookingUtils';

type Props = {
  selectedDate: Date;
  selectedDateChips: Date[];
  availableDays: Date[];
  locale: string;
  onSelectDate: (date: Date) => void;
  onOpenCalendar: () => void;
};

export default function BookingDateStrip({
  selectedDate,
  selectedDateChips,
  availableDays,
  locale,
  onSelectDate,
  onOpenCalendar,
}: Props) {
  const { theme, isDarkMode } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const styles = useMemo(() => createReservasTabStyles(theme), [theme]);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);

  const handleWheel = (event: any) => {
    if (Platform.OS !== 'web') return;
    const delta = Number(event?.deltaY ?? event?.nativeEvent?.deltaY ?? 0);
    if (!delta) return;
    event?.preventDefault?.();
    const nextOffset = Math.max(0, scrollOffsetRef.current + delta);
    scrollRef.current?.scrollTo({ x: nextOffset, animated: false });
    scrollOffsetRef.current = nextOffset;
  };

  return (
    <>
      <BlurViewCompat
        intensity={50}
        tint={isDarkMode ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFill,
          { paddingTop: headerHeight + 10, height: headerHeight + 74 },
        ]}
      />
      <View style={[styles.dateSelector, { paddingTop: headerHeight + 10 }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
          onScroll={(event) => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.x || 0;
          }}
          scrollEventThrottle={16}
          {...(Platform.OS === 'web' ? ({ onWheel: handleWheel } as any) : {})}
        >
          <TouchableOpacity
            style={[styles.dateChip, styles.dateChipSelected]}
            onPress={() => onSelectDate(selectedDateChips[0])}
            activeOpacity={0.9}
          >
            <Text style={[styles.dateChipText, styles.dateChipTextSelected]}>
              {formatDateDisplay(selectedDateChips[0], locale)}
            </Text>
            <TouchableOpacity
              onPress={() => onSelectDate(availableDays[0])}
              style={styles.dateChipRemove}
              hitSlop={8}
            >
              <Text style={styles.dateChipRemoveText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.dateSeparator} />

          {selectedDateChips.slice(1).map((item) => {
            const isSelected = sameDay(item, selectedDate);
            return (
              <TouchableOpacity
                key={item.toISOString()}
                style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                onPress={() => onSelectDate(item)}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.dateChipText,
                    isSelected && styles.dateChipTextSelected,
                  ]}
                >
                  {formatDateDisplay(item, locale)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.calendarButton}
          onPress={onOpenCalendar}
        >
          <Ionicons name="calendar" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </>
  );
}
