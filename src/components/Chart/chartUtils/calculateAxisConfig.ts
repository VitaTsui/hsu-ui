/**
 * Calculates a suitable Y-axis range and interval, ensuring 0 is a tick point and the total tick count is fixed at 6
 * @param min minimum value
 * @param max maximum value
 * @returns { min, max, interval } Y-axis configuration
 */
export function calculateAxisConfig(
  min: number,
  max: number
): { min: number; max: number; interval: number } {
  // Choose a suitable rounding base according to the value's magnitude
  const getNiceNumber = (value: number) => {
    if (value === 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
    const normalized = value / magnitude;

    // Pick a "nice" number like 1, 2, 5, or 10
    let niceNormalized: number;
    if (normalized <= 1) niceNormalized = 1;
    else if (normalized <= 2) niceNormalized = 2;
    else if (normalized <= 5) niceNormalized = 5;
    else niceNormalized = 10;

    return niceNormalized * magnitude;
  };

  // Handle invalid data
  if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
    return { min: 0, max: 5, interval: 1 };
  }

  // If all data is 0, return default values (6 ticks: 0,1,2,3,4,5)
  if (min === 0 && max === 0) {
    return { min: 0, max: 5, interval: 1 };
  }

  // If the data spans 0 (has both positive and negative values)
  if (min < 0 && max > 0) {
    const absMax = Math.abs(max * 1.1);
    const absMin = Math.abs(min * 1.1);

    // Compute the total range, split into 5 intervals (6 ticks)
    const totalRange = absMax + absMin;
    const roughInterval = totalRange / 5;
    const interval = getNiceNumber(roughInterval);

    // Compute how many ticks are needed to cover the positive and negative data
    const negativeSteps = Math.ceil(absMin / interval);
    const positiveSteps = Math.ceil(absMax / interval);
    const totalSteps = negativeSteps + positiveSteps; // excluding 0

    // If the total tick count is exactly 6 (5 intervals + 0)
    if (totalSteps === 5) {
      return {
        min: -negativeSteps * interval,
        max: positiveSteps * interval,
        interval,
      };
    }

    // Otherwise, adjust to a fixed 5 intervals, distributed proportionally between the positive and negative sides
    const ratio = absMax / (absMax + absMin);
    const positiveIntervals = Math.round(ratio * 5);
    const negativeIntervals = 5 - positiveIntervals;

    return {
      min: -negativeIntervals * interval,
      max: positiveIntervals * interval,
      interval,
    };
  }

  // If all values are non-negative (fixed 6 ticks: 0 to max, split into 5 segments)
  if (min >= 0) {
    const roughMax = max * 1.1;
    const roughInterval = roughMax / 5;
    const interval = getNiceNumber(roughInterval);

    return {
      min: 0,
      max: interval * 5,
      interval,
    };
  }

  // If all values are negative (fixed 6 ticks: min to 0, split into 5 segments)
  const roughMin = Math.abs(min * 1.1);
  const roughInterval = roughMin / 5;
  const interval = getNiceNumber(roughInterval);

  return {
    min: -interval * 5,
    max: 0,
    interval,
  };
}
