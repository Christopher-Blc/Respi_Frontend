import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onSave: (selectedDate: Date) => void;
  onClose: () => void;
}

export default function DateModal({ visible, onSave, onClose }: Props) {
  const { theme } = useAppTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const webInputRef = useRef<HTMLInputElement>(null);

  const createLocalDate = (year: number, month: number, day: number) => {
    return new Date(year, month, day, 12, 0, 0, 0);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      const localDate = createLocalDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      setSelectedDate(localDate);
    }
  };

  const handleWebDateChange = (e: any) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split('-');
      const selected = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      setSelectedDate(selected);
    }
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (visible && Platform.OS === 'web' && webInputRef.current) {
      setTimeout(() => {
        webInputRef.current?.showPicker?.();
      }, 100);
    }
  }, [visible]);

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderMain,
      backgroundColor: theme.backgroundMain,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textBody,
    },
    saveText: {
      color: theme.primary,
      fontWeight: '700',
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundMain,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    datePickerContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={handleCancel}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.headerText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerText, styles.saveText]}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.datePickerContainer}>
          {Platform.OS === 'web' ? (
            <input
              ref={webInputRef}
              type="date"
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
              minimumDate={createLocalDate(1900, 0, 1)}
              maximumDate={new Date()}
              textColor={theme.textPrimary}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
