export const getApiValueFromSliderValue = (value: number): number => {
  const factor = 10.24;
  const apiVal = Math.floor(Number(value) * factor);
  return apiVal;
};

export const getSliderValueFromApiValue = (value: number): number => {
  const factor = 10.24;
  const apiVal = Math.floor(Number(value) / factor);
  return apiVal;
};
