export const getFormattedDateTimeStr = () => {
  const timestamp = new Date();
  const dateStr = [
    timestamp.getDate().toString().padStart(2, '0'),
    (timestamp.getMonth() + 1).toString().padStart(2, '0'),
    timestamp.getFullYear(),
  ].join('.');

  const timeStr = [
    timestamp.getHours().toString().padStart(2, '0'),
    timestamp.getMinutes().toString().padStart(2, '0'),
    timestamp.getSeconds().toString().padStart(2, '0'),
  ].join(':');

  return `${dateStr}, ${timeStr}`;
};
