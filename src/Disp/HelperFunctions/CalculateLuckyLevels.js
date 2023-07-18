const SPECIAL_DIGIT = 7;

/**
 * Count the number of 7s in any number
 * @param	{Number|BigInt}	number	The number to count sevens for
 * @returns	{Number}	The number of 7s in the provided number
 */
export function CountSevens(number) {
  const numberAsString = `${number}`;

  const regex = new RegExp(`${SPECIAL_DIGIT}`, 'g');
  const matches = numberAsString.match(regex) || [];

  return matches.length;
}

/**
 * Calculate the delta for the next number where the given digit is a 7
 * @param	{Number|BigInt}	number			The starting number to calculate the delta for
 * @param	{Number}	digitPlace	1 for ones place, 10 for tens place, 100 for hundreds place, etc
 * @returns	{Number}	The calculated delta
 */
export function CalculateSevenDelta(number, digitPlace) {
  const target = SPECIAL_DIGIT * digitPlace;
  const modulus = digitPlace * 10;

  let delta = target - (Number(number) % modulus) + (Number(number) % digitPlace);
  if (delta < 0) delta += modulus;

  return delta;
}

/**
 * This function calculates each of the next "lucky" prestige levels. Imprecise with very large numbers.
 * @param	{Number}	currentLevel	The user's prestige level, including levels earned since the last ascension
 * @returns	{{Number}, {Number}, {Number}}	luckyDigit, luckyNumber, luckyPayout	The next eligible level for each upgrade
 */
export default function CalculateLuckyLevels(currentLevel) {
  const result = {};
  let localLevel = BigInt(currentLevel);
  let sevenCount = CountSevens(localLevel);

  if (sevenCount < 1) {
    // find the next 7 for the ones digit
    const delta = CalculateSevenDelta(localLevel, 1);

    localLevel += BigInt(delta);
    sevenCount = CountSevens(localLevel);
  }

  result.luckyDigit = Number(localLevel);

  while (sevenCount < 2) {
    // find the next 7 in the ones or tens digit
    let delta = CalculateSevenDelta(localLevel, 1);
    if (delta === 0) delta = CalculateSevenDelta(localLevel, 10);

    localLevel += BigInt(delta);
    sevenCount = CountSevens(localLevel);
  }

  result.luckyNumber = Number(localLevel);

  let digitPlace = 1;
  while (sevenCount < 4) {
    // look for missing 7s in the ones, tens, hundreds, thousands digits
    const delta = CalculateSevenDelta(localLevel, digitPlace);
    if (delta === 0) {
      digitPlace *= 10;
    } else {
      localLevel += BigInt(delta);
      sevenCount = CountSevens(localLevel);
    }
  }

  result.luckyPayout = Number(localLevel);

  return result;
}
