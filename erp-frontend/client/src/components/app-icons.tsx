import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Each module has its own unique color like Zoho
// Accounting: #4CAF50 (Green)
// HR: #E91E63 (Pink)
// Production: #607D8B (Blue Grey)
// Products: #FF9800 (Orange)
// Sales: #2196F3 (Blue)
// Services: #9C27B0 (Purple)
// Corporate Cards: #FFC107 (Amber)
// NRS E-Invoice: #F44336 (Red)
// Invoice: #3F51B5 (Indigo)
// Bank: #00BCD4 (Cyan)

// Accounting Icon - Ledger book with calculator elements (Green #4CAF50)
export const AccountingIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Book base */}
    <path d="M8 8C8 6.89543 8.89543 6 10 6H34C35.1046 6 36 6.89543 36 8V40C36 41.1046 35.1046 42 34 42H10C8.89543 42 8 41.1046 8 40V8Z" stroke="#4CAF50" strokeWidth="2.5" fill="none"/>
    {/* Book spine */}
    <path d="M12 6V42" stroke="#4CAF50" strokeWidth="2.5"/>
    {/* Calculator display */}
    <rect x="17" y="12" width="14" height="6" rx="1" fill="#4CAF50" fillOpacity="0.2" stroke="#4CAF50" strokeWidth="1.5"/>
    {/* Calculator buttons */}
    <rect x="17" y="22" width="4" height="4" rx="1" fill="#81C784"/>
    <rect x="24" y="22" width="4" height="4" rx="1" fill="#81C784"/>
    <rect x="17" y="29" width="4" height="4" rx="1" fill="#81C784"/>
    <rect x="24" y="29" width="4" height="4" rx="1" fill="#4CAF50"/>
    {/* Plus sign */}
    <path d="M40 16V24M36 20H44" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// HR Icon - People with organizational chart (Pink #E91E63)
export const HRIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Main person */}
    <circle cx="24" cy="12" r="6" stroke="#E91E63" strokeWidth="2.5" fill="none"/>
    <path d="M14 32C14 26.4772 18.4772 22 24 22C29.5228 22 34 26.4772 34 32" stroke="#E91E63" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Left person */}
    <circle cx="10" cy="26" r="4" stroke="#F48FB1" strokeWidth="2" fill="none"/>
    <path d="M4 40C4 36.134 7.13401 33 11 33" stroke="#F48FB1" strokeWidth="2" strokeLinecap="round"/>
    {/* Right person */}
    <circle cx="38" cy="26" r="4" stroke="#F48FB1" strokeWidth="2" fill="none"/>
    <path d="M44 40C44 36.134 40.866 33 37 33" stroke="#F48FB1" strokeWidth="2" strokeLinecap="round"/>
    {/* Connection lines */}
    <path d="M24 22V18M24 18L14 24M24 18L34 24" stroke="#E91E63" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
  </svg>
);

// Production Icon - Factory with gears (Blue Grey #607D8B)
export const ProductionIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Factory building */}
    <path d="M4 42V22L14 16V22L24 16V22L34 16V42H4Z" stroke="#607D8B" strokeWidth="2.5" fill="none"/>
    {/* Chimney */}
    <rect x="8" y="8" width="6" height="14" stroke="#607D8B" strokeWidth="2" fill="none"/>
    {/* Smoke */}
    <path d="M11 8C11 8 9 4 11 2" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 6C13 4 13 2 15 1" stroke="#90A4AE" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Gear */}
    <circle cx="38" cy="30" r="8" stroke="#607D8B" strokeWidth="2.5" fill="none"/>
    <circle cx="38" cy="30" r="3" fill="#607D8B"/>
    {/* Gear teeth */}
    <path d="M38 20V24M38 36V40M46 30H42M34 30H30M44.5 23.5L41.5 26.5M31.5 36.5L34.5 33.5M44.5 36.5L41.5 33.5M31.5 23.5L34.5 26.5" stroke="#607D8B" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Products Icon - Box with barcode/tag (Orange #FF9800)
export const ProductsIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Main box */}
    <path d="M6 16L24 6L42 16V36L24 46L6 36V16Z" stroke="#FF9800" strokeWidth="2.5" fill="none"/>
    {/* Box top fold */}
    <path d="M6 16L24 26L42 16" stroke="#FF9800" strokeWidth="2.5"/>
    <path d="M24 26V46" stroke="#FF9800" strokeWidth="2.5"/>
    {/* Barcode lines */}
    <rect x="14" y="30" width="2" height="8" fill="#FF9800"/>
    <rect x="18" y="30" width="1" height="8" fill="#FF9800"/>
    <rect x="21" y="30" width="3" height="8" fill="#FF9800"/>
    {/* Tag */}
    <circle cx="38" cy="10" r="6" fill="#FFE0B2" stroke="#FF9800" strokeWidth="2"/>
    <path d="M36 10H40M38 8V12" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Sales Icon - Shopping cart with upward trend (Blue #2196F3)
export const SalesIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Cart body */}
    <path d="M8 8H12L18 28H36L42 12H16" stroke="#2196F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Cart wheels */}
    <circle cx="20" cy="36" r="4" stroke="#2196F3" strokeWidth="2.5" fill="none"/>
    <circle cx="34" cy="36" r="4" stroke="#2196F3" strokeWidth="2.5" fill="none"/>
    {/* Upward trend arrow */}
    <path d="M26 6L34 6M34 6V14M34 6L24 16" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Services Icon - Wrench and support badge (Purple #9C27B0)
export const ServicesIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Wrench */}
    <path d="M12 36L26 22C24.5 18 25 14 28 11C31 8 36 7 40 9L34 15L35 19L39 20L45 14C47 18 46 23 43 26C40 29 36 29.5 32 28L18 42C17 43 15 43 14 42L12 40C11 39 11 37 12 36Z" stroke="#9C27B0" strokeWidth="2.5" fill="none"/>
    {/* Support badge */}
    <circle cx="14" cy="14" r="10" stroke="#9C27B0" strokeWidth="2" fill="#E1BEE7"/>
    {/* Checkmark in badge */}
    <path d="M10 14L13 17L19 11" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Corporate Cards Icon - Credit card with shield (Amber #FFC107)
export const CorporateCardsIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Card */}
    <rect x="4" y="12" width="32" height="24" rx="3" stroke="#FFC107" strokeWidth="2.5" fill="none"/>
    {/* Card stripe */}
    <rect x="4" y="18" width="32" height="6" fill="#FFC107" fillOpacity="0.3"/>
    {/* Card chip */}
    <rect x="10" y="26" width="8" height="6" rx="1" stroke="#FFD54F" strokeWidth="1.5" fill="none"/>
    <path d="M12 26V32M16 26V32M10 29H18" stroke="#FFD54F" strokeWidth="1"/>
    {/* Shield */}
    <path d="M38 8C38 8 44 10 44 10V20C44 26 38 32 38 32C38 32 32 26 32 20V10C32 10 38 8 38 8Z" fill="#FFF8E1" stroke="#FFC107" strokeWidth="2"/>
    {/* Checkmark in shield */}
    <path d="M35 18L37 20L42 15" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// NRS E-Invoice Icon - Document with official stamp (Red #F44336)
export const NRSInvoiceIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Document */}
    <path d="M10 6H30L38 14V42H10V6Z" stroke="#F44336" strokeWidth="2.5" fill="none"/>
    {/* Document fold */}
    <path d="M30 6V14H38" stroke="#F44336" strokeWidth="2.5"/>
    {/* Lines on document */}
    <path d="M16 22H32M16 28H28M16 34H24" stroke="#F44336" strokeWidth="2" strokeLinecap="round"/>
    {/* Official stamp circle */}
    <circle cx="30" cy="34" r="8" stroke="#F44336" strokeWidth="2" fill="#FFEBEE"/>
    {/* NRS text in stamp */}
    <text x="30" y="36" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#F44336">NRS</text>
    {/* Star in stamp */}
    <path d="M30 28L31 30L33 30L31.5 31.5L32 34L30 32.5L28 34L28.5 31.5L27 30L29 30L30 28Z" fill="#F44336"/>
  </svg>
);

// Invoice Icon - Receipt with checkmark (Indigo #3F51B5)
export const InvoiceIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Receipt body */}
    <path d="M12 4L16 8L20 4L24 8L28 4L32 8L36 4V40L32 44L28 40L24 44L20 40L16 44L12 40V4Z" stroke="#3F51B5" strokeWidth="2.5" fill="none"/>
    {/* Receipt lines */}
    <path d="M18 14H30" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 20H30" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 26H24" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round"/>
    {/* Checkmark circle */}
    <circle cx="38" cy="32" r="8" fill="#E8EAF6" stroke="#3F51B5" strokeWidth="2"/>
    <path d="M34 32L37 35L42 30" stroke="#3F51B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Amount */}
    <text x="24" y="35" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3F51B5">₦</text>
  </svg>
);

// Bank Icon - Bank building with coins (Cyan #00BCD4)
export const BankIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Bank roof */}
    <path d="M6 18L24 6L42 18H6Z" stroke="#00BCD4" strokeWidth="2.5" fill="none"/>
    {/* Bank base */}
    <rect x="8" y="18" width="32" height="4" fill="#00BCD4" fillOpacity="0.2" stroke="#00BCD4" strokeWidth="1.5"/>
    {/* Pillars */}
    <rect x="12" y="22" width="4" height="14" stroke="#00BCD4" strokeWidth="2" fill="none"/>
    <rect x="22" y="22" width="4" height="14" stroke="#00BCD4" strokeWidth="2" fill="none"/>
    <rect x="32" y="22" width="4" height="14" stroke="#00BCD4" strokeWidth="2" fill="none"/>
    {/* Bank bottom */}
    <rect x="8" y="36" width="32" height="4" fill="#00BCD4" fillOpacity="0.2" stroke="#00BCD4" strokeWidth="1.5"/>
    {/* Coins stack */}
    <ellipse cx="42" cy="42" rx="4" ry="2" fill="#F59E0B"/>
    <ellipse cx="42" cy="40" rx="4" ry="2" fill="#FBBF24"/>
    <ellipse cx="42" cy="38" rx="4" ry="2" fill="#FCD34D"/>
  </svg>
);

// Fixed Assets Icon - Computer, furniture, vehicle representing fixed assets (Teal #009688)
export const FixedAssetsIcon: React.FC<IconProps> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Desktop Computer/Monitor */}
    <rect x="6" y="8" width="20" height="14" rx="2" stroke="#009688" strokeWidth="2.5" fill="none"/>
    {/* Monitor screen */}
    <rect x="9" y="11" width="14" height="8" fill="#E0F2F1"/>
    {/* Monitor stand */}
    <path d="M16 22V26" stroke="#009688" strokeWidth="2.5"/>
    <path d="M10 26H22" stroke="#009688" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Office Chair */}
    <ellipse cx="36" cy="38" rx="6" ry="2" stroke="#009688" strokeWidth="2" fill="none"/>
    <path d="M36 36V32" stroke="#009688" strokeWidth="2"/>
    <path d="M30 24C30 24 32 28 36 28C40 28 42 24 42 24" stroke="#009688" strokeWidth="2.5" fill="none"/>
    <path d="M30 24V20C30 18 32 16 36 16C40 16 42 18 42 20V24" stroke="#009688" strokeWidth="2.5" fill="none"/>
    {/* Backrest */}
    <path d="M32 16V12C32 10 34 8 36 8C38 8 40 10 40 12V16" stroke="#009688" strokeWidth="2" fill="none"/>
    {/* Vehicle/Car */}
    <path d="M4 40H22" stroke="#009688" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 40V36L10 32H18L22 36V40" stroke="#009688" strokeWidth="2" fill="none"/>
    {/* Wheels */}
    <circle cx="9" cy="40" r="2" fill="#009688"/>
    <circle cx="19" cy="40" r="2" fill="#009688"/>
    {/* Dollar/Value indicator */}
    <circle cx="42" cy="10" r="6" fill="#E0F2F1" stroke="#009688" strokeWidth="2"/>
    <text x="42" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#009688">₦</text>
  </svg>
);

// Map of module IDs to icons
export const ModuleIcons: Record<string, React.FC<IconProps>> = {
  accounting: AccountingIcon,
  hr: HRIcon,
  production: ProductionIcon,
  products: ProductsIcon,
  sales: SalesIcon,
  services: ServicesIcon,
  "corporate-cards": CorporateCardsIcon,
  "nrs-einvoice": NRSInvoiceIcon,
  invoice: InvoiceIcon,
  bank: BankIcon,
  "fixed-assets": FixedAssetsIcon,
};

// Get icon by module ID
export const getModuleIcon = (moduleId: string): React.FC<IconProps> => {
  return ModuleIcons[moduleId] || AccountingIcon;
};
