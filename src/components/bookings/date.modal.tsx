import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import createDateModalStyles from '../../style/bookings/dateModal.styles';

interface Props {
  visible: boolean;
  onSave: (selectedDate: Date) => void;
  onClose: () => void;
  initialDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
}

const createLocalDate = (year: number, month: number, day: number) => {
  return new Date(year, month, day, 12, 0, 0, 0);
};

const getDefaultMinimumDate = () => createLocalDate(1900, 0, 1);

const getDefaultMaximumDate = () => createLocalDate(2100, 11, 31);

export default function DateModal({
  visible,
  onSave,
  onClose,
  initialDate,
  minimumDate,
  maximumDate,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createDateModalStyles(theme), [theme]);
  const safeMinimumDate = minimumDate ?? getDefaultMinimumDate();
  const safeMaximumDate = maximumDate ?? getDefaultMaximumDate();
  const safeInitialDate = initialDate ?? new Date();
  const [selectedDate, setSelectedDate] = useState(safeInitialDate);
  const webInputRef = useRef<HTMLInputElement>(null);

  const normalizeToLocalDay = (date: Date) =>
    createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const clampDate = (date: Date) => {
    const normalized = normalizeToLocalDay(date);
    if (normalized < safeMinimumDate)
      return normalizeToLocalDay(safeMinimumDate);
    if (normalized > safeMaximumDate)
      return normalizeToLocalDay(safeMaximumDate);
    return normalized;
  };

  const minInputValue = formatDateForInput(safeMinimumDate);
  const maxInputValue = formatDateForInput(safeMaximumDate);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(clampDate(date));
    }
  };

  const handleWebDateChange = (e: any) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split('-');
      const selected = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      setSelectedDate(clampDate(selected));
    }
  };

  useEffect(() => {
    if (visible) {
      setSelectedDate(clampDate(safeInitialDate));
    }

    if (visible && Platform.OS === 'web' && webInputRef.current) {
      setTimeout(() => {
        webInputRef.current?.showPicker?.();
      }, 100);
    }
  }, [visible, safeInitialDate, safeMinimumDate, safeMaximumDate]);

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };


  return (
    <Modal
      visible={visible}
      onRequestClose={handleCancel}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.headerText}>{t('commonCancel')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerText, styles.saveText]}>
            {t('commonSave')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.datePickerContainer}>
          {Platform.OS === 'web' ? (
            <input
              ref={webInputRef}
              type="date"
              min={minInputValue}
              max={maxInputValue}
              style={
                {
                  fontSize: 16,
                  padding: 12,
                  borderRadius: 8,
                  borderColor: theme.borderMain,
                  backgroundColor: theme.backgroundMain,
                  color: theme.textPrimary,
                  width: 200,
                } as React.CSSProperties
              }
              value={formatDateForInput(selectedDate)}
              onChange={handleWebDateChange}
            />
          ) : (
            <RNDateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={safeMinimumDate}
              maximumDate={safeMaximumDate}
              textColor={theme.textPrimary}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
