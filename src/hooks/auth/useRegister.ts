import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Country } from '../../types/utilsTypes';
import {
  createLocalDate,
  formatBirthDateInput,
  formatDateForDisplay,
  formatLocalDateForApi,
  getYesterday,
  hasRequiredRegisterFields,
  normalizePhone,
  parseBirthDate,
} from '../../utils/register.utils';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: '+34',
    flag: '🇪🇸',
    name: 'España',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const minBirthDate = createLocalDate(1900, 0, 1);
  const maxBirthDate = getYesterday();
  const maxBirthDateForApi = formatLocalDateForApi(maxBirthDate);

  const handlePhoneChange = (value: string) => {
    setPhone(normalizePhone(value));
  };

  const parseWebDateInput = (value: string): Date | null => {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    return createLocalDate(year, month - 1, day);
  };

  const handleTextChange = (text: string) => {
    setBirthDate(formatBirthDateInput(text));
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowPicker(false);
    }

    if (selectedDate) {
      const normalizedDate = createLocalDate(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );

      setBirthDate(formatDateForDisplay(normalizedDate));
      setDate(normalizedDate);
    }
  };

  const handleSubmit = async () => {
    const sanitizedPhone = normalizePhone(phone);
    const parsedBirthDate = parseBirthDate(birthDate);

    if (
      !hasRequiredRegisterFields({
        email,
        password,
        name,
        surname,
        username,
        phone: sanitizedPhone,
        birthDate,
      })
    ) {
      setError(t('authLoginEmptyFields'));
      return;
    }

    if (!parsedBirthDate) {
      setError('Introduce una fecha válida en formato DD/MM/YYYY');
      return;
    }

    const yesterday = getYesterday();
    if (parsedBirthDate.getTime() > yesterday.getTime()) {
      setError('La fecha de nacimiento debe ser anterior a hoy');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const response = await api.post('/auth/register', {
        username,
        name,
        surname,
        email: email.toLowerCase(),
        phone: `${selectedCountry.code}${sanitizedPhone}`,
        password,
        date_of_birth: formatLocalDateForApi(parsedBirthDate),
        address: '-',
      });

      if (response.status === 201) {
        router.push({
          pathname: '/confirm-email',
          params: { email: email.toLowerCase() },
        });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || t('authConnectionError');
      console.log('Error en registro:', err.response?.data || err.message);
      setError(Array.isArray(message) ? message[0] : message);
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    username,
    setUsername,
    surname,
    setSurname,
    email,
    setEmail,
    phone,
    handlePhoneChange,
    password,
    setPassword,
    birthDate,
    date,
    showPicker,
    setShowPicker,
    isPhoneFocused,
    setIsPhoneFocused,
    showCountryPicker,
    setShowCountryPicker,
    selectedCountry,
    setSelectedCountry,
    minBirthDate,
    maxBirthDate,
    maxBirthDateForApi,
    parseWebDateInput,
    error,
    isLoading,
    handleTextChange,
    onDateChange,
    handleSubmit,
  };
};
