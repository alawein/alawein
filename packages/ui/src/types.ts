/**
 * UI Components Type Definitions
 * Note: ButtonProps is exported from ./atoms/Button.tsx as the canonical definition
 */

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
