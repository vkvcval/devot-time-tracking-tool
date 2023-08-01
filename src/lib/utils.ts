export const getCurrentUTCDate = () => {
  const UTCTimestamp = new Date().setUTCHours(0, 0, 0, 0);
  return new Date(UTCTimestamp).toISOString();
};

export const formatSecondsToHMS = (seconds: number) => {
  const leftoverSeconds = seconds % 60;
  const minutes = (seconds - leftoverSeconds) / 60;
  const leftoverMinutes = minutes % 60;
  const hours = (minutes - leftoverMinutes) / 60;
  const lefoverHours = hours % 24;
  const days = (hours - lefoverHours) / 24;

  const result = { days, hours: lefoverHours, minutes: leftoverMinutes, seconds: leftoverSeconds };

  return `${result.days ? `${result.days}d ` : ''}${result.hours > 9 ? result.hours : `0${result.hours}`}:${
    result.minutes > 9 ? result.minutes : `0${result.minutes}`
  }:${result.seconds > 9 ? result.seconds : `0${result.seconds}`}`;
};

export const getTimestamp = () => {
  return Math.round(Date.now() / 1000);
};
