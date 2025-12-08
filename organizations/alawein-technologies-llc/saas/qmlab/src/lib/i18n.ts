// Internationalization system for QMLab
// Support for multiple languages in quantum computing education

import { trackQuantumEvents } from './analytics';

// Supported languages with their locale codes
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    flag: '🇩🇪'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    flag: '🇨🇳'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    flag: '🇯🇵'
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    flag: '🇰🇷'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    flag: '🇷🇺'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    flag: '🇮🇳'
  }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Translation namespace types
interface Translations {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    clear: string;
    copy: string;
    share: string;
  };

  // Navigation
  navigation: {
    home: string;
    circuits: string;
    training: string;
    visualization: string;
    docs: string;
    settings: string;
    help: string;
  };

  // Quantum terminology
  quantum: {
    qubit: string;
    qubits: string;
    gate: string;
    gates: string;
    circuit: string;
    circuits: string;
    state: string;
    superposition: string;
    entanglement: string;
    measurement: string;
    amplitude: string;
    phase: string;
    probability: string;
    fidelity: string;
    bloch_sphere: string;
    hadamard: string;
    pauli_x: string;
    pauli_y: string;
    pauli_z: string;
    cnot: string;
    rotation: string;
    training: string;
    simulation: string;
    optimization: string;
    gradient: string;
    loss_function: string;
    accuracy: string;
    epoch: string;
    learning_rate: string;
    vqc: string; // Variational Quantum Circuit
    qml: string; // Quantum Machine Learning
  };

  // Circuit builder
  circuit_builder: {
    title: string;
    add_gate: string;
    remove_gate: string;
    run_circuit: string;
    reset_circuit: string;
    save_circuit: string;
    load_circuit: string;
    gate_palette: string;
    quantum_register: string;
    classical_register: string;
    execution_result: string;
    probability_distribution: string;
  };

  // Training dashboard
  training: {
    title: string;
    start_training: string;
    stop_training: string;
    pause_training: string;
    resume_training: string;
    training_progress: string;
    current_epoch: string;
    total_epochs: string;
    current_loss: string;
    best_accuracy: string;
    time_elapsed: string;
    estimated_remaining: string;
    convergence_plot: string;
    hyperparameters: string;
    dataset: string;
    model_architecture: string;
  };

  // Bloch sphere
  bloch_sphere: {
    title: string;
    state_vector: string;
    coordinates: string;
    theta: string;
    phi: string;
    x_axis: string;
    y_axis: string;
    z_axis: string;
    plus_state: string;
    minus_state: string;
    zero_state: string;
    one_state: string;
    rotate: string;
    zoom: string;
    reset_view: string;
  };

  // Errors and validation
  errors: {
    invalid_circuit: string;
    compilation_failed: string;
    simulation_error: string;
    training_failed: string;
    network_error: string;
    file_not_found: string;
    permission_denied: string;
    invalid_input: string;
    quota_exceeded: string;
    service_unavailable: string;
  };

  // Accessibility
  accessibility: {
    skip_to_main: string;
    menu_button: string;
    close_menu: string;
    expand_section: string;
    collapse_section: string;
    loading_content: string;
    error_occurred: string;
    quantum_state_description: string;
    circuit_gate_description: string;
    training_progress_description: string;
  };

  // Tutorials and help
  tutorial: {
    welcome_title: string;
    welcome_description: string;
    circuit_basics_title: string;
    circuit_basics_description: string;
    quantum_gates_title: string;
    quantum_gates_description: string;
    measurement_title: string;
    measurement_description: string;
    machine_learning_title: string;
    machine_learning_description: string;
    next_step: string;
    skip_tutorial: string;
    restart_tutorial: string;
  };
}

// Translation loading and management
class I18nManager {
  private currentLanguage: SupportedLanguage = 'en';
  private translations = new Map<SupportedLanguage, Translations>();
  private fallbackLanguage: SupportedLanguage = 'en';
  private loadingPromises = new Map<SupportedLanguage, Promise<Translations>>();

  constructor() {
    this.detectLanguage();
    this.loadTranslations(this.currentLanguage);
  }

  // Detect user's preferred language
  private detectLanguage(): void {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as SupportedLanguage;
    
    if (urlLang && this.isSupported(urlLang)) {
      this.currentLanguage = urlLang;
      return;
    }

    // Check localStorage
    const savedLang = localStorage.getItem('qmlab-language') as SupportedLanguage;
    if (savedLang && this.isSupported(savedLang)) {
      this.currentLanguage = savedLang;
      return;
    }

    // Check browser language
    const browserLangs = navigator.languages || [navigator.language];
    
    for (const browserLang of browserLangs) {
      const lang = browserLang.split('-')[0] as SupportedLanguage;
      if (this.isSupported(lang)) {
        this.currentLanguage = lang;
        return;
      }
    }

    // Default to English
    this.currentLanguage = 'en';
  }

  // Check if language is supported
  private isSupported(lang: string): lang is SupportedLanguage {
    return lang in SUPPORTED_LANGUAGES;
  }

  // Load translations for a language
  async loadTranslations(language: SupportedLanguage): Promise<Translations> {
    // Return cached translations if available
    if (this.translations.has(language)) {
      return this.translations.get(language)!;
    }

    // Return loading promise if already loading
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language)!;
    }

    // Start loading translations
    const loadingPromise = this.fetchTranslations(language);
    this.loadingPromises.set(language, loadingPromise);

    try {
      const translations = await loadingPromise;
      this.translations.set(language, translations);
      this.loadingPromises.delete(language);
      
      trackQuantumEvents.featureDiscovery('language_loaded');
      return translations;
    } catch (error) {
      this.loadingPromises.delete(language);
      console.error(`Failed to load translations for ${language}:`, error);
      
      // Fallback to English if available
      if (language !== this.fallbackLanguage) {
        return this.loadTranslations(this.fallbackLanguage);
      }
      
      throw error;
    }
  }

  // Fetch translations from server or local files
  private async fetchTranslations(language: SupportedLanguage): Promise<Translations> {
    try {
      // Try to load from CDN/server first
      const response = await fetch(`/i18n/${language}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch translations from server for ${language}`);
    }

    // Fallback to inline translations
    return this.getInlineTranslations(language);
  }

  // Get inline translations (fallback)
  private getInlineTranslations(language: SupportedLanguage): Translations {
    // For demonstration, returning English translations
    // In a real implementation, you would have translations for each language
    return {
      common: {
        loading: language === 'es' ? 'Cargando...' : 
                language === 'fr' ? 'Chargement...' :
                language === 'de' ? 'Wird geladen...' :
                language === 'zh' ? '加载中...' :
                language === 'ja' ? '読み込み中...' :
                language === 'ko' ? '로딩 중...' :
                language === 'ru' ? 'Загрузка...' :
                language === 'ar' ? 'جاري التحميل...' :
                language === 'hi' ? 'लोड हो रहा है...' :
                'Loading...',
        error: language === 'es' ? 'Error' : 
               language === 'fr' ? 'Erreur' :
               language === 'de' ? 'Fehler' :
               language === 'zh' ? '错误' :
               language === 'ja' ? 'エラー' :
               language === 'ko' ? '오류' :
               language === 'ru' ? 'Ошибка' :
               language === 'ar' ? 'خطأ' :
               language === 'hi' ? 'त्रुटि' :
               'Error',
        success: language === 'es' ? 'Éxito' : 
                language === 'fr' ? 'Succès' :
                language === 'de' ? 'Erfolg' :
                language === 'zh' ? '成功' :
                language === 'ja' ? '成功' :
                language === 'ko' ? '성공' :
                language === 'ru' ? 'Успех' :
                language === 'ar' ? 'نجح' :
                language === 'hi' ? 'सफलता' :
                'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        reset: 'Reset',
        clear: 'Clear',
        copy: 'Copy',
        share: 'Share'
      },
      navigation: {
        home: language === 'es' ? 'Inicio' :
              language === 'fr' ? 'Accueil' :
              language === 'de' ? 'Startseite' :
              language === 'zh' ? '主页' :
              language === 'ja' ? 'ホーム' :
              language === 'ko' ? '홈' :
              language === 'ru' ? 'Главная' :
              language === 'ar' ? 'الرئيسية' :
              language === 'hi' ? 'मुख्य पृष्ठ' :
              'Home',
        circuits: language === 'es' ? 'Circuitos' :
                 language === 'fr' ? 'Circuits' :
                 language === 'de' ? 'Schaltkreise' :
                 language === 'zh' ? '电路' :
                 language === 'ja' ? '回路' :
                 language === 'ko' ? '회로' :
                 language === 'ru' ? 'Схемы' :
                 language === 'ar' ? 'الدوائر' :
                 language === 'hi' ? 'सर्किट' :
                 'Circuits',
        training: 'Training',
        visualization: 'Visualization',
        docs: 'Docs',
        settings: 'Settings',
        help: 'Help'
      },
      quantum: {
        qubit: language === 'es' ? 'Qubit' :
               language === 'fr' ? 'Qubit' :
               language === 'de' ? 'Qubit' :
               language === 'zh' ? '量子比特' :
               language === 'ja' ? '量子ビット' :
               language === 'ko' ? '큐비트' :
               language === 'ru' ? 'Кубит' :
               language === 'ar' ? 'كيوبت' :
               language === 'hi' ? 'क्यूबिट' :
               'Qubit',
        qubits: 'Qubits',
        gate: 'Gate',
        gates: 'Gates',
        circuit: 'Circuit',
        circuits: 'Circuits',
        state: 'State',
        superposition: 'Superposition',
        entanglement: 'Entanglement',
        measurement: 'Measurement',
        amplitude: 'Amplitude',
        phase: 'Phase',
        probability: 'Probability',
        fidelity: 'Fidelity',
        bloch_sphere: 'Bloch Sphere',
        hadamard: 'Hadamard',
        pauli_x: 'Pauli-X',
        pauli_y: 'Pauli-Y',
        pauli_z: 'Pauli-Z',
        cnot: 'CNOT',
        rotation: 'Rotation',
        training: 'Training',
        simulation: 'Simulation',
        optimization: 'Optimization',
        gradient: 'Gradient',
        loss_function: 'Loss Function',
        accuracy: 'Accuracy',
        epoch: 'Epoch',
        learning_rate: 'Learning Rate',
        vqc: 'VQC',
        qml: 'QML'
      },
      circuit_builder: {
        title: 'Circuit Builder',
        add_gate: 'Add Gate',
        remove_gate: 'Remove Gate',
        run_circuit: 'Run Circuit',
        reset_circuit: 'Reset Circuit',
        save_circuit: 'Save Circuit',
        load_circuit: 'Load Circuit',
        gate_palette: 'Gate Palette',
        quantum_register: 'Quantum Register',
        classical_register: 'Classical Register',
        execution_result: 'Execution Result',
        probability_distribution: 'Probability Distribution'
      },
      training: {
        title: 'Training Dashboard',
        start_training: 'Start Training',
        stop_training: 'Stop Training',
        pause_training: 'Pause Training',
        resume_training: 'Resume Training',
        training_progress: 'Training Progress',
        current_epoch: 'Current Epoch',
        total_epochs: 'Total Epochs',
        current_loss: 'Current Loss',
        best_accuracy: 'Best Accuracy',
        time_elapsed: 'Time Elapsed',
        estimated_remaining: 'Estimated Remaining',
        convergence_plot: 'Convergence Plot',
        hyperparameters: 'Hyperparameters',
        dataset: 'Dataset',
        model_architecture: 'Model Architecture'
      },
      bloch_sphere: {
        title: 'Bloch Sphere',
        state_vector: 'State Vector',
        coordinates: 'Coordinates',
        theta: 'Theta (θ)',
        phi: 'Phi (φ)',
        x_axis: 'X-axis',
        y_axis: 'Y-axis',
        z_axis: 'Z-axis',
        plus_state: '|+⟩ State',
        minus_state: '|-⟩ State',
        zero_state: '|0⟩ State',
        one_state: '|1⟩ State',
        rotate: 'Rotate',
        zoom: 'Zoom',
        reset_view: 'Reset View'
      },
      errors: {
        invalid_circuit: 'Invalid quantum circuit configuration',
        compilation_failed: 'Circuit compilation failed',
        simulation_error: 'Quantum simulation error',
        training_failed: 'Training process failed',
        network_error: 'Network connection error',
        file_not_found: 'File not found',
        permission_denied: 'Permission denied',
        invalid_input: 'Invalid input provided',
        quota_exceeded: 'Usage quota exceeded',
        service_unavailable: 'Service temporarily unavailable'
      },
      accessibility: {
        skip_to_main: 'Skip to main content',
        menu_button: 'Open navigation menu',
        close_menu: 'Close navigation menu',
        expand_section: 'Expand section',
        collapse_section: 'Collapse section',
        loading_content: 'Content is loading',
        error_occurred: 'An error has occurred',
        quantum_state_description: 'Quantum state visualization',
        circuit_gate_description: 'Quantum gate in circuit',
        training_progress_description: 'Training progress indicator'
      },
      tutorial: {
        welcome_title: 'Welcome to QMLab',
        welcome_description: 'Learn quantum computing and machine learning interactively',
        circuit_basics_title: 'Quantum Circuit Basics',
        circuit_basics_description: 'Understanding qubits and quantum gates',
        quantum_gates_title: 'Quantum Gates',
        quantum_gates_description: 'Building blocks of quantum algorithms',
        measurement_title: 'Quantum Measurement',
        measurement_description: 'Extracting information from quantum states',
        machine_learning_title: 'Quantum Machine Learning',
        machine_learning_description: 'Training quantum models for classical problems',
        next_step: 'Next Step',
        skip_tutorial: 'Skip Tutorial',
        restart_tutorial: 'Restart Tutorial'
      }
    };
  }

  // Get current language
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // Set language
  async setLanguage(language: SupportedLanguage): Promise<void> {
    if (!this.isSupported(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // Load translations
    await this.loadTranslations(language);

    // Save to localStorage
    localStorage.setItem('qmlab-language', language);

    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update direction for RTL languages
    const direction = SUPPORTED_LANGUAGES[language].direction;
    document.documentElement.dir = direction;

    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url.toString());

    // Track language change
    trackQuantumEvents.preferenceChange('language', language, oldLanguage);

    // Dispatch event for components to update
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language, oldLanguage }
    }));
  }

  // Get translation for a key
  translate(key: string, fallback?: string): string {
    const translations = this.translations.get(this.currentLanguage);
    if (!translations) {
      return fallback || key;
    }

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        break;
      }
    }

    if (typeof value === 'string') {
      return value;
    }

    // Try fallback language
    if (this.currentLanguage !== this.fallbackLanguage) {
      const fallbackTranslations = this.translations.get(this.fallbackLanguage);
      if (fallbackTranslations) {
        let fallbackValue: any = fallbackTranslations;
        for (const k of keys) {
          fallbackValue = fallbackValue[k];
          if (fallbackValue === undefined) {
            break;
          }
        }
        if (typeof fallbackValue === 'string') {
          return fallbackValue;
        }
      }
    }

    return fallback || key;
  }

  // Get all available languages
  getAvailableLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  // Get language info
  getLanguageInfo(language: SupportedLanguage) {
    return SUPPORTED_LANGUAGES[language];
  }

  // Check if current language is RTL
  isRTL(): boolean {
    return SUPPORTED_LANGUAGES[this.currentLanguage].direction === 'rtl';
  }
}

// Global i18n instance
export const i18n = new I18nManager();

// Translation function for use in components
export const t = (key: string, fallback?: string): string => {
  return i18n.translate(key, fallback);
};

// Format numbers according to locale
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.getCurrentLanguage();
  return new Intl.NumberFormat(locale, options).format(number);
};

// Format dates according to locale
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const locale = i18n.getCurrentLanguage();
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Format relative time
export const formatRelativeTime = (date: Date): string => {
  const locale = i18n.getCurrentLanguage();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(Math.round(diffInSeconds / 86400), 'day');
  }
};