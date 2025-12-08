// Accessibility utilities and hooks for WCAG 2.1 AA compliance

import { useEffect, useRef, useState } from 'react'

// Hook for managing focus trapping within components
export function useFocusTrap<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return containerRef
}

// Hook for managing skip links
export function useSkipLink() {
  useEffect(() => {
    const skipLink = document.querySelector('[data-skip-link]') as HTMLElement
    if (!skipLink) return

    const handleSkipClick = (e: Event) => {
      e.preventDefault()
      const target = document.querySelector(skipLink.getAttribute('href') || '') as HTMLElement
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }

    skipLink.addEventListener('click', handleSkipClick)
    return () => skipLink.removeEventListener('click', handleSkipClick)
  }, [])
}

// Hook for managing announcement regions
export function useAnnouncements() {
  const [announcement, setAnnouncement] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = (message: string, urgency: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    setPriority(urgency)
    
    // Use timeout to ensure screen reader picks up the change
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
  }

  return { announcement, priority, announce }
}

// Hook for managing reduced motion preferences
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook for managing high contrast mode
export function usePrefersHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersHighContrast
}

// Utility function to generate accessible IDs
export function generateAccessibleId(prefix: string = 'accessible'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Utility to check if an element is focusable
export function isFocusable(element: Element): boolean {
  const focusableSelectors = [
    'button',
    '[href]',
    'input',
    'select', 
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  
  return focusableSelectors.some(selector => element.matches(selector)) &&
         !element.hasAttribute('disabled') &&
         !element.getAttribute('aria-hidden')
}

// Utility for managing focus restoration
export class FocusManager {
  private previousFocus: HTMLElement | null = null

  capture() {
    this.previousFocus = document.activeElement as HTMLElement
  }

  restore() {
    if (this.previousFocus && document.contains(this.previousFocus)) {
      this.previousFocus.focus()
    }
  }
}

// ARIA live region manager
export class LiveRegionManager {
  private politeRegion: HTMLElement
  private assertiveRegion: HTMLElement

  constructor() {
    this.politeRegion = this.createLiveRegion('polite')
    this.assertiveRegion = this.createLiveRegion('assertive')
  }

  private createLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
    const region = document.createElement('div')
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    region.id = `live-region-${priority}`
    document.body.appendChild(region)
    return region
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion
    
    // Clear first to ensure announcement is heard
    region.textContent = ''
    
    setTimeout(() => {
      region.textContent = message
    }, 100)
  }

  cleanup() {
    this.politeRegion.remove()
    this.assertiveRegion.remove()
  }
}

// Global live region instance
export const liveRegion = new LiveRegionManager()

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want to use a proper color library
  const getLuminance = (color: string): number => {
    // This is a simplified implementation
    // You should use a proper color parsing library
    return 0.5 // Placeholder
  }
  
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export function meetsWCAGContrast(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// Keyboard navigation utilities
export const KeyboardNav = {
  ARROW_KEYS: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  NAVIGATION_KEYS: ['Home', 'End', 'PageUp', 'PageDown'],
  ACTION_KEYS: ['Enter', ' ', 'Escape'],
  
  isArrowKey: (key: string) => KeyboardNav.ARROW_KEYS.includes(key),
  isNavigationKey: (key: string) => KeyboardNav.NAVIGATION_KEYS.includes(key),
  isActionKey: (key: string) => KeyboardNav.ACTION_KEYS.includes(key),
}

// Screen reader utilities
export const ScreenReader = {
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    liveRegion.announce(message, priority)
  },
  
  hideFromScreenReader: (element: HTMLElement) => {
    element.setAttribute('aria-hidden', 'true')
  },
  
  showToScreenReader: (element: HTMLElement) => {
    element.removeAttribute('aria-hidden')
  }
}