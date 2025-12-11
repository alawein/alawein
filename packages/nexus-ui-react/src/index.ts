/**
 * Nexus UI React Components
 * Provides pre-built UI components for Nexus applications
 */

export { default as withAuthenticator } from '@nexus/backend';
export { useAuth } from '@nexus/backend';
export { default as AmplifyTheme } from '@nexus/backend';

// UI Components
export { default as Button } from './components/Button';
export { default as Input } from './components/Input';
export { default as Card } from './components/Card';
export { default as Badge } from './components/Badge';
export { default as Modal } from './components/Modal';
export { default as Loading } from './components/Loading';

// Layout Components
export { default as Container } from './layout/Container';
export { default as Grid } from './layout/Grid';
export { default as Flex } from './layout/Flex';
export { default as Header } from './layout/Header';
export { default as Sidebar } from './layout/Sidebar';

// Form Components
export { default as Form } from './forms/Form';
export { default as Field } from './forms/Field';
export { default as Select } from './forms/Select';
export { default as Checkbox } from './forms/Checkbox';
export { default as Radio } from './forms/Radio';

// Feedback Components
export { default as Alert } from './feedback/Alert';
export { default as Toast } from './feedback/Toast';
export { default as Progress } from './feedback/Progress';

// Navigation Components
export { default as Navigation } from './navigation/Navigation';
export { default as Breadcrumb } from './navigation/Breadcrumb';
export { default as Tabs } from './navigation/Tabs';
export { default as Pagination } from './navigation/Pagination';

// Data Display Components
export { default as Table } from './data/Table';
export { default as List } from './data/List';
export { default as Avatar } from './data/Avatar';
export { default as Chip } from './data/Chip';

// Export theme
export { default as theme } from './theme';
