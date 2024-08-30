export const formatNumberDecimals = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
};

export const formatNumberMaxDecimals = (num: number, maxDecimals: number): string => {
  return num.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals
  });
};
