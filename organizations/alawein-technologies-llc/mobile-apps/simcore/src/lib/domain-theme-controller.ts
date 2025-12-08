/**
 * Domain Theme Controller for SimCore Scientific Computing Platform
 * Manages theme switching based on physics domains
 */

export type PhysicsDomain = 'quantum' | 'statistical' | 'energy' | 'fields';
import { categoryToThemeDomain } from '@/lib/category-domain-map';

interface DomainTheme {
  primary: string;
  accent: string;
  shadow: string;
  gradient: string;
}

const domainThemes: Record<PhysicsDomain, DomainTheme> = {
  quantum: {
    primary: 'var(--semantic-domain-quantum)',
    accent: 'var(--primitive-purple-400)',
    shadow: 'var(--primitive-shadow-quantum)',
    gradient: 'var(--gradient-quantum)'
  },
  statistical: {
    primary: 'var(--semantic-domain-statistical)',
    accent: 'var(--primitive-green-400)',
    shadow: 'var(--primitive-shadow-statistical)',
    gradient: 'linear-gradient(135deg, hsl(var(--semantic-domain-statistical)), hsl(142 76% 35%))'
  },
  energy: {
    primary: 'var(--semantic-domain-energy)',
    accent: 'hsl(0 85% 70%)',
    shadow: '0 0 30px hsl(var(--semantic-domain-energy) / 0.25)',
    gradient: 'linear-gradient(135deg, hsl(var(--semantic-domain-energy)), hsl(0 85% 50%))'
  },
  fields: {
    primary: 'var(--semantic-domain-fields)',
    accent: 'hsl(45 100% 65%)',
    shadow: '0 0 30px hsl(var(--semantic-domain-fields) / 0.25)',
    gradient: 'linear-gradient(135deg, hsl(var(--semantic-domain-fields)), hsl(45 100% 45%))'
  }
};

export class DomainThemeController {
  private currentDomain: PhysicsDomain = 'quantum';
  private subscribers: Set<(domain: PhysicsDomain) => void> = new Set();

  /**
   * Set the active physics domain theme
   */
  setDomain(domain: PhysicsDomain): void {
    this.currentDomain = domain;
    
    // Update DOM data attribute for CSS selectors
    document.documentElement.setAttribute('data-domain', domain);
    
    // Update CSS custom properties for the current domain
    const theme = domainThemes[domain];
    const root = document.documentElement.style;
    
    root.setProperty('--current-domain-primary', theme.primary);
    root.setProperty('--current-domain-accent', theme.accent);
    root.setProperty('--current-domain-shadow', theme.shadow);
    root.setProperty('--current-domain-gradient', theme.gradient);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(domain);
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(domain));
  }

  /**
   * Get the current active domain
   */
  getCurrentDomain(): PhysicsDomain {
    return this.currentDomain;
  }

  /**
   * Subscribe to domain changes
   */
  subscribe(callback: (domain: PhysicsDomain) => void): () => void {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get theme for a specific domain
   */
  getTheme(domain: PhysicsDomain): DomainTheme {
    return domainThemes[domain];
  }

  /**
   * Initialize theme controller with default domain
   */
  initialize(defaultDomain: PhysicsDomain = 'quantum'): void {
    this.setDomain(defaultDomain);
    
    // Listen for manual CSS variable changes and sync state
    this.observeCSSChanges();
  }

  /**
   * Auto-detect domain from current route/module
   */
autoDetectDomain(moduleCategory?: string): PhysicsDomain {
    if (!moduleCategory) return 'quantum';
    return categoryToThemeDomain(moduleCategory);
  }

  /**
   * Update browser meta theme color
   */
  private updateMetaThemeColor(domain: PhysicsDomain): void {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const theme = domainThemes[domain];
      const computedPrimary = getComputedStyle(document.documentElement)
        .getPropertyValue(theme.primary.replace('var(', '').replace(')', ''));
      
      metaTheme.setAttribute('content', `hsl(${computedPrimary})`);
    }
  }

  /**
   * Observe CSS custom property changes
   */
  private observeCSSChanges(): void {
    // Use MutationObserver to watch for data-domain attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-domain') {
          const newDomain = document.documentElement.getAttribute('data-domain') as PhysicsDomain;
          if (newDomain && newDomain !== this.currentDomain) {
            this.currentDomain = newDomain;
            this.subscribers.forEach(callback => callback(newDomain));
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-domain']
    });
  }

  /**
   * Create domain-specific CSS classes
   */
  generateDomainClasses(domain: PhysicsDomain): Record<string, string> {
    const theme = domainThemes[domain];
    
    return {
      primary: `text-[${theme.primary}]`,
      primaryBg: `bg-[${theme.primary}]`,
      accent: `text-[${theme.accent}]`,
      accentBg: `bg-[${theme.accent}]`,
      shadow: `shadow-[${theme.shadow}]`,
      gradient: `bg-[${theme.gradient}]`,
      border: `border-[${theme.primary}]`,
      hover: `hover:bg-[${theme.primary}/0.1]`
    };
  }
}

// Export singleton instance
export const domainThemeController = new DomainThemeController();

// React hook for domain theme
export function useDomainTheme() {
  const [currentDomain, setCurrentDomain] = React.useState<PhysicsDomain>(() => 
    domainThemeController.getCurrentDomain()
  );

  React.useEffect(() => {
    return domainThemeController.subscribe(setCurrentDomain);
  }, []);

  const setDomain = React.useCallback((domain: PhysicsDomain) => {
    domainThemeController.setDomain(domain);
  }, []);

  const getTheme = React.useCallback((domain?: PhysicsDomain) => {
    return domainThemeController.getTheme(domain || currentDomain);
  }, [currentDomain]);

  return {
    currentDomain,
    setDomain,
    getTheme,
    autoDetectDomain: domainThemeController.autoDetectDomain
  };
}

// Import React for the hook
import React from 'react';