export const getRangeNormalizedNumber = (
  value: number,
  minOutput: number,
  maxOutput: number,
): number => {
  // Apply a logarithmic function to compress large values, adding 1 to avoid log(0)
  const compressedValue: number = Math.log(value + 1);
  // Normalize the logarithmic value to a 0-1 range
  const normalized: number = compressedValue / (compressedValue + 1);
  // Scale the normalized value to the desired output range
  const output: number = minOutput + normalized * (maxOutput - minOutput);
  return output;
};
