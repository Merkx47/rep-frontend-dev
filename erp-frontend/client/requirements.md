## Packages
recharts | Dashboard analytics and data visualization
framer-motion | Smooth transitions and layout animations
date-fns | Date formatting and manipulation
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes
lucide-react | Icons for the UI

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
Authentication uses cookie-based sessions with `credentials: "include"`.
All numeric fields from forms should be coerced using `z.coerce.number()`.
API returns dates as strings, `z.coerce.date()` needed in schemas if validating on client, or handle as strings.
Currency formatting should default to NGN (Nigerian Naira).
