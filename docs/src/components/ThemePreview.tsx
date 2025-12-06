import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, Share2, User, Settings, Search } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}

interface ThemeTypography {
  heading: string;
  body: string;
  mono: string;
}

interface ThemePreviewProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: string[];
  themeName: string;
}

export const ThemePreview = ({ colors, typography, effects, themeName }: ThemePreviewProps) => {
  const hasGlass = effects.some((e) => e.toLowerCase().includes('glass'));
  const hasGlow = effects.some(
    (e) => e.toLowerCase().includes('glow') || e.toLowerCase().includes('neon')
  );
  const hasGradient = effects.some((e) => e.toLowerCase().includes('gradient'));

  const glassStyle = hasGlass
    ? {
        backdropFilter: 'blur(12px)',
        backgroundColor: `${colors.background}cc`,
      }
    : {};

  const glowStyle = hasGlow
    ? {
        boxShadow: `0 0 20px ${colors.primary}40, 0 0 40px ${colors.accent}20`,
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl overflow-hidden border"
      style={{
        backgroundColor: colors.background,
        borderColor: `${colors.muted}40`,
        fontFamily: typography.body,
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{
          borderColor: `${colors.muted}30`,
          background: hasGradient
            ? `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`
            : `${colors.background}`,
          ...glassStyle,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary, ...glowStyle }}
          >
            <span
              style={{ color: colors.background, fontFamily: typography.heading, fontWeight: 700 }}
            >
              {themeName.charAt(0)}
            </span>
          </div>
          <span
            style={{ color: colors.foreground, fontFamily: typography.heading, fontWeight: 600 }}
          >
            {themeName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg transition-colors" style={{ color: colors.muted }}>
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg transition-colors" style={{ color: colors.muted }}>
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.secondary }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Card */}
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: `${colors.muted}10`,
            borderColor: `${colors.muted}20`,
            ...glassStyle,
            ...glowStyle,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.accent }}
            >
              <User className="w-5 h-5" style={{ color: colors.background }} />
            </div>
            <div className="flex-1">
              <h3
                style={{
                  color: colors.foreground,
                  fontFamily: typography.heading,
                  fontWeight: 600,
                }}
              >
                Sample Card Title
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: colors.muted, fontFamily: typography.body }}
              >
                This is how text content appears with your extracted theme colors and typography.
              </p>
            </div>
          </div>

          {/* Interaction buttons */}
          <div
            className="flex items-center gap-4 mt-4 pt-3 border-t"
            style={{ borderColor: `${colors.muted}20` }}
          >
            <button className="flex items-center gap-1.5 text-sm" style={{ color: colors.muted }}>
              <Heart className="w-4 h-4" />
              <span>24</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm" style={{ color: colors.muted }}>
              <MessageCircle className="w-4 h-4" />
              <span>12</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm" style={{ color: colors.muted }}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              fontFamily: typography.body,
              ...glowStyle,
            }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium text-sm border transition-all"
            style={{
              backgroundColor: 'transparent',
              borderColor: colors.secondary,
              color: colors.secondary,
              fontFamily: typography.body,
            }}
          >
            Secondary
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
            style={{
              backgroundColor: `${colors.muted}20`,
              color: colors.foreground,
              fontFamily: typography.body,
            }}
          >
            Ghost
          </button>
        </div>

        {/* Code block */}
        <div
          className="rounded-lg p-3 overflow-x-auto"
          style={{
            backgroundColor: `${colors.muted}15`,
            fontFamily: typography.mono,
          }}
        >
          <code className="text-xs" style={{ color: colors.accent }}>
            <span style={{ color: colors.secondary }}>const</span>{' '}
            <span style={{ color: colors.foreground }}>theme</span>{' '}
            <span style={{ color: colors.muted }}>=</span>{' '}
            <span style={{ color: colors.primary }}>"{themeName}"</span>;
          </code>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Users', value: '2.4K' },
            { label: 'Revenue', value: '$12K' },
            { label: 'Growth', value: '+24%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: `${colors.muted}10`,
                border: `1px solid ${colors.muted}20`,
              }}
            >
              <div
                className="text-lg font-bold"
                style={{ color: colors.primary, fontFamily: typography.heading }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: colors.muted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type something..."
            className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2"
            style={{
              backgroundColor: `${colors.muted}10`,
              borderColor: `${colors.muted}30`,
              color: colors.foreground,
              fontFamily: typography.body,
            }}
          />
          <button
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: colors.accent,
              color: colors.background,
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
