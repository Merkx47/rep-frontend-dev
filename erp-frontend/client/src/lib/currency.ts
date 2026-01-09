// Currency configuration and formatting utilities
// Supports multiple currencies with real-time exchange rate conversion

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastUpdated: Date;
}

// Supported currencies
export const CURRENCIES: Record<string, Currency> = {
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', locale: 'en-GH' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE' },
  XOF: { code: 'XOF', symbol: 'CFA', name: 'CFA Franc', locale: 'fr-SN' },
};

// Default currency
export const DEFAULT_CURRENCY = 'NGN';

// Currency storage key
const CURRENCY_STORAGE_KEY = 'qucoon-preferred-currency';
const RATES_STORAGE_KEY = 'qucoon-exchange-rates';

// Get preferred currency from localStorage
export function getPreferredCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  return localStorage.getItem(CURRENCY_STORAGE_KEY) || DEFAULT_CURRENCY;
}

// Set preferred currency
export function setPreferredCurrency(currencyCode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  window.dispatchEvent(new CustomEvent('currency-changed', { detail: currencyCode }));
}

// Get cached exchange rates
export function getCachedRates(): ExchangeRates | null {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(RATES_STORAGE_KEY);
  if (!cached) return null;

  try {
    const rates = JSON.parse(cached) as ExchangeRates;
    // Check if rates are less than 1 hour old
    const lastUpdated = new Date(rates.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

    if (hoursSinceUpdate < 1) {
      return rates;
    }
    return null;
  } catch {
    return null;
  }
}

// Cache exchange rates
export function cacheRates(rates: ExchangeRates): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify({
    ...rates,
    lastUpdated: new Date(),
  }));
}

// Fallback rates (approximate, for when API is unavailable)
// These rates are relative to NGN as base
export const FALLBACK_RATES: Record<string, number> = {
  NGN: 1,
  USD: 0.00063,    // 1 NGN ≈ 0.00063 USD (1 USD ≈ 1600 NGN)
  EUR: 0.00058,    // 1 NGN ≈ 0.00058 EUR
  GBP: 0.00050,    // 1 NGN ≈ 0.00050 GBP
  CAD: 0.00085,    // 1 NGN ≈ 0.00085 CAD
  AUD: 0.00096,    // 1 NGN ≈ 0.00096 AUD
  ZAR: 0.0115,     // 1 NGN ≈ 0.0115 ZAR
  GHS: 0.0095,     // 1 NGN ≈ 0.0095 GHS
  KES: 0.081,      // 1 NGN ≈ 0.081 KES
  XOF: 0.38,       // 1 NGN ≈ 0.38 XOF
};

// Format currency with proper locale and symbol
export function formatCurrency(
  amount: number | string,
  currencyCode: string = DEFAULT_CURRENCY,
  options: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';

  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  const {
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  try {
    if (compact && Math.abs(num) >= 1000000) {
      // Compact notation for large numbers (e.g., 1.5M, 2.3B)
      const formatter = new Intl.NumberFormat(currency.locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      });
      return showSymbol ? `${currency.symbol}${formatter.format(num)}` : formatter.format(num);
    }

    const formatter = new Intl.NumberFormat(currency.locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency.code,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(num);
  } catch {
    // Fallback formatting
    const formatted = num.toLocaleString('en', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return showSymbol ? `${currency.symbol}${formatted}` : formatted;
  }
}

// Convert amount from one currency to another
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = FALLBACK_RATES
): number {
  if (fromCurrency === toCurrency) return amount;

  // Convert to NGN first (base currency), then to target
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // If rates are relative to NGN (from = 1 means 1 NGN = X foreign)
  // amount in NGN = amount / fromRate (to NGN)
  // amount in target = amountInNGN * toRate

  // If fromCurrency is NGN
  if (fromCurrency === 'NGN') {
    return amount * toRate;
  }

  // If toCurrency is NGN
  if (toCurrency === 'NGN') {
    return amount / fromRate;
  }

  // Cross-currency conversion via NGN
  const amountInNGN = amount / fromRate;
  return amountInNGN * toRate;
}

// Format and convert in one step
export function formatWithConversion(
  amount: number | string,
  fromCurrency: string,
  toCurrency: string,
  rates?: Record<string, number>,
  options?: Parameters<typeof formatCurrency>[2]
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';

  const converted = convertCurrency(num, fromCurrency, toCurrency, rates);
  return formatCurrency(converted, toCurrency, options);
}

// Get exchange rate between two currencies
export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = FALLBACK_RATES
): number {
  if (fromCurrency === toCurrency) return 1;

  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  if (fromCurrency === 'NGN') {
    return toRate;
  }

  if (toCurrency === 'NGN') {
    return 1 / fromRate;
  }

  return toRate / fromRate;
}

// Format rate display (e.g., "1 USD = 1,600 NGN")
export function formatExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = FALLBACK_RATES
): string {
  const rate = getExchangeRate(fromCurrency, toCurrency, rates);
  const fromCurr = CURRENCIES[fromCurrency];
  const toCurr = CURRENCIES[toCurrency];

  if (!fromCurr || !toCurr) return '';

  const formattedRate = rate >= 1
    ? rate.toLocaleString('en', { maximumFractionDigits: 2 })
    : rate.toFixed(6);

  return `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  // Remove currency symbols and formatting
  const cleaned = value.replace(/[₦$€£C$A$R₵KSh,\s]/g, '');
  return parseFloat(cleaned) || 0;
}
