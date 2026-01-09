import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  ExchangeRates,
  FALLBACK_RATES,
  formatCurrency,
  convertCurrency,
  formatWithConversion,
  getExchangeRate,
  formatExchangeRate,
  getPreferredCurrency,
  setPreferredCurrency,
  getCachedRates,
  cacheRates,
} from "@/lib/currency";

// Exchange rate API configuration
// Using exchangerate.host - free tier with no API key required
// Alternative: Use frankfurter.app or open.er-api.com
const EXCHANGE_RATE_API = "https://api.exchangerate.host/latest";

interface ExchangeRateAPIResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Fetch latest exchange rates from API
async function fetchExchangeRates(baseCurrency: string = "NGN"): Promise<ExchangeRates> {
  // Check cache first
  const cached = getCachedRates();
  if (cached && cached.base === baseCurrency) {
    return cached;
  }

  try {
    // Fetch from API
    const symbols = Object.keys(CURRENCIES).join(",");
    const response = await fetch(
      `${EXCHANGE_RATE_API}?base=${baseCurrency}&symbols=${symbols}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data: ExchangeRateAPIResponse = await response.json();

    if (!data.success && !data.rates) {
      throw new Error("Invalid API response");
    }

    const rates: ExchangeRates = {
      base: data.base || baseCurrency,
      date: data.date || new Date().toISOString().split("T")[0],
      rates: data.rates || {},
      lastUpdated: new Date(),
    };

    // Cache the rates
    cacheRates(rates);

    return rates;
  } catch (error) {
    console.warn("Failed to fetch exchange rates, using fallback rates:", error);

    // Return fallback rates
    return {
      base: "NGN",
      date: new Date().toISOString().split("T")[0],
      rates: FALLBACK_RATES,
      lastUpdated: new Date(),
    };
  }
}

// Alternative API fetch using frankfurter.app (more reliable, but limited currencies)
async function fetchExchangeRatesAlternative(baseCurrency: string = "EUR"): Promise<ExchangeRates> {
  const cached = getCachedRates();
  if (cached) {
    return cached;
  }

  try {
    // Frankfurter doesn't support NGN directly, so we use USD as intermediary
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=USD`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    // Convert rates to be NGN-based using approximate USD/NGN rate
    const usdToNgn = 1600; // Approximate rate
    const ngnBasedRates: Record<string, number> = {
      NGN: 1,
      USD: 1 / usdToNgn,
    };

    // Convert other rates
    Object.entries(data.rates as Record<string, number>).forEach(([currency, rate]) => {
      if (CURRENCIES[currency]) {
        // rate is USD to currency, we need NGN to currency
        ngnBasedRates[currency] = rate / usdToNgn;
      }
    });

    const rates: ExchangeRates = {
      base: "NGN",
      date: data.date,
      rates: ngnBasedRates,
      lastUpdated: new Date(),
    };

    cacheRates(rates);
    return rates;
  } catch (error) {
    console.warn("Failed to fetch from alternative API:", error);
    return {
      base: "NGN",
      date: new Date().toISOString().split("T")[0],
      rates: FALLBACK_RATES,
      lastUpdated: new Date(),
    };
  }
}

// Hook for exchange rates
export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: () => fetchExchangeRatesAlternative(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

// Hook for currency preference and formatting
export function useCurrency() {
  const queryClient = useQueryClient();
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const { data: exchangeRates, isLoading: ratesLoading, refetch: refetchRates } = useExchangeRates();

  // Initialize from localStorage
  useEffect(() => {
    setCurrencyState(getPreferredCurrency());
  }, []);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent<string>) => {
      setCurrencyState(event.detail);
    };

    window.addEventListener("currency-changed", handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener("currency-changed", handleCurrencyChange as EventListener);
    };
  }, []);

  // Set currency preference
  const setCurrency = useCallback((code: string) => {
    setPreferredCurrency(code);
    setCurrencyState(code);
  }, []);

  // Format amount in preferred currency
  const format = useCallback(
    (amount: number | string, options?: Parameters<typeof formatCurrency>[2]) => {
      return formatCurrency(amount, currency, options);
    },
    [currency]
  );

  // Format amount in specific currency
  const formatIn = useCallback(
    (amount: number | string, currencyCode: string, options?: Parameters<typeof formatCurrency>[2]) => {
      return formatCurrency(amount, currencyCode, options);
    },
    []
  );

  // Convert and format from NGN to preferred currency
  const formatConverted = useCallback(
    (
      amountInNGN: number | string,
      options?: Parameters<typeof formatCurrency>[2]
    ) => {
      const rates = exchangeRates?.rates || FALLBACK_RATES;
      return formatWithConversion(amountInNGN, "NGN", currency, rates, options);
    },
    [currency, exchangeRates]
  );

  // Convert amount between currencies
  const convert = useCallback(
    (amount: number, from: string, to: string) => {
      const rates = exchangeRates?.rates || FALLBACK_RATES;
      return convertCurrency(amount, from, to, rates);
    },
    [exchangeRates]
  );

  // Get exchange rate
  const getRate = useCallback(
    (from: string, to: string) => {
      const rates = exchangeRates?.rates || FALLBACK_RATES;
      return getExchangeRate(from, to, rates);
    },
    [exchangeRates]
  );

  // Format exchange rate display
  const formatRate = useCallback(
    (from: string, to: string) => {
      const rates = exchangeRates?.rates || FALLBACK_RATES;
      return formatExchangeRate(from, to, rates);
    },
    [exchangeRates]
  );

  return {
    // Current state
    currency,
    currencyInfo: CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY],
    currencies: CURRENCIES,
    rates: exchangeRates?.rates || FALLBACK_RATES,
    ratesLastUpdated: exchangeRates?.lastUpdated,
    ratesLoading,

    // Actions
    setCurrency,
    refetchRates,

    // Formatting functions
    format,
    formatIn,
    formatConverted,

    // Conversion functions
    convert,
    getRate,
    formatRate,
  };
}

// Hook for currency conversion with specific amount
export function useCurrencyConversion(
  amount: number,
  fromCurrency: string = "NGN"
) {
  const { currency, convert, format, rates, ratesLoading } = useCurrency();

  const convertedAmount = convert(amount, fromCurrency, currency);
  const formattedOriginal = formatCurrency(amount, fromCurrency);
  const formattedConverted = format(convertedAmount);

  return {
    originalAmount: amount,
    originalCurrency: fromCurrency,
    convertedAmount,
    targetCurrency: currency,
    formattedOriginal,
    formattedConverted,
    exchangeRate: getExchangeRate(fromCurrency, currency, rates),
    isLoading: ratesLoading,
  };
}

export default useCurrency;
