/**
 * Mermaid Generator - Generates Mermaid diagram syntax
 */

import { StructureAnalysis } from '../analyzers/structure';
import { ComponentAnalysis } from '../analyzers/components';
import { DatabaseAnalysis, TableInfo } from '../analyzers/database';
import { WorkflowAnalysis } from '../analyzers/workflows';

type DiagramData = StructureAnalysis | ComponentAnalysis | DatabaseAnalysis | WorkflowAnalysis;

export class MermaidGenerator {
  generate(name: string, data: DiagramData): string {
    switch (name) {
      case 'monorepo-structure':
        return this.generateMonorepoStructure(data as StructureAnalysis);
      case 'platform-overview':
        return this.generatePlatformOverview(data as StructureAnalysis);
      case 'llc-ownership':
        return this.generateLLCOwnership();
      case 'deployment-architecture':
        return this.generateDeploymentArchitecture();
      case 'data-flow':
        return this.generateDataFlow();
      case 'package-dependencies':
        return this.generatePackageDependencies(data as StructureAnalysis);
      case 'ci-cd-pipeline':
        return this.generateCICDPipeline(data as WorkflowAnalysis);
      case 'repz-schema':
        return this.generateERD(data as DatabaseAnalysis, 'repz');
      case 'liveiticonic-schema':
        return this.generateERD(data as DatabaseAnalysis, 'liveiticonic');
      case 'shared-tables':
        return this.generateSharedTablesERD(data as DatabaseAnalysis);
      case 'component-tree':
        return this.generateComponentTree(data as ComponentAnalysis);
      case 'ui-package':
        return this.generateUIPackage(data as ComponentAnalysis);
      case 'feature-modules':
        return this.generateFeatureModules(data as ComponentAnalysis);
      case 'provider-stack':
        return this.generateProviderStack(data as ComponentAnalysis);
      case 'hook-dependencies':
        return this.generateHookDependencies(data as ComponentAnalysis);
      case 'state-layers':
        return this.generateStateLayers();
      case 'auth-state-machine':
        return this.generateAuthStateMachine();
      case 'react-query-cache':
        return this.generateReactQueryCache();
      case 'api-service':
        return this.generateAPIService();
      case 'request-flow':
        return this.generateRequestFlow();
      case 'error-hierarchy':
        return this.generateErrorHierarchy();
      case 'auth-flow':
        return this.generateAuthFlow();
      case 'workflow-map':
        return this.generateWorkflowMap(data as WorkflowAnalysis);
      case 'pr-pipeline':
        return this.generatePRPipeline();
      case 'deployment-pipeline':
        return this.generateDeploymentPipeline();
      default:
        return this.generatePlaceholder(name);
    }
  }

  private generateMonorepoStructure(data: StructureAnalysis): string {
    const platforms = data.platforms.map((p) => p.name);
    const packages = data.packages.map((p) => p.name);

    return `graph TB
    subgraph Root["📁 Alawein Monorepo"]
        direction TB

        subgraph Platforms["platforms/"]
            ${platforms.map((p) => `P_${p}["${p}"]`).join('\n            ')}
        end

        subgraph Packages["packages/"]
            ${packages
              .slice(0, 8)
              .map((p) => `PK_${p.replace(/-/g, '_')}["${p}"]`)
              .join('\n            ')}
        end

        subgraph Config["Configuration"]
            GH[".github/"]
            DOCS["docs/"]
            SCRIPTS["scripts/"]
        end
    end

    %% Dependencies
    ${platforms.map((p) => `P_${p} --> PK_ui`).join('\n    ')}
    ${platforms.map((p) => `P_${p} --> PK_utils`).join('\n    ')}

    style Root fill:#1a1b27,stroke:#6366f1,color:#fff
    style Platforms fill:#0f172a,stroke:#22c55e,color:#fff
    style Packages fill:#0f172a,stroke:#3b82f6,color:#fff
    style Config fill:#0f172a,stroke:#f59e0b,color:#fff
`;
  }

  private generatePlatformOverview(data: StructureAnalysis): string {
    return `graph LR
    subgraph Platforms["🖥️ Platforms"]
        REPZ["💪 REPZ<br/>Fitness Coaching"]
        SIMCORE["🔬 SimCore<br/>Scientific Simulation"]
        QMLAB["⚛️ QMLab<br/>Quantum Mechanics"]
        ICONIC["🛍️ LiveItIconic<br/>E-commerce"]
        LLMWORKS["🤖 LLMWorks<br/>AI/ML Tools"]
        ATTRIBUTA["📊 Attributa<br/>Attribution"]
        PORTFOLIO["👤 Portfolio<br/>Personal Site"]
    end

    subgraph Shared["📦 Shared"]
        UI["@monorepo/ui"]
        UTILS["@monorepo/utils"]
        CONFIG["@monorepo/config"]
    end

    subgraph Backend["☁️ Backend"]
        SUPABASE["Supabase"]
        VERCEL["Vercel"]
    end

    REPZ --> UI
    SIMCORE --> UI
    QMLAB --> UI
    ICONIC --> UI

    UI --> SUPABASE
    UI --> VERCEL

    style Platforms fill:#1e293b,stroke:#6366f1
    style Shared fill:#1e293b,stroke:#22c55e
    style Backend fill:#1e293b,stroke:#f59e0b
`;
  }

  private generateLLCOwnership(): string {
    return `graph TB
    subgraph LLCs["🏢 Legal Entities"]
        AT["Alawein Technologies LLC"]
        LII["Live It Iconic LLC"]
        REPZ_LLC["REPZ LLC"]
    end

    subgraph AT_Platforms["Alawein Technologies"]
        SIMCORE["SimCore"]
        QMLAB["QMLab"]
        LLMWORKS["LLMWorks"]
        ATTRIBUTA["Attributa"]
        PORTFOLIO["Portfolio"]
    end

    subgraph LII_Platforms["Live It Iconic"]
        ICONIC["LiveItIconic"]
    end

    subgraph REPZ_Platforms["REPZ"]
        REPZ_APP["REPZ App"]
    end

    AT --> AT_Platforms
    LII --> LII_Platforms
    REPZ_LLC --> REPZ_Platforms

    style LLCs fill:#6366f1,stroke:#fff,color:#fff
    style AT_Platforms fill:#1e293b,stroke:#6366f1
    style LII_Platforms fill:#1e293b,stroke:#ec4899
    style REPZ_Platforms fill:#1e293b,stroke:#22c55e
`;
  }

  private generateDeploymentArchitecture(): string {
    return `graph TB
    subgraph Client["👤 Client"]
        BROWSER["Browser"]
    end

    subgraph CDN["🌐 Vercel Edge Network"]
        EDGE["Edge Cache"]
        STATIC["Static Assets"]
    end

    subgraph Compute["⚡ Compute"]
        VERCEL_FN["Vercel Functions"]
        EDGE_FN["Supabase Edge Functions"]
    end

    subgraph Data["💾 Data Layer"]
        PG["PostgreSQL"]
        STORAGE["Supabase Storage"]
        REALTIME["Realtime"]
    end

    subgraph Auth["🔐 Auth"]
        SUPABASE_AUTH["Supabase Auth"]
        JWT["JWT Tokens"]
    end

    BROWSER --> EDGE
    EDGE --> STATIC
    EDGE --> VERCEL_FN
    VERCEL_FN --> EDGE_FN
    EDGE_FN --> PG
    EDGE_FN --> STORAGE
    EDGE_FN --> REALTIME
    BROWSER --> SUPABASE_AUTH
    SUPABASE_AUTH --> JWT
    JWT --> EDGE_FN

    style Client fill:#6366f1,stroke:#fff
    style CDN fill:#22c55e,stroke:#fff
    style Compute fill:#f59e0b,stroke:#fff
    style Data fill:#3b82f6,stroke:#fff
    style Auth fill:#ec4899,stroke:#fff
`;
  }

  private generateDataFlow(): string {
    return `sequenceDiagram
    participant U as User
    participant R as React App
    participant RQ as React Query
    participant API as Edge Function
    participant DB as PostgreSQL

    U->>R: User Action
    R->>RQ: useQuery/useMutation
    RQ->>RQ: Check Cache
    alt Cache Hit
        RQ-->>R: Return Cached Data
    else Cache Miss
        RQ->>API: HTTP Request + JWT
        API->>API: Validate Token
        API->>DB: SQL Query (RLS)
        DB-->>API: Results
        API-->>RQ: JSON Response
        RQ->>RQ: Update Cache
        RQ-->>R: Return Data
    end
    R-->>U: Update UI
`;
  }

  private generatePackageDependencies(data: StructureAnalysis): string {
    const packages = data.packages.map((p) => p.name);

    return `graph TD
    subgraph Packages["📦 Internal Packages"]
        UI["@monorepo/ui"]
        UTILS["@monorepo/utils"]
        CONFIG["@monorepo/config"]
        TYPES["@monorepo/types"]
        API["@monorepo/api-schema"]
        TOKENS["@monorepo/design-tokens"]
        FLAGS["@monorepo/feature-flags"]
    end

    subgraph External["📚 External"]
        REACT["React"]
        TAILWIND["Tailwind CSS"]
        RQ["React Query"]
        ZOD["Zod"]
    end

    UI --> TOKENS
    UI --> TYPES
    UI --> REACT
    UI --> TAILWIND

    UTILS --> TYPES
    UTILS --> ZOD

    CONFIG --> TYPES

    API --> TYPES
    API --> ZOD

    FLAGS --> CONFIG

    style Packages fill:#1e293b,stroke:#6366f1
    style External fill:#1e293b,stroke:#94a3b8
`;
  }

  private generateCICDPipeline(data: WorkflowAnalysis): string {
    return `graph LR
    subgraph Triggers["🎯 Triggers"]
        PUSH["push"]
        PR["pull_request"]
        SCHEDULE["schedule"]
        MANUAL["workflow_dispatch"]
    end

    subgraph CI["🔄 CI Pipeline"]
        LINT["Lint"]
        TYPE["Type Check"]
        TEST["Unit Tests"]
        BUILD["Build"]
    end

    subgraph Quality["✅ Quality"]
        E2E["E2E Tests"]
        SECURITY["Security Scan"]
        DOCS["Doc Validation"]
    end

    subgraph CD["🚀 CD Pipeline"]
        PREVIEW["Preview Deploy"]
        STAGING["Staging"]
        PROD["Production"]
    end

    PUSH --> CI
    PR --> CI

    CI --> LINT
    LINT --> TYPE
    TYPE --> TEST
    TEST --> BUILD

    BUILD --> Quality
    Quality --> E2E
    Quality --> SECURITY
    Quality --> DOCS

    E2E --> CD
    CD --> PREVIEW
    PREVIEW --> STAGING
    STAGING --> PROD

    style Triggers fill:#6366f1,stroke:#fff
    style CI fill:#f59e0b,stroke:#fff
    style Quality fill:#22c55e,stroke:#fff
    style CD fill:#3b82f6,stroke:#fff
`;
  }

  private generateERD(data: DatabaseAnalysis, platform: string): string {
    const schema = data.schemas.find((s) => s.name.toLowerCase().includes(platform));
    if (!schema) {
      return this.generatePlaceholder(`${platform}-schema`);
    }

    const tables = schema.tables.slice(0, 10);

    let erd = 'erDiagram\n';

    for (const table of tables) {
      erd += `    ${table.name} {\n`;
      for (const col of table.columns.slice(0, 8)) {
        const pk = col.name === table.primaryKey ? 'PK' : '';
        const fk = col.references ? 'FK' : '';
        erd += `        ${col.type} ${col.name} ${pk}${fk}\n`;
      }
      erd += `    }\n`;
    }

    // Add relationships
    for (const table of tables) {
      for (const fk of table.foreignKeys) {
        erd += `    ${fk.references.table} ||--o{ ${table.name} : "${fk.column}"\n`;
      }
    }

    return erd;
  }

  private generateSharedTablesERD(data: DatabaseAnalysis): string {
    return `erDiagram
    profiles {
        UUID id PK
        TEXT email
        TEXT full_name
        TEXT avatar_url
        TEXT role
        TIMESTAMPTZ created_at
    }

    projects {
        UUID id PK
        TEXT name
        TEXT slug
        TEXT description
        UUID owner_id FK
    }

    user_project_preferences {
        UUID id PK
        UUID user_id FK
        UUID project_id FK
        JSONB settings
    }

    profiles ||--o{ projects : "owns"
    profiles ||--o{ user_project_preferences : "has"
    projects ||--o{ user_project_preferences : "has"
`;
  }

  private generateComponentTree(data: ComponentAnalysis): string {
    return `graph TB
    APP["App"]

    subgraph Providers["Providers"]
        QCP["QueryClientProvider"]
        AP["AuthProvider"]
        TP["ThemeProvider"]
    end

    subgraph Router["Router"]
        BR["BrowserRouter"]
        ROUTES["Routes"]
    end

    subgraph Layouts["Layouts"]
        ML["MainLayout"]
        DL["DashboardLayout"]
        AL["AuthLayout"]
    end

    subgraph Pages["Pages"]
        HOME["Home"]
        DASH["Dashboard"]
        LOGIN["Login"]
    end

    APP --> QCP
    QCP --> AP
    AP --> TP
    TP --> BR
    BR --> ROUTES
    ROUTES --> ML
    ROUTES --> DL
    ROUTES --> AL
    ML --> HOME
    DL --> DASH
    AL --> LOGIN

    style Providers fill:#8b5cf6,stroke:#fff
    style Router fill:#3b82f6,stroke:#fff
    style Layouts fill:#22c55e,stroke:#fff
    style Pages fill:#f59e0b,stroke:#fff
`;
  }

  private generateUIPackage(data: ComponentAnalysis): string {
    const components = data.uiComponents.map((c) => c.name);

    return `graph TB
    subgraph UI["@monorepo/ui"]
        INDEX["index.ts"]

        subgraph Components["components/"]
            ${components.map((c) => `${c}["${c}"]`).join('\n            ')}
        end

        subgraph Atoms["atoms/"]
            COLORS["colors"]
            SPACING["spacing"]
        end

        subgraph Tokens["tokens/"]
            DESIGN["design-tokens"]
        end
    end

    INDEX --> Components
    INDEX --> Atoms
    Components --> Tokens

    style UI fill:#1e293b,stroke:#6366f1
    style Components fill:#0f172a,stroke:#22c55e
    style Atoms fill:#0f172a,stroke:#f59e0b
    style Tokens fill:#0f172a,stroke:#3b82f6
`;
  }

  private generateFeatureModules(data: ComponentAnalysis): string {
    const features = data.features.map((f) => f.name);

    return `graph TB
    subgraph Features["src/features/"]
        ${features
          .map(
            (f) => `
        subgraph ${f}["${f}/"]
            ${f}_components["components/"]
            ${f}_hooks["hooks/"]
            ${f}_services["services/"]
            ${f}_types["types.ts"]
        end`,
          )
          .join('\n        ')}
    end

    ${features.map((f) => `${f}_hooks --> ${f}_services`).join('\n    ')}
    ${features.map((f) => `${f}_components --> ${f}_hooks`).join('\n    ')}

    style Features fill:#1e293b,stroke:#6366f1
`;
  }

  private generateProviderStack(data: ComponentAnalysis): string {
    return `graph TB
    subgraph Stack["Provider Stack"]
        direction TB
        QCP["QueryClientProvider<br/><small>Server state cache</small>"]
        AP["AuthProvider<br/><small>User authentication</small>"]
        TP["ThemeProvider<br/><small>Dark/light mode</small>"]
        RP["RouterProvider<br/><small>Navigation</small>"]
        TOAST["ToastProvider<br/><small>Notifications</small>"]
    end

    QCP --> AP
    AP --> TP
    TP --> RP
    RP --> TOAST
    TOAST --> APP["App Content"]

    style Stack fill:#1e293b,stroke:#8b5cf6
`;
  }

  private generateHookDependencies(data: ComponentAnalysis): string {
    return `graph LR
    subgraph Hooks["Custom Hooks"]
        useAuth["useAuth"]
        useRecommendations["useRecommendations"]
        useWorkouts["useWorkouts"]
    end

    subgraph Services["Services"]
        apiService["apiService"]
        storageService["storageService"]
        recommendationService["recommendationService"]
    end

    subgraph External["External"]
        useQuery["useQuery"]
        useMutation["useMutation"]
        useState["useState"]
    end

    useAuth --> apiService
    useAuth --> storageService
    useAuth --> useState

    useRecommendations --> recommendationService
    useRecommendations --> useQuery

    useWorkouts --> apiService
    useWorkouts --> useQuery
    useWorkouts --> useMutation

    style Hooks fill:#6366f1,stroke:#fff
    style Services fill:#22c55e,stroke:#fff
    style External fill:#94a3b8,stroke:#fff
`;
  }

  private generateStateLayers(): string {
    return `graph TB
    subgraph Server["Server State (React Query)"]
        QUERIES["Queries"]
        MUTATIONS["Mutations"]
        CACHE["Cache"]
    end

    subgraph Global["Global UI State (Context)"]
        AUTH["Auth Context"]
        THEME["Theme Context"]
        TOAST["Toast Context"]
    end

    subgraph Local["Local State (useState)"]
        FORMS["Form State"]
        MODALS["Modal State"]
        UI["UI Toggles"]
    end

    Server --> Global
    Global --> Local

    style Server fill:#3b82f6,stroke:#fff
    style Global fill:#8b5cf6,stroke:#fff
    style Local fill:#22c55e,stroke:#fff
`;
  }

  private generateAuthStateMachine(): string {
    return `stateDiagram-v2
    [*] --> Loading: App Start
    Loading --> Authenticated: Token Valid
    Loading --> Unauthenticated: No Token

    Unauthenticated --> Loading: Login Attempt
    Loading --> Authenticated: Login Success
    Loading --> Unauthenticated: Login Failed

    Authenticated --> Loading: Token Refresh
    Authenticated --> Unauthenticated: Logout
    Authenticated --> Unauthenticated: Token Expired

    Loading --> Error: Network Error
    Error --> Loading: Retry
`;
  }

  private generateReactQueryCache(): string {
    return `graph TB
    subgraph Cache["React Query Cache"]
        direction TB

        subgraph Keys["Query Keys"]
            K1["['user']"]
            K2["['simulations']"]
            K3["['workouts', userId]"]
            K4["['recommendations', config]"]
        end

        subgraph State["Cache State"]
            FRESH["Fresh<br/><small>< staleTime</small>"]
            STALE["Stale<br/><small>> staleTime</small>"]
            FETCHING["Fetching"]
            INACTIVE["Inactive<br/><small>> cacheTime → GC</small>"]
        end
    end

    K1 --> FRESH
    K2 --> STALE
    K3 --> FETCHING
    K4 --> INACTIVE

    FRESH --> STALE
    STALE --> FETCHING
    FETCHING --> FRESH
    STALE --> INACTIVE

    style Cache fill:#1e293b,stroke:#3b82f6
    style Keys fill:#0f172a,stroke:#22c55e
    style State fill:#0f172a,stroke:#f59e0b
`;
  }

  private generateAPIService(): string {
    return `classDiagram
    class ApiService {
        -baseUrl: string
        -accessToken: string
        -csrfToken: string
        +get(endpoint, params)
        +post(endpoint, data)
        +put(endpoint, data)
        +patch(endpoint, data)
        +delete(endpoint)
        +uploadFile(endpoint, file, onProgress)
        -request(endpoint, options)
        -requestWithTimeout(url, options, timeout)
        -retryRequest(fn, retries)
    }

    class RetryConfig {
        +maxRetries: number
        +retryDelay: number
        +retryableStatuses: number[]
    }

    ApiService --> RetryConfig
`;
  }

  private generateRequestFlow(): string {
    return `sequenceDiagram
    participant C as Component
    participant RQ as React Query
    participant API as ApiService
    participant EF as Edge Function
    participant DB as Database

    C->>RQ: useQuery(['data'])
    RQ->>API: get('/endpoint')
    API->>API: Add Auth Headers
    API->>API: Add CSRF Token

    loop Retry Logic
        API->>EF: HTTP Request
        alt Success
            EF->>DB: Query with RLS
            DB-->>EF: Results
            EF-->>API: 200 OK
        else Retryable Error
            EF-->>API: 5xx Error
            API->>API: Wait (exponential backoff)
        end
    end

    API-->>RQ: Response
    RQ->>RQ: Update Cache
    RQ-->>C: Data
`;
  }

  private generateErrorHierarchy(): string {
    return `classDiagram
    class Error {
        +message: string
        +stack: string
    }

    class AppError {
        +code: ErrorCode
        +statusCode: number
        +isOperational: boolean
        +timestamp: Date
        +context: object
        +toJSON()
    }

    class AuthenticationError {
        +code: AUTH_INVALID_CREDENTIALS
        +statusCode: 401
    }

    class ValidationError {
        +code: VALIDATION_FAILED
        +statusCode: 400
    }

    class NetworkError {
        +code: API_NETWORK_ERROR
        +statusCode: 0
    }

    class TimeoutError {
        +code: API_TIMEOUT
        +statusCode: 408
    }

    class NotFoundError {
        +code: RESOURCE_NOT_FOUND
        +statusCode: 404
    }

    Error <|-- AppError
    AppError <|-- AuthenticationError
    AppError <|-- ValidationError
    AppError <|-- NetworkError
    AppError <|-- TimeoutError
    AppError <|-- NotFoundError
`;
  }

  private generateAuthFlow(): string {
    return `sequenceDiagram
    participant U as User
    participant A as App
    participant AS as AuthService
    participant API as API
    participant S as Storage

    Note over U,S: Login Flow
    U->>A: Enter credentials
    A->>AS: login(email, password)
    AS->>AS: Validate input
    AS->>API: POST /auth/login
    API-->>AS: { user, accessToken, refreshToken }
    AS->>S: Store refreshToken
    AS->>AS: Set accessToken in memory
    AS-->>A: Update auth state
    A-->>U: Redirect to dashboard

    Note over U,S: Token Refresh
    A->>AS: refreshToken()
    AS->>S: Get refreshToken
    AS->>API: POST /auth/refresh
    API-->>AS: { user, accessToken }
    AS->>AS: Update accessToken

    Note over U,S: Logout
    U->>A: Click logout
    A->>AS: logout()
    AS->>API: POST /auth/logout
    AS->>S: Remove refreshToken
    AS->>AS: Clear accessToken
    AS-->>A: Reset auth state
    A-->>U: Redirect to login
`;
  }

  private generateWorkflowMap(data: WorkflowAnalysis): string {
    const mainWorkflows = data.workflows.slice(0, 8);
    const reusable = data.reusableWorkflows.slice(0, 5);

    return `graph TB
    subgraph Main["Main Workflows"]
        ${mainWorkflows.map((w) => `${w.name.replace(/-/g, '_')}["${w.name}"]`).join('\n        ')}
    end

    subgraph Reusable["Reusable Workflows"]
        ${reusable.map((w) => `${w.name.replace(/-/g, '_')}["${w.name}"]`).join('\n        ')}
    end

    subgraph Triggers["Triggers"]
        PUSH["push"]
        PR["pull_request"]
        SCHEDULE["schedule"]
    end

    PUSH --> Main
    PR --> Main
    SCHEDULE --> Main
    Main --> Reusable

    style Main fill:#3b82f6,stroke:#fff
    style Reusable fill:#8b5cf6,stroke:#fff
    style Triggers fill:#22c55e,stroke:#fff
`;
  }

  private generatePRPipeline(): string {
    return `graph LR
    subgraph PR["Pull Request"]
        OPEN["PR Opened"]
    end

    subgraph Checks["Checks"]
        LINT["ESLint"]
        TYPE["TypeScript"]
        TEST["Vitest"]
        BUILD["Build"]
        DOCS["Doc Validation"]
    end

    subgraph Review["Review"]
        CODEOWNERS["CODEOWNERS"]
        APPROVAL["Approval"]
    end

    subgraph Merge["Merge"]
        PREVIEW["Preview Deploy"]
        MERGE["Merge to main"]
    end

    OPEN --> LINT
    LINT --> TYPE
    TYPE --> TEST
    TEST --> BUILD
    BUILD --> DOCS
    DOCS --> CODEOWNERS
    CODEOWNERS --> APPROVAL
    APPROVAL --> PREVIEW
    PREVIEW --> MERGE

    style PR fill:#6366f1,stroke:#fff
    style Checks fill:#f59e0b,stroke:#fff
    style Review fill:#22c55e,stroke:#fff
    style Merge fill:#3b82f6,stroke:#fff
`;
  }

  private generateDeploymentPipeline(): string {
    return `graph TB
    subgraph Trigger["Trigger"]
        MERGE["Merge to main"]
        TAG["Release Tag"]
    end

    subgraph Build["Build"]
        INSTALL["npm ci"]
        LINT["Lint"]
        TEST["Test"]
        BUILD_APP["Build"]
    end

    subgraph Deploy["Deploy"]
        PREVIEW["Preview"]
        STAGING["Staging"]
        PROD["Production"]
    end

    subgraph Verify["Verify"]
        HEALTH["Health Check"]
        E2E["E2E Tests"]
        MONITOR["Monitoring"]
    end

    MERGE --> Build
    TAG --> Build

    INSTALL --> LINT
    LINT --> TEST
    TEST --> BUILD_APP

    BUILD_APP --> PREVIEW
    PREVIEW --> STAGING
    STAGING --> PROD

    PROD --> HEALTH
    HEALTH --> E2E
    E2E --> MONITOR

    style Trigger fill:#6366f1,stroke:#fff
    style Build fill:#f59e0b,stroke:#fff
    style Deploy fill:#22c55e,stroke:#fff
    style Verify fill:#3b82f6,stroke:#fff
`;
  }

  private generatePlaceholder(name: string): string {
    return `graph TB
    A["${name}"]
    B["Diagram data available"]
    C["Use Cascade for SVG generation"]

    A --> B
    B --> C
`;
  }
}
