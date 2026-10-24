const timeZone = 'Asia/Shanghai';

export const getPostYear = (date: Date): string =>
  new Intl.DateTimeFormat('en', { year: 'numeric', timeZone }).format(date);

export const formatPostDate = (date: Date): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(date);
  return `${parts.find((part) => part.type === 'month')?.value}-${parts.find((part) => part.type === 'day')?.value}`;
};
