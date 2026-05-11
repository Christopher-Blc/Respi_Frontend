export const addSoftBreaks = (value: string, chunkSize = 12): string => {
  if (!value || value.length <= chunkSize || /\s/.test(value)) {
    return value;
  }

  return (
    value.match(new RegExp(`.{1,${chunkSize}}`, 'g'))?.join('\u200B') ?? value
  );
};
