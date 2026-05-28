import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { BlurViewCompat } from '../general/BlurViewCompat';
import { useAppTheme } from '../../context/ThemeContext';
import { countryPickerModalStyles as styles } from '../../style/auth/loginComponents.styles';
import { GlassTextInput } from './glassTextInput';
import { Country, EUROPEAN_COUNTRIES } from '../../types/utilsTypes';

type Props = {
  visible: boolean;
  selected: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
};

export const CountryPickerModal: React.FC<Props> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return EUROPEAN_COUNTRIES;
    return EUROPEAN_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q),
    );
  }, [query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (country: Country) => {
    setQuery('');
    onSelect(country);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        {/* Inner Pressable stops tap propagation so the card doesn't close */}
        <Pressable onPress={() => {}}>
          <BlurViewCompat
            tint={isDarkMode ? 'dark' : 'light'}
            intensity={50}
            style={[styles.card, { borderColor: theme.textSubtle }]}
          >
            {/* Header */}
            <Text style={[styles.title, { color: theme.textTitle }]}>
              Prefijo de país
            </Text>

            {/* Search bar */}
            <View style={styles.searchWrapper}>
              <GlassTextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar país o prefijo…"
                autoComplete="off"
              />
            </View>

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code + item.name}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text
                  style={[styles.emptyText, { color: theme.grayLabelText }]}
                >
                  Sin resultados
                </Text>
              }
              renderItem={({ item }) => {
                const isActive =
                  item.code === selected.code && item.name === selected.name;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.row,
                      {
                        borderBottomColor: theme.borderInput,
                        backgroundColor: isActive
                          ? `${theme.primaryButton}28`
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countryName,
                        {
                          color: isActive ? theme.inputFocus : theme.textBody,
                          fontWeight: isActive ? '700' : '400',
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.code,
                        {
                          color: isActive
                            ? theme.inputFocus
                            : theme.grayLabelText,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {item.code}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </BlurViewCompat>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

