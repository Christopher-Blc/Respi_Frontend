import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';

type BookingStepBarProps = {
  currentStep: 1 | 2 | 3;
};

const DOT_SIZE = 26;
const LINE_HEIGHT = 2;
const LINE_MARGIN_TOP = DOT_SIZE / 2 - LINE_HEIGHT / 2;

export function BookingStepBar({ currentStep }: BookingStepBarProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const steps = [
    { key: 1 as const, label: t('bookingStepChooseCourt') },
    { key: 2 as const, label: t('bookingStepInfo') },
    { key: 3 as const, label: t('bookingStepConfirm') },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        {steps.map((step, index) => {
          const isCompleted = step.key < currentStep;
          const isCurrent = step.key === currentStep;

          const dotBg =
            isCompleted || isCurrent ? theme.primary : 'transparent';
          const dotBorder =
            isCompleted || isCurrent ? theme.primary : theme.borderDefault;
          const lineColor =
            step.key < currentStep ? theme.primary : theme.borderDefault;
          const labelColor = isCurrent
            ? theme.primary
            : isCompleted
              ? theme.textSecondary
              : theme.textMuted;

          return (
            <React.Fragment key={step.key}>
              <View style={styles.stepCol}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotBg, borderColor: dotBorder },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={theme.onPrimary}
                    />
                  ) : isCurrent ? (
                    <View
                      style={[
                        styles.innerDot,
                        { backgroundColor: theme.onPrimary },
                      ]}
                    />
                  ) : null}
                </View>
                <Text
                  style={[styles.label, { color: labelColor }]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: lineColor, marginTop: LINE_MARGIN_TOP },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    alignItems: 'center',
    width: 80,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  innerDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    height: LINE_HEIGHT,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
