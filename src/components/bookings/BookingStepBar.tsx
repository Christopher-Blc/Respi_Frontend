import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
import { bookingStepBarStyles as styles, LINE_MARGIN_TOP } from '../../style/bookings/bookingStepBar.styles';

type BookingStepBarProps = {
  currentStep: 1 | 2 | 3;
};


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

