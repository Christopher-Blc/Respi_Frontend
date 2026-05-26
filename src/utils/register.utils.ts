export const normalizePhone = (value: string): string => value.replace(/\s+/g, '');

export const createLocalDate = (
  year: number,
  month: number,
  day: number,
): Date => {
  return new Date(year, month, day, 12, 0, 0, 0);
};

export const formatLocalDateForApi = (value: Date): string => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (value: Date): string => {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseBirthDate = (value: string): Date | null => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsed = createLocalDate(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

export const getYesterday = (): Date => {
  const today = new Date();
  return createLocalDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
};

export const formatBirthDateInput = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned;

  if (cleaned.length > 2) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  if (cleaned.length > 4) {
    formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
  }

  return formatted.slice(0, 10);
};

export type RegisterRequiredFields = {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  phone: string;
  birthDate: string;
};

export const hasRequiredRegisterFields = (
  fields: RegisterRequiredFields,
): boolean => {
  return Boolean(
    fields.email &&
      fields.password &&
      fields.name &&
      fields.surname &&
      fields.username &&
      fields.phone &&
      fields.birthDate,
  );
};
