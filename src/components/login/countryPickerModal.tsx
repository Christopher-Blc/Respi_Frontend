import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../context/ThemeContext';
import { GlassTextInput } from './glassTextInput';

export type Country = {
  code: string;
  flag: string;
  name: string;
};

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+385', flag: '🇭🇷', name: 'Croacia' },
  { code: '+357', flag: '🇨🇾', name: 'Chipre' },
  { code: '+420', flag: '🇨🇿', name: 'Chequia' },
  { code: '+45', flag: '🇩🇰', name: 'Dinamarca' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+358', flag: '🇫🇮', name: 'Finlandia' },
  { code: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: '+30', flag: '🇬🇷', name: 'Grecia' },
  { code: '+36', flag: '🇭🇺', name: 'Hungría' },
  { code: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: '+371', flag: '🇱🇻', name: 'Letonia' },
  { code: '+370', flag: '🇱🇹', name: 'Lituania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxemburgo' },
  { code: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: '+31', flag: '🇳🇱', name: 'Países Bajos' },
  { code: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: '+48', flag: '🇵🇱', name: 'Polonia' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+40', flag: '🇷🇴', name: 'Rumanía' },
  { code: '+421', flag: '🇸🇰', name: 'Eslovaquia' },
  { code: '+386', flag: '🇸🇮', name: 'Eslovenia' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+46', flag: '🇸🇪', name: 'Suecia' },
  { code: '+41', flag: '🇨🇭', name: 'Suiza' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
];

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
          <BlurView
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
                          color: isActive
                            ? theme.primaryButton
                            : theme.textBody,
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
                            ? theme.primaryButton
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
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: 300,
    maxHeight: 420,
    borderRadius: 22,
    borderWidth: 0.8,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  searchWrapper: {
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  list: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderBottomWidth: 0.3,
    gap: 10,
  },
  flag: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  countryName: {
    flex: 1,
    fontSize: 14,
  },
  code: {
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
});
