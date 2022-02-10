import { Types } from '@/declarations';
import BigNumber from 'bignumber.js';

/**
 * Converts a value to a BigNumber
 */
export const toBigNumber = (num?: Types.Number): BigNumber => {
  return new BigNumber(Number(num || 0));
};

/**
 * Create a exponential notation by given decimals
 */
export const exponential = (decimals: Types.Number): BigNumber => {
  return new BigNumber(10).pow(toBigNumber(decimals));
};

const fixStringEnding = (str: string): string => {
  return str.replace(/0+$/, '').replace(/\.$/, '');
};

/**
 * Formats an amount to a small string with scientific notation
 */
export const formatAmount = (amount: Types.Amount): string => {
  const [nat = '0', decimals = '0'] = amount.replace(/^0+/, '').split('.');

  const isNegative = Math.sign(Number(amount)) === -1;

  const thousands = Math.floor(Math.log10(Math.abs(Number(nat))));

  if (thousands < 3) {
    if (!Number(nat) && /^00/.test(decimals)) {
      return `${isNegative ? '> -' : '< '}0.01`;
    }
    return fixStringEnding(`${nat || 0}.${decimals.slice(0, 2)}`);
  } else if (thousands < 6) {
    return fixStringEnding(`${nat.slice(0, -3)}.${nat.slice(-3, -1)}`) + 'k';
  } else if (thousands < 9) {
    return fixStringEnding(`${nat.slice(0, -6)}.${nat.slice(-6, -4)}`) + 'M';
  } else {
    return `${isNegative ? '< -' : '> '}999M`;
  }
};

export type CheckIfOptions = {
  isZero?: boolean;
  isNotANumber?: boolean;
  isNegative?: boolean;
};

export function checkIfObject(
  object: {
    [key: string]: BigNumber;
  },
  options: CheckIfOptions
): boolean {
  let isMatch = false;
  const values = Object.values(object);

  for (const value of values) {
    if (options.isZero && value.isZero()) {
      isMatch = true;
    }
    if (options.isNotANumber && value.isNaN()) {
      isMatch = true;
    }
    if (options.isNegative && value.isNegative()) {
      isMatch = true;
    }
  }

  return isMatch;
}
