---
title: 'Component Patterns Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Component Patterns Guide

Reusable React component patterns, compound components, and composition
strategies.

## Overview

This guide covers patterns for building maintainable, reusable React components.

## Basic Patterns

### Presentational vs Container

```typescript
// Presentational - UI only
function UserCard({ name, avatar, role }: UserCardProps) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

// Container - data fetching
function UserCardContainer({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <UserCardSkeleton />;

  return <UserCard {...user} />;
}
```

### Controlled vs Uncontrolled

```typescript
// Controlled - parent manages state
function ControlledInput({ value, onChange }: ControlledInputProps) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

// Uncontrolled - internal state with ref
function UncontrolledInput({ defaultValue }: UncontrolledInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const getValue = () => inputRef.current?.value;

  return <input ref={inputRef} defaultValue={defaultValue} />;
}
```

## Compound Components

### Basic Compound Pattern

```typescript
// Card compound component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return <div className={cn("card", className)}>{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="card-title">{children}</h3>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="card-content">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Usage
<Card>
  <Card.Header>
    <Card.Title>Welcome</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Card content here</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Context-Based Compound

```typescript
// Tabs with shared state
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within Tabs");
  return context;
}

function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }: { children: React.ReactNode }) {
  return <div role="tablist" className="tabs-list">{children}</div>;
}

function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
      className={cn("tab-trigger", activeTab === value && "active")}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children }: TabsContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return <div role="tabpanel">{children}</div>;
}

// Usage
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Render Props

```typescript
// Mouse position tracker
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>
```

## Higher-Order Components

```typescript
// withAuth HOC
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" />;

    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## Custom Hooks for Components

```typescript
// useToggle hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// useDisclosure for modals
function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  return { isOpen, open, close, toggle };
}

// Usage
function ModalExample() {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={close}>
        <p>Modal content</p>
      </Modal>
    </>
  );
}
```

## Polymorphic Components

```typescript
// Component that can render as different elements
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "children">;

function Box<E extends React.ElementType = "div">({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || "div";
  return <Component {...props}>{children}</Component>;
}

// Usage
<Box>Default div</Box>
<Box as="section">As section</Box>
<Box as="a" href="/link">As link</Box>
<Box as={Link} to="/route">As React Router Link</Box>
```

## Slot Pattern

```typescript
// Flexible layout with slots
interface LayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function Layout({ header, sidebar, children, footer }: LayoutProps) {
  return (
    <div className="layout">
      {header && <header className="layout-header">{header}</header>}
      <div className="layout-body">
        {sidebar && <aside className="layout-sidebar">{sidebar}</aside>}
        <main className="layout-main">{children}</main>
      </div>
      {footer && <footer className="layout-footer">{footer}</footer>}
    </div>
  );
}

// Usage
<Layout
  header={<NavBar />}
  sidebar={<SideMenu />}
  footer={<Footer />}
>
  <PageContent />
</Layout>
```

## Forwarding Refs

```typescript
// Forward ref to inner element
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

// Usage with ref
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} label="Email" />
```

## Best Practices

### Component Organization

```
components/
├── ui/                    # Base UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Card/
├── features/              # Feature-specific components
│   ├── auth/
│   └── simcore/
└── layouts/               # Layout components
    ├── MainLayout.tsx
    └── DashboardLayout.tsx
```

### Naming Conventions

| Type      | Convention           | Example       |
| --------- | -------------------- | ------------- |
| Component | PascalCase           | `UserProfile` |
| Hook      | camelCase with use   | `useAuth`     |
| Context   | PascalCase + Context | `AuthContext` |
| Props     | PascalCase + Props   | `ButtonProps` |

### Props Guidelines

1. **Destructure props** in function signature
2. **Use TypeScript interfaces** for prop types
3. **Provide default values** where sensible
4. **Spread remaining props** to root element

## Related Documents

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - State patterns
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code standards
