import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    description: 'This will be your public display name.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address.',
    defaultValue: 'invalid-email',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    success: 'Username is available!',
    defaultValue: 'available_user',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Input label="Default" placeholder="Default input" />
      <Input label="With Description" placeholder="Input" description="Helper text goes here" />
      <Input label="Error State" placeholder="Input" error="This field is required" />
      <Input label="Success State" placeholder="Input" success="Looks good!" defaultValue="Valid" />
      <Input label="Disabled" placeholder="Disabled" disabled />
    </div>
  ),
};

