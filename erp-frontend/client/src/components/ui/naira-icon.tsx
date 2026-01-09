import { forwardRef, SVGProps } from "react";

export interface NairaIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const NairaSign = forwardRef<SVGSVGElement, NairaIconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Naira symbol: ₦ - two vertical lines with two horizontal strokes */}
      <path d="M6 3v18" />
      <path d="M18 3v18" />
      <path d="M6 3l12 18" />
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </svg>
  )
);

NairaSign.displayName = "NairaSign";
