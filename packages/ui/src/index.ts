/**
 * Alawein Technologies UI Components Library
 * Consolidated React component library with atomic design principles
 *
 * @version 2.0.0
 * @author Alawein Technologies Team
 * @license MIT
 */

// Export atoms (avoiding conflicts with components)
export { Button as AtomButton } from './atoms';
export type { ButtonProps as AtomButtonProps } from './atoms';

// Export all components
export * from './components';

// Export utilities and types (avoiding conflicts)
export { cn as libCn } from './lib/utils';
export * from './types';
export { cn as utilsCn } from './utils/cn';

// Export design tokens (for JavaScript consumers)
export { designTokens } from './tokens';

// CSS imports for bundlers that support it
import './styles/globals.css';
