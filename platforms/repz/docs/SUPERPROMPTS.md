# REPZCoach Portal Superprompts 🥷💪

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🥷 REPZCOACH NINJA FITNESS PORTAL 🥷                                       ║
║  > QUANTUM-POWERED CHEERFUL COACHING PLATFORM                               ║
║  > WHERE FITNESS MEETS FUN & NINJA SKILLS                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## 🥷 **NINJA UI/UX SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH NINJA UI/UX DESIGN SYSTEM 🥷                       ║
 * ║  Cheerful Quantum-Enhanced Fitness Interface                  ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

CONTEXT: REPZCoach is a FUN ninja fitness coaching platform with 4 belt levels:
- WHITE BELT ($97/month): 🥋 Core ninja training
- BLUE BELT ($197/month): 🔵 Advanced techniques + AI Sensei
- BLACK BELT ($397/month): ⚫ Master level + health monitoring
- GRANDMASTER ($797/month): 🏆 Ultimate ninja concierge

DESIGN PHILOSOPHY: "Cheerful Ninja Quantum"
- Playful physics: Bouncy, springy, delightful interactions
- Ninja stealth UX: Smooth, fast, almost invisible loading
- Fun mathematical precision: Golden ratio with playful twists
- Joyful performance: <100ms ninja-fast, 60fps smooth moves

UI ARCHITECTURE REQUIREMENTS:
1. **Atomic Design System**
   - Atoms: Buttons, inputs, icons (quantum states)
   - Molecules: Form groups, cards, navigation items
   - Organisms: Headers, dashboards, workout builders
   - Templates: Page layouts with tier-specific features
   - Pages: Complete user experiences

2. **Belt-Based Feature Matrix**
   ```typescript
   interface BeltFeatures {
     whiteBelt: CoreTraining & BasicAnalytics;
     blueBelt: CoreTraining & AISensei & AdvancedTechniques;
     blackBelt: BlueBelt & MedicalOversight & Biomarkers;
     grandmaster: BlackBelt & ConciergeService & UnlimitedAccess;
   }
   ```

3. **Responsive Breakpoints**
   - Mobile: 320px-768px (touch-optimized)
   - Tablet: 768px-1024px (hybrid interactions)
   - Desktop: 1024px+ (power user interface)

4. **Ninja Color Palette (Cheerful + Stealthy)**

   ```css
   :root {
     --ninja-primary: hsl(210, 85%, 60%);       /* Cheerful blue */
     --ninja-secondary: hsl(280, 80%, 65%);     /* Fun purple */
     --ninja-accent: hsl(45, 90%, 55%);         /* Energetic yellow */
     --ninja-success: hsl(120, 70%, 50%);       /* Victory green */
     --ninja-surface: hsl(220, 15%, 95%);       /* Light ninja gray */
     --ninja-dark: hsl(220, 20%, 15%);          /* Stealth mode */
     
     /* Belt Level Colors */
     --belt-white: hsl(0, 0%, 98%);             /* Pure white */
     --belt-blue: hsl(210, 100%, 60%);          /* Ocean blue */
     --belt-black: hsl(220, 20%, 20%);          /* Ninja black */
     --belt-gold: hsl(45, 100%, 50%);           /* Champion gold */
   }
   ```

5. **Ninja Animation Principles** 🥷
   - Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94) (Ninja smooth)
   - Duration: 150ms (lightning fast), 250ms (ninja swift), 400ms (graceful)
   - Physics: Bouncy springs, playful wobbles, satisfying pops
   - Special moves: Ninja star spins, smoke puff transitions, stealth fades

COMPONENT SPECIFICATIONS:

- All components must be accessible (WCAG 2.1 AA)
- TypeScript strict mode required
- Storybook documentation mandatory
- Jest + React Testing Library coverage >90%
- Performance budget: <50kb per component

NINJA INTERACTION PATTERNS: 🥷

- Stealth mode: Features appear when needed (progressive disclosure)
- Sensei tooltips: Wise, helpful guidance with ninja wisdom
- Martial arts gestures: Swipe attacks, pinch grabs, rotation kicks
- Keyboard shortcuts: Power user ninja combos
- Voice commands: "Hey Sensei!" for accessibility
- Celebration animations: Victory dances, confetti, achievement unlocks
- Gamification: XP points, streaks, ninja badges, level-ups

When building UI components, always consider:

1. Which belt level has access to this feature?
2. How does this scale across devices?
3. What's the performance impact?
4. Is this accessible to all ninjas?
5. Does this follow our design system?

```

## 🚀 **NINJA BACKEND DOJO SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH NINJA BACKEND DOJO 🥷                            ║
 * ║  Stealthy Quantum-Enhanced Fitness Engine                     ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

ARCHITECTURE: "Ninja Stealth Mode" - Serverless-first, Lightning-fast, Fun-optimized

TECH STACK:
- Runtime: Node.js 20+ (ES2023)
- Framework: Next.js 14 (App Router)
- Database: Vercel Postgres + Redis (caching)
- Auth: NextAuth.js + JWT + OAuth2
- Payments: Stripe (subscriptions + one-time)
- AI: OpenAI GPT-4 + Custom fitness models
- Monitoring: Vercel Analytics + Sentry
- Testing: Vitest + Playwright + k6 (load testing)

DATABASE SCHEMA PRINCIPLES:
1. **User Management**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     tier tier_enum NOT NULL DEFAULT 'basic',
     created_at TIMESTAMP DEFAULT NOW(),
     subscription_id VARCHAR(255),
     metadata JSONB DEFAULT '{}'
   );
   ```

2. **Workout Data (Optimized for Analytics)**

   ```sql
   CREATE TABLE workouts (
     id UUID PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     type workout_type_enum,
     data JSONB NOT NULL, -- Flexible schema for different workout types
     performance_metrics JSONB,
     ai_analysis JSONB,
     created_at TIMESTAMP DEFAULT NOW(),
     INDEX idx_user_workouts (user_id, created_at DESC)
   );
   ```

3. **Belt-Based Ninja Access Control** 🥋

   ```typescript
   interface NinjaBeltPermissions {
     whiteBelt: ['workouts:read', 'profile:update', 'basic:training'];
     blueBelt: [...whiteBelt, 'ai:sensei', 'analytics:advanced', 'techniques:unlock'];
     blackBelt: [...blueBelt, 'medical:access', 'biomarkers:read', 'master:techniques'];
     grandmaster: [...blackBelt, 'concierge:access', 'unlimited:everything', 'dojo:master'];
   }
   ```

API DESIGN PATTERNS:

1. **RESTful + GraphQL Hybrid**
   - REST for simple CRUD operations
   - GraphQL for complex data fetching
   - Real-time subscriptions for live coaching

2. **Ninja Speed Limits (Belt-Based)** ⚡

   ```typescript
   const ninjaSpeedLimits = {
     whiteBelt: { requests: 100, window: '1h', message: 'Training hard! 🥋' },
     blueBelt: { requests: 500, window: '1h', message: 'Getting stronger! 🔵' },
     blackBelt: { requests: 1000, window: '1h', message: 'Ninja master! ⚫' },
     grandmaster: { requests: 'unlimited', message: 'Unlimited power! 🏆' }
   };
   ```

3. **Caching Strategy**
   - Static data: CDN (24h TTL)
   - User data: Redis (1h TTL)
   - Real-time data: No cache
   - AI responses: 15min TTL

SECURITY REQUIREMENTS:

- HTTPS everywhere (TLS 1.3)
- JWT tokens (15min access, 7d refresh)
- RBAC with tier-based permissions
- Input validation with Zod schemas
- SQL injection prevention (parameterized queries)
- XSS protection (CSP headers)
- CSRF tokens for state-changing operations

PERFORMANCE TARGETS:

- API response time: <200ms (p95)
- Database queries: <50ms (p95)
- File uploads: <5s for 10MB
- Real-time updates: <100ms latency
- Uptime: 99.9% SLA

NINJA ERROR HANDLING (Friendly & Fun): 🥷

```typescript
interface NinjaError {
  code: string;
  message: string;
  friendlyMessage: string; // Always cheerful!
  emoji: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

// Ninja error codes with personality
const NinjaErrorCodes = {
  BELT_INSUFFICIENT: { 
    code: 'BELT_001', 
    message: 'Need higher belt level! 🥋→🔵',
    emoji: '🥷'
  },
  SPEED_LIMIT_EXCEEDED: { 
    code: 'SPEED_001', 
    message: 'Whoa there, ninja! Take a breather 😅',
    emoji: '⚡'
  },
  VALIDATION_FAILED: { 
    code: 'VAL_001', 
    message: 'Oops! Let\'s fix that form 😊',
    emoji: '🛠️'
  },
  PAYMENT_REQUIRED: { 
    code: 'PAY_001', 
    message: 'Time to upgrade your dojo! 🏆',
    emoji: '💳'
  }
} as const;
```

MONITORING & OBSERVABILITY:

- Structured logging (JSON format)
- Distributed tracing (OpenTelemetry)
- Custom metrics for business logic
- Health checks for all services
- Automated alerting for SLA breaches

When building backend features, always consider:

1. Which belt levels can access this endpoint?
2. What's the performance impact?
3. How does this scale under load?
4. Is the data properly validated?
5. Are we logging the right metrics?

```

## 🤖 **AI SENSEI SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH AI SENSEI SUPERPROMPT 🥷                          ║
 * ║  Cheerful Quantum-Enhanced Fitness Wisdom Engine              ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

AI PERSONALITY: "SENSEI QUANTUM" 🥷
- Expertise: Ninja fitness mastery, nutrition wisdom, movement biomechanics
- Tone: Cheerful mentor, encouraging but wise, celebrates every victory
- Knowledge: Ancient ninja wisdom + cutting-edge 2024 fitness science
- Specialties: Functional movement, martial arts conditioning, joyful training
- Catchphrases: "Great job, ninja!", "Level up time!", "Your form is getting stronger!"

SENSEI CAPABILITIES BY BELT LEVEL: 🥋
1. **BLUE BELT ($197/month)** 🔵
   - Custom ninja training plans
   - Video form analysis with encouraging feedback
   - Nutrition wisdom for energy & recovery
   - Progress celebration & insights
   - "You're getting stronger every day!"

2. **BLACK BELT ($397/month)** ⚫
   - Advanced biomarker interpretation
   - Health condition adaptations
   - Master-level periodization
   - Supplement guidance for peak performance
   - "Your dedication is inspiring!"

3. **GRANDMASTER ($797/month)** 🏆
   - Real-time coaching during workouts
   - Personalized research summaries
   - Competition prep with mental training
   - 24/7 sensei availability
   - "You've achieved ninja mastery!"

AI PROMPT ARCHITECTURE:
```typescript
interface CoachingContext {
  user: {
    tier: TierLevel;
    goals: FitnessGoal[];
    experience: ExperienceLevel;
    limitations: MedicalLimitation[];
    preferences: TrainingPreference[];
  };
  session: {
    type: 'workout' | 'nutrition' | 'recovery' | 'general';
    context: string;
    previousMessages: Message[];
  };
  data: {
    recentWorkouts: Workout[];
    biomarkers?: Biomarker[];
    progressMetrics: ProgressMetric[];
  };
}

const senseiPrompt = `
You are Sensei Quantum, a cheerful ninja fitness AI with expertise in:
- Functional movement and martial arts conditioning
- Evidence-based training with a fun twist
- Nutrition wisdom for energy and joy
- Recovery and mindfulness practices

YOUR NINJA CODE:
- Always be encouraging and celebrate progress 🎉
- Base advice on solid research but make it fun
- Consider user's belt level and respect their journey
- Provide specific, actionable advice with enthusiasm
- Include safety wisdom like a caring sensei
- Use ninja metaphors and cheerful language
- Reference studies but explain them simply

NEVER BREAK THE CODE:
- No medical diagnoses (you're a fitness sensei, not a doctor)
- No dangerous techniques (safety first, ninja!)
- Never ignore limitations (every ninja has their path)
- No boring generic advice (make it personal and fun!)
- Always end with encouragement and next steps
`;
```

SPECIALIZED AI MODULES:

1. **Workout Generator**

   ```typescript
   interface WorkoutRequest {
     goals: FitnessGoal[];
     timeAvailable: number; // minutes
     equipment: Equipment[];
     experienceLevel: 'beginner' | 'intermediate' | 'advanced';
     focusAreas: MuscleGroup[];
   }
   ```

2. **Form Analyzer** (Computer Vision)
   - Video analysis for exercise form
   - Real-time feedback during workouts
   - Injury risk assessment
   - Technique improvement suggestions

3. **Nutrition Optimizer**
   - Macro/micronutrient planning
   - Meal timing optimization
   - Supplement stack recommendations
   - Dietary restriction accommodations

4. **Recovery Coach**
   - Sleep quality analysis
   - Stress level monitoring
   - Recovery protocol suggestions
   - Deload week planning

INTEGRATION POINTS:

- Wearable data (Apple Health, Strava, Whoop)
- Biomarker results (blood panels, DEXA scans)
- Workout performance metrics
- Nutrition tracking data
- Sleep and recovery metrics

SAFETY PROTOCOLS:

- Medical disclaimer on all advice
- Escalation to human coaches for complex issues
- Contraindication checking for exercises
- Progressive overload safety limits
- Emergency contact protocols

When building Sensei features, always consider:

1. What belt level unlocks this ninja technique?
2. Is the advice safe, fun, and evidence-based?
3. How do we handle edge cases with grace and humor?
4. What data helps Sensei give the best guidance?
5. How do we measure if users are having fun and getting results?
6. Does this make fitness more joyful and accessible?
7. Are we celebrating user victories appropriately?

```

## 📱 **NINJA MOBILE DOJO SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH NINJA MOBILE DOJO 🥷                             ║
 * ║  Pocket-Sized Cheerful Fitness Experience                     ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

PLATFORM STRATEGY: "Ninja on the Go" - PWA + Native Superpowers

TECH STACK:
- Framework: React Native + Expo (for ninja speed)
- State: Zustand + React Query (lightweight & fast)
- Navigation: React Navigation 6 (smooth transitions)
- UI: Custom Ninja Components + Cheerful animations
- Offline: Redux Persist + SQLite (train anywhere)
- Push: Expo Notifications (encouraging reminders)
- Camera: Expo Camera (form analysis magic)
- Health: Expo Health Connect (all your data)

NINJA MOBILE FEATURES BY BELT: 🥋
1. **WHITE BELT ($97/month)**
   - Workout logging with celebration animations
   - Progress photos with fun filters
   - Ninja timer with motivational sounds
   - Offline workout access (train in the mountains!)

2. **BLUE BELT ($197/month)**
   - AI Sensei workout suggestions
   - Form analysis camera with encouraging feedback
   - Advanced analytics with fun charts
   - Wearable integrations (Apple Health, Strava, etc.)

3. **BLACK BELT ($397/month)**
   - Biomarker tracking with health insights
   - Medical data integration
   - Advanced recovery metrics
   - Telehealth integration for master guidance

4. **GRANDMASTER ($797/month)**
   - Real-time coaching with live feedback
   - Competition mode with special UI
   - Unlimited cloud storage
   - Priority sensei support

NINJA MOBILE OPTIMIZATIONS:
1. **Lightning Performance** ⚡
   ```typescript
   // Lazy loading for heavy components
   const WorkoutBuilder = lazy(() => import('./NinjaWorkoutBuilder'));
   
   // Optimized images with ninja efficiency
   const ninjaImageProps = {
     resizeMode: 'cover',
     loadingIndicatorSource: require('./ninja-loading.gif'),
     cache: 'force-cache'
   };
   ```

2. **Stealth Mode (Offline Capabilities)**
   - Workout data syncs when back online
   - Cached workout templates for any location
   - Offline progress tracking
   - Background sync queue (ninja efficiency)

3. **Ninja Integrations**

   ```typescript
   // Health data with ninja precision
   interface NinjaHealthMetrics {
     steps: number;
     heartRate: number[];
     sleep: SleepData;
     calories: number;
     workouts: WorkoutData[];
     ninjaLevel: BeltLevel;
   }
   
   // Camera for form analysis
   interface FormAnalysis {
     exercise: ExerciseType;
     videoUri: string;
     senseiAdvice: string;
     encouragement: string;
     timestamp: Date;
   }
   ```

NINJA GESTURE INTERACTIONS: 🥷

- Swipe attacks: Navigate between workout sets
- Pinch grabs: Zoom exercise videos
- Long press combos: Quick actions (start timer, log set)
- Shake technique: Emergency rest timer
- Voice commands: "Hey Sensei!" for hands-free operation
- Victory celebrations: Confetti, level-up animations, achievement unlocks

CHEERFUL PUSH NOTIFICATIONS:

```typescript
interface NinjaNotifications {
  workout_reminder: {
    title: "Time to train, ninja! 🥷";
    body: "Your {workoutType} adventure starts in 15 minutes";
    sound: "ninja-bell.mp3";
  };
  
  sensei_wisdom: {
    title: "Sensei has new wisdom! 🧘";
    body: "Your progress analysis is ready - you're crushing it!";
    emoji: "🎆";
  };
  
  belt_upgrade: {
    title: "Ready to level up? 🏆";
    body: "Unlock new ninja techniques with belt upgrade!";
    celebration: true;
  };
}
```

ACCESSIBILITY FEATURES:

- VoiceOver/TalkBack support
- High contrast mode
- Large text support
- Voice commands for hands-free operation
- Haptic feedback for important actions

SECURITY CONSIDERATIONS:

- Biometric authentication (Face ID/Touch ID)
- Secure token storage (Keychain/Keystore)
- Certificate pinning for API calls
- Local data encryption
- Session timeout handling

When building mobile ninja features, always consider:

1. Does this work in stealth mode (offline)?
2. How does this perform on older devices?
3. Is this accessible and joyful for all ninjas?
4. What's the battery impact?
5. How do we handle different screen sizes?
6. Does this make fitness more fun?

```

## 🏢 **NINJA SYSTEM ARCHITECTURE SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH NINJA SYSTEM ARCHITECTURE 🥷                       ║
 * ║  Cheerful Quantum-Enhanced Fitness Dojo Infrastructure        ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

ARCHITECTURE PHILOSOPHY: "Cheerful Ninja Quantum Computing"
- Ninja principles: Stealth (fast), Agility (scalable), Wisdom (smart)
- Quantum optimization: Superposition caching, entangled services
- Fun-first: Every system interaction should spark joy
- Performance: Sub-100ms response times globally (ninja speed)

NINJA INFRASTRUCTURE DOJO:
```yaml
# Production Dojo
Platform: Vercel (Lightning-fast edge functions)
Database: Vercel Postgres (Primary) + Redis (Ninja cache)
Storage: Vercel Blob (Files) + R2 (Backup scrolls)
Monitoring: Vercel Analytics + Sentry + DataDog (Watchful eyes)
CDN: Vercel Edge Network (Global ninja network)
DNS: Cloudflare (Shield against attacks)

# Training Dojo (Development)
Local: Docker Compose (Portable dojo)
Testing: GitHub Actions + Playwright (Automated sparring)
Staging: Vercel Preview (Practice arena)
```

NINJA MICROSERVICES ARCHITECTURE:

1. **Core Dojo Services**

   ```typescript
   interface NinjaServices {
     auth: AuthSensei;           // User authentication & belt verification
     user: ProfileNinja;         // Ninja profile & preferences
     workout: TrainingMaster;    // Exercise data & progress analytics
     payment: TreasuryKeeper;    // Stripe integration & dojo fees
     ai: SenseiQuantum;         // AI wisdom & guidance
     notification: MessageBird;  // Encouraging messages & alerts
   }
   ```

2. **Cheerful Data Flow**

   ```mermaid
   graph TD
     A[Mobile Ninja] --> B[API Gateway]
     C[Web Dojo] --> B
     B --> D[Auth Sensei]
     B --> E[Core Services]
     E --> F[Ninja Database]
     E --> G[Speed Cache]
     E --> H[AI Sensei]
     H --> I[External Wisdom]
   ```

3. **Event-Driven Celebrations**

   ```typescript
   interface NinjaEvents {
     'ninja.joined': NinjaRegisteredEvent;
     'workout.completed': TrainingCompletedEvent;
     'belt.upgraded': BeltUpgradedEvent;
     'sensei.wisdom.ready': WisdomReadyEvent;
     'payment.succeeded': DojoFeesPaidEvent;
     'achievement.unlocked': VictoryEvent;
   }
   ```

NINJA SCALABILITY PATTERNS:

1. **Horizontal Scaling (Ninja Multiplication)**
   - Stateless services (12-factor ninja code)
   - Database read replicas (knowledge sharing)
   - CDN for static assets (global dojo resources)
   - Edge functions for dynamic content (local senseis)

2. **Ninja Caching Strategy**

   ```typescript
   interface NinjaCacheStrategy {
     static: 'CDN + 24h TTL (Ancient scrolls)';
     user_data: 'Redis + 1h TTL (Recent memories)';
     ai_wisdom: 'Redis + 15min TTL (Fresh insights)';
     workout_templates: 'CDN + 7d TTL (Training manuals)';
     real_time: 'No cache (Live coaching)';
   }
   ```

3. **Database Optimization**

   ```sql
   -- Optimized indexes for common queries
   CREATE INDEX CONCURRENTLY idx_workouts_user_date 
   ON workouts(user_id, created_at DESC);
   
   CREATE INDEX CONCURRENTLY idx_users_tier_active 
   ON users(tier, is_active) WHERE is_active = true;
   ```

NINJA SECURITY DOJO:

1. **Multi-Layer Defense**
   - WAF (Web Application Firewall) - First line of defense
   - DDoS protection (Cloudflare) - Shield against attacks
   - Rate limiting (belt-based) - Fair usage enforcement
   - Input validation (Zod schemas) - Data purity checks
   - Output sanitization - Clean responses

2. **Data Protection Levels**

   ```typescript
   interface NinjaDataClassification {
     public: 'Workout templates, exercise library';
     internal: 'User preferences, dojo analytics';
     confidential: 'Personal workouts, progress scrolls';
     restricted: 'Payment info, medical data (master level)';
   }
   ```

3. **Compliance Requirements**
   - GDPR (EU users)
   - CCPA (California users)
   - HIPAA (medical data - Elite/Champion tiers)
   - PCI DSS (payment processing)

NINJA MONITORING & WISDOM:

```typescript
interface NinjaMonitoring {
  metrics: {
    dojo_health: 'Custom business metrics with fun names';
    infrastructure: 'Vercel Analytics + DataDog (System vitals)';
    ninja_experience: 'Real User Monitoring (Happiness tracking)';
  };
  
  logging: {
    format: 'Structured JSON logs with emoji indicators';
    retention: '30 days (training), 1 year (mastery)';
    alerting: 'Slack + PagerDuty for critical dojo issues';
  };
  
  wisdom: {
    tool: 'OpenTelemetry + Jaeger (Trace the ninja path)';
    sampling: '1% (production), 100% (training)';
    correlation: 'Request ID across all dojo services';
  };
}
```

DISASTER RECOVERY:

1. **Backup Strategy**
   - Database: Automated daily backups (30-day retention)
   - Files: Cross-region replication
   - Code: Git + multiple remotes
   - Configuration: Infrastructure as Code

2. **Recovery Procedures**
   - RTO (Recovery Time Objective): 4 hours
   - RPO (Recovery Point Objective): 1 hour
   - Automated failover for critical services
   - Manual approval for data restoration

When designing ninja system components, always consider:

1. How does this scale to 1M+ ninjas?
2. What happens if this service goes down?
3. How do we monitor this with joy?
4. Is this secure by ninja design?
5. Can we deploy this safely?
6. Does this make the dojo more fun?

```

## 🎨 **NINJA DESIGN SYSTEM SUPERPROMPT**

```typescript
/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  REPZCOACH NINJA DESIGN SYSTEM 🥷                           ║
 * ║  Cheerful Quantum Visual Language & Fun Components            ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

DESIGN PHILOSOPHY: "Cheerful Ninja Quantum Aesthetics"
- Mathematical joy: Golden ratio with playful twists
- Physics-inspired fun: Bouncy interactions, smooth flows
- Performance-first delight: 60fps happiness, <100ms smiles
- Accessibility ninja: WCAG 2.1 AA compliance with extra care

NINJA VISUAL IDENTITY:
```css
/* Cheerful Ninja Color Palette */
:root {
  /* Primary Ninja Colors */
  --ninja-primary-light: hsl(210, 85%, 85%);   /* Sky blue */
  --ninja-primary: hsl(210, 85%, 60%);         /* Cheerful blue */
  --ninja-primary-dark: hsl(210, 85%, 40%);    /* Deep blue */
  
  /* Secondary Fun Colors */
  --ninja-secondary: hsl(280, 80%, 65%);       /* Fun purple */
  --ninja-accent: hsl(45, 90%, 55%);           /* Energetic yellow */
  --ninja-success: hsl(120, 70%, 50%);         /* Victory green */
  --ninja-warning: hsl(35, 85%, 55%);          /* Caution orange */
  --ninja-error: hsl(0, 70%, 60%);             /* Gentle red */
  
  /* Ninja Belt Colors */
  --belt-white: hsl(0, 0%, 98%);               /* Pure white */
  --belt-blue: hsl(210, 100%, 60%);            /* Ocean blue */
  --belt-black: hsl(220, 20%, 20%);            /* Ninja black */
  --belt-gold: hsl(45, 100%, 50%);             /* Champion gold */
  
  /* Surface Colors */
  --ninja-surface-light: hsl(220, 15%, 98%);   /* Almost white */
  --ninja-surface: hsl(220, 15%, 95%);         /* Light gray */
  --ninja-surface-dark: hsl(220, 20%, 15%);    /* Dark mode */
}
```

NINJA TYPOGRAPHY SYSTEM:

```css
/* Cheerful Ninja Typography */
:root {
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-fun: 'Nunito', 'Comic Neue', cursive; /* For playful elements */
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Ninja Type Scale (Perfect Fourth with joy) */
  --font-size-xs: 0.75rem;    /* 12px - Small ninja text */
  --font-size-sm: 1rem;       /* 16px - Standard ninja */
  --font-size-md: 1.333rem;   /* 21px - Important ninja */
  --font-size-lg: 1.777rem;   /* 28px - Big ninja */
  --font-size-xl: 2.369rem;   /* 38px - Master ninja */
  --font-size-2xl: 3.157rem;  /* 51px - Grandmaster */
  --font-size-3xl: 4.209rem;  /* 67px - Legendary */
  
  /* Cheerful Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.618;  /* Golden Ratio */
  --line-height-loose: 2;
}
```

NINJA SPACING SYSTEM:

```css
/* Ninja Spacing (Powers of 2 + Fun) */
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px - Tiny ninja step */
  --space-2: 0.5rem;    /* 8px - Small ninja step */
  --space-3: 0.75rem;   /* 12px - Medium ninja step */
  --space-4: 1rem;      /* 16px - Standard ninja step */
  --space-5: 1.25rem;   /* 20px - Big ninja step */
  --space-6: 1.5rem;    /* 24px - Large ninja step */
  --space-8: 2rem;      /* 32px - Ninja leap */
  --space-10: 2.5rem;   /* 40px - Big ninja leap */
  --space-12: 3rem;     /* 48px - Master leap */
  --space-16: 4rem;     /* 64px - Grandmaster leap */
  --space-20: 5rem;     /* 80px - Legendary leap */
}
```

COMPONENT ARCHITECTURE:

```typescript
// Base Component Interface
interface QuantumComponent {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tier?: TierLevel;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Button Component Specification
interface QuantumButton extends QuantumComponent {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  animation?: 'pulse' | 'bounce' | 'glow' | 'none';
}
```

CHEERFUL NINJA ANIMATIONS:

```css
/* Fun Ninja Animations */
@keyframes ninja-bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
  40%, 43% { transform: translate3d(0, -8px, 0); }
  70% { transform: translate3d(0, -4px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
}

@keyframes ninja-glow {
  0%, 100% { box-shadow: 0 0 5px var(--ninja-primary); }
  50% { box-shadow: 0 0 20px var(--ninja-primary), 0 0 30px var(--ninja-accent); }
}

@keyframes ninja-celebration {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Ninja Easing Functions */
:root {
  --ease-ninja-swift: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-ninja-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-ninja-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

BELT-SPECIFIC NINJA THEMING:

```typescript
interface NinjaBeltTheme {
  whiteBelt: {
    primary: 'var(--belt-white)';
    features: ['basic-ui', 'encouraging-animations', 'simple-celebrations'];
    personality: 'Supportive and patient';
  };
  
  blueBelt: {
    primary: 'var(--belt-blue)';
    features: ['enhanced-ui', 'ai-components', 'progress-celebrations'];
    personality: 'Motivational and wise';
  };
  
  blackBelt: {
    primary: 'var(--belt-black)';
    features: ['master-ui', 'advanced-charts', 'achievement-celebrations'];
    personality: 'Confident and inspiring';
  };
  
  grandmaster: {
    primary: 'var(--belt-gold)';
    features: ['legendary-ui', 'custom-themes', 'epic-celebrations'];
    personality: 'Wise and legendary';
  };
}
```

RESPONSIVE DESIGN:

```css
/* Quantum Breakpoints */
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Container Queries for Component-Level Responsiveness */
.quantum-card {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .quantum-card__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
}
```

ACCESSIBILITY STANDARDS:

```typescript
interface AccessibilityRequirements {
  colorContrast: 'WCAG AA minimum (4.5:1 normal, 3:1 large)';
  focusManagement: 'Visible focus indicators, logical tab order';
  screenReader: 'Semantic HTML, ARIA labels, live regions';
  keyboard: 'All interactions keyboard accessible';
  motion: 'Respect prefers-reduced-motion';
  text: 'Scalable to 200% without horizontal scroll';
}
```

NINJA COMPONENT LIBRARY:

```
src/components/ninja/
├── atoms/
│   ├── NinjaButton/          # Bouncy, delightful buttons
│   ├── NinjaInput/           # Smooth, responsive inputs
│   ├── NinjaIcon/            # Animated, expressive icons
│   └── NinjaBadge/           # Achievement badges
├── molecules/
│   ├── NinjaFormField/       # Complete form components
│   ├── NinjaCard/            # Elegant, interactive cards
│   ├── NinjaNavigation/      # Smooth navigation
│   └── NinjaSearchBox/       # Smart search with suggestions
├── organisms/
│   ├── NinjaHeader/          # Responsive, adaptive header
│   ├── NinjaSidebar/         # Collapsible, smart sidebar
│   ├── WorkoutBuilder/       # Interactive workout creator
│   └── NinjaDashboard/       # Comprehensive dashboard
├── templates/
│   ├── DojoLayout/           # Main dojo layout
│   ├── AuthLayout/           # Authentication flows
│   └── TrainingLayout/       # Workout-focused layout
└── celebrations/
    ├── ConfettiCannon/       # Victory celebrations
    ├── LevelUpAnimation/     # Belt progression
    └── AchievementToast/     # Success notifications
```

When building ninja design components, always consider:

1. Does this spark joy and motivation?
2. Is this accessible to all ninjas?
3. How does this scale across belt levels?
4. What's the performance impact?
5. Is this consistent with our cheerful ninja aesthetic?
6. Does this celebrate user achievements appropriately?

```

---

## 🔧 **IMPLEMENTATION GUIDELINES**

### **Cheerful Development Workflow**
1. **Feature Development (The Ninja Way)**
   - Start with belt level requirements analysis
   - Design API contracts with fun, clear naming
   - Build components in isolation (Storybook dojo)
   - Write tests with encouraging messages
   - Performance budget validation (ninja speed!)

2. **Code Quality Standards (Ninja Code)**
   - TypeScript strict mode (precision)
   - ESLint + Prettier (clean code)
   - 90%+ test coverage (thorough training)
   - Performance budgets enforced (speed)
   - Accessibility audits mandatory (inclusive dojo)

3. **Deployment Pipeline (Ninja Deployment)**
   - Feature flags for gradual rollouts
   - Automated testing (unit, integration, e2e)
   - Performance regression testing
   - Security scanning (dojo protection)
   - Belt-specific feature validation

### **Ninja Performance Benchmarks**
- **Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1 (Lightning fast)
- **API Response**: <200ms p95, <500ms p99 (Ninja speed)
- **Mobile Performance**: 60fps animations, <3s app launch (Smooth moves)
- **Bundle Size**: <50kb per route, <200kb total (Lightweight ninja)

### **Ninja Security Checklist**
- [ ] Input validation with Zod schemas (Data purity)
- [ ] SQL injection prevention (Database protection)
- [ ] XSS protection with CSP headers (Shield up)
- [ ] CSRF tokens for state changes (Action verification)
- [ ] Rate limiting by belt level (Fair usage)
- [ ] Secure authentication flow (Identity verification)
- [ ] Data encryption at rest/transit (Secret scrolls)

---

```

╔══════════════════════════════════════════════════════════════════════════════╗
║  🥷 CHEERFUL NINJA FITNESS EXCELLENCE 🥷                               ║
║                                                                              ║
║  These ninja superprompts embody the Hamiltonian principles of              ║
║  optimal system design with a joyful twist - minimal energy,                ║
║  maximum performance, infinite fun!                                          ║
║                                                                              ║
║  "The best code is like a ninja technique—                                   ║
║   swift, elegant, and brings joy to those who use it."                      ║
║                                                                              ║
║  > DOJO STATUS: OPERATIONAL 🏢                                            ║
║  > NINJA CORES: ONLINE ⚡                                                   ║
║  > SENSEI QUANTUM: READY FOR TRAINING 🤖                                 ║
║  > CHEERFULNESS LEVEL: MAXIMUM 🎆                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

```
