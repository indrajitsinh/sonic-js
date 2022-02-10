import { Types } from '@/declarations';
import BigNumber from 'bignumber.js';

interface ToBigNumberOptions {
  validate?: {
    isNaN?: boolean;
    isEmpty?: boolean;
    isNegative?: boolean;
  };
}

/**
 * Converts a value to a BigNumber
 */
export const toBigNumber = (
  num?: Types.Number,
  options?: ToBigNumberOptions
): BigNumber => {
  const value = new BigNumber(Number(num || 0));

  const {
    isEmpty = true,
    isNaN = true,
    isNegative = false,
  } = options?.validate || {};

  const zero = new BigNumber(0);

  if (isEmpty && value.isZero()) return zero;
  if (isNegative && value.isNegative()) return zero;
  if (isNaN && value.isNaN()) return zero;

  return value;
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
