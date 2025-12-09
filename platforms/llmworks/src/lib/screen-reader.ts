/**
 * Screen Reader utilities and announcements
 * Provides programmatic control for screen reader interactions
 */

// Screen reader detection
export const detectScreenReader = (): string | null => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for common screen readers
  if (userAgent.includes('nvda')) return 'NVDA';
  if (userAgent.includes('jaws')) return 'JAWS';
  if (userAgent.includes('dragon')) return 'Dragon';
  if (userAgent.includes('zoomtext')) return 'ZoomText';
  if (userAgent.includes('magic')) return 'MAGic';
  if (userAgent.includes('supernova')) return 'SuperNova';
  if (userAgent.includes('cobra')) return 'COBRA';
  if (userAgent.includes('orca')) return 'Orca';
  if (userAgent.includes('voiceover')) return 'VoiceOver';
  if (userAgent.includes('talkback')) return 'TalkBack';
  
  // Check for reduced motion preference as an indicator
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'Unknown Screen Reader';
  }
  
  return null;
};

// Live region priorities
export type LiveRegionPriority = 'off' | 'polite' | 'assertive';

// Create announcement element
const createAnnouncementElement = (
  priority: LiveRegionPriority = 'polite',
  atomic: boolean = true
): HTMLElement => {
  const element = document.createElement('div');
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', atomic.toString());
  element.setAttribute('aria-relevant', 'text');
  element.className = 'sr-only';
  element.style.cssText = `
    position: absolute !important;
    left: -10000px !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `;
  
  document.body.appendChild(element);
  return element;
};

// Announce message to screen readers
export const announceToScreenReader = (
  message: string,
  priority: LiveRegionPriority = 'polite',
  delay: number = 100
): void => {
  if (!message.trim()) return;
  
  // Create announcement element
  const announcer = createAnnouncementElement(priority);
  
  // Small delay to ensure screen reader picks up the change
  setTimeout(() => {
    announcer.textContent = message;
    
    // Remove element after announcement
    setTimeout(() => {
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    }, priority === 'assertive' ? 2000 : 1000);
  }, delay);
};

// Announce status changes
export const announceStatus = (
  status: string,
  context?: string
): void => {
  const message = context ? `${context}: ${status}` : status;
  announceToScreenReader(message, 'polite');
};

// Announce errors
export const announceError = (
  error: string,
  field?: string
): void => {
  const message = field ? `Error in ${field}: ${error}` : `Error: ${error}`;
  announceToScreenReader(message, 'assertive');
};

// Announce navigation changes
export const announceNavigation = (
  pageName: string,
  breadcrumb?: string[]
): void => {
  let message = `Navigated to ${pageName}`;
  if (breadcrumb && breadcrumb.length > 0) {
    message += `. Path: ${breadcrumb.join(' > ')}`;
  }
  announceToScreenReader(message, 'polite', 500);
};

// Announce form validation
export const announceFormValidation = (
  isValid: boolean,
  errors: string[] = []
): void => {
  if (isValid) {
    announceToScreenReader('Form is valid and ready to submit', 'polite');
  } else {
    const errorCount = errors.length;
    const message = errorCount === 1 
      ? `1 error found: ${errors[0]}` 
      : `${errorCount} errors found. ${errors.join('. ')}`;
    announceToScreenReader(message, 'assertive');
  }
};

// Announce loading states
export const announceLoading = (
  isLoading: boolean,
  context?: string
): void => {
  const contextPrefix = context ? `${context} ` : '';
  const message = isLoading 
    ? `${contextPrefix}Loading...` 
    : `${contextPrefix}Finished loading`;
  announceToScreenReader(message, 'polite');
};

// Announce modal/dialog states
export const announceModal = (
  isOpen: boolean,
  title: string,
  description?: string
): void => {
  if (isOpen) {
    let message = `${title} dialog opened`;
    if (description) {
      message += `. ${description}`;
    }
    message += '. Press Escape to close.';
    announceToScreenReader(message, 'polite', 200);
  } else {
    announceToScreenReader(`${title} dialog closed`, 'polite');
  }
};

// Announce data table changes
export const announceTableChange = (
  action: 'sorted' | 'filtered' | 'updated',
  column?: string,
  direction?: 'ascending' | 'descending',
  rowCount?: number
): void => {
  let message = '';
  
  switch (action) {
    case 'sorted':
      message = column 
        ? `Table sorted by ${column} in ${direction} order`
        : 'Table sorted';
      break;
    case 'filtered':
      message = rowCount !== undefined
        ? `Table filtered. Showing ${rowCount} results`
        : 'Table filtered';
      break;
    case 'updated':
      message = rowCount !== undefined
        ? `Table updated. ${rowCount} rows displayed`
        : 'Table updated';
      break;
  }
  
  announceToScreenReader(message, 'polite');
};

// Announce selection changes
export const announceSelection = (
  selectedCount: number,
  totalCount: number,
  itemType: string = 'items'
): void => {
  const message = selectedCount === 0
    ? `No ${itemType} selected`
    : selectedCount === totalCount
    ? `All ${totalCount} ${itemType} selected`
    : `${selectedCount} of ${totalCount} ${itemType} selected`;
  
  announceToScreenReader(message, 'polite');
};

// Announce progress updates
export const announceProgress = (
  percentage: number,
  activity: string = 'Progress'
): void => {
  // Only announce at significant milestones to avoid spam
  if (percentage % 25 === 0 || percentage === 100) {
    const message = `${activity}: ${percentage}% complete`;
    announceToScreenReader(message, 'polite');
  }
};

// Enhanced focus management
export const manageFocus = {
  // Save current focus to restore later
  save: (): Element | null => {
    return document.activeElement;
  },
  
  // Restore previously saved focus
  restore: (element: Element | null): void => {
    if (element && element instanceof HTMLElement && element.focus) {
      element.focus();
    }
  },
  
  // Focus first focusable element in container
  focusFirst: (container: HTMLElement): boolean => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0] as HTMLElement;
    if (first && first.focus) {
      first.focus();
      return true;
    }
    return false;
  },
  
  // Focus last focusable element in container
  focusLast: (container: HTMLElement): boolean => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const last = focusable[focusable.length - 1] as HTMLElement;
    if (last && last.focus) {
      last.focus();
      return true;
    }
    return false;
  },
  
  // Trap focus within container
  trapFocus: (container: HTMLElement): () => void => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

// Screen reader feature detection
export const screenReaderFeatures = {
  // Check if screen reader is likely active
  isActive: (): boolean => {
    return !!(
      detectScreenReader() ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.speechSynthesis?.speaking ||
      navigator.userAgent.includes('AccessibleBrowser')
    );
  },
  
  // Check speech synthesis support
  supportsSpeech: (): boolean => {
    return 'speechSynthesis' in window;
  },
  
  // Check if high contrast mode is active
  isHighContrastMode: (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
  
  // Check if reduced motion is preferred
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};