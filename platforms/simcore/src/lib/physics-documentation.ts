/**
 * STANDARDIZED PHYSICS DOCUMENTATION TEMPLATE
 * 
 * Ensures consistent, comprehensive documentation across all modules
 */

export interface PhysicsModuleDocumentation {
  title: string;
  subtitle: string;
  overview: string;
  theory: TheorySection;
  implementation: ImplementationSection;
  usage: UsageSection;
  references: Reference[];
  validation: ValidationSection;
}

export interface TheorySection {
  background: string;
  fundamentalEquations: Equation[];
  physicalPrinciples: string[];
  approximations: string[];
  limitingCases: LimitingCase[];
}

export interface ImplementationSection {
  numericalMethods: NumericalMethod[];
  algorithms: Algorithm[];
  stabilityConsiderations: string[];
  performanceNotes: string[];
}

export interface UsageSection {
  quickStart: string;
  parameterGuide: ParameterDescription[];
  examples: Example[];
  troubleshooting: TroubleshootingItem[];
}

export interface Equation {
  name: string;
  latex: string;
  description: string;
  variables: VariableDefinition[];
}

export interface VariableDefinition {
  symbol: string;
  description: string;
  units: string;
  range?: [number, number];
}

export interface LimitingCase {
  name: string;
  conditions: string;
  behavior: string;
  equation?: string;
}

export interface NumericalMethod {
  name: string;
  description: string;
  stability: 'unconditional' | 'conditional' | 'unstable';
  accuracy: string;
  complexity: string;
}

export interface Algorithm {
  name: string;
  steps: string[];
  complexity: string;
  memoryUsage: string;
}

export interface ParameterDescription {
  name: string;
  description: string;
  physicalMeaning: string;
  defaultValue: number;
  range: [number, number];
  units: string;
  sensitivity: 'low' | 'medium' | 'high';
}

export interface Example {
  name: string;
  description: string;
  parameters: Record<string, number>;
  expectedBehavior: string;
  physicalInsight: string;
}

export interface TroubleshootingItem {
  symptom: string;
  possibleCauses: string[];
  solutions: string[];
}

export interface Reference {
  type: 'paper' | 'book' | 'review' | 'thesis';
  authors: string;
  title: string;
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  notes?: string;
}

export interface ValidationSection {
  benchmarks: Benchmark[];
  testCases: TestCase[];
  knownLimitations: string[];
}

export interface Benchmark {
  name: string;
  description: string;
  expectedResult: number | string;
  tolerance: number;
  reference: string;
}

export interface TestCase {
  name: string;
  description: string;
  parameters: Record<string, number>;
  assertions: string[];
}

/**
 * TEMPLATE GENERATORS
 */
export class DocumentationGenerator {
  
  static generateGrapheneDoc(): PhysicsModuleDocumentation {
    return {
      title: "Graphene Electronic Band Structure",
      subtitle: "Tight-binding model with strain and spin-orbit coupling",
      overview: `
        This module implements the exact tight-binding Hamiltonian for graphene's 
        electronic structure, including nearest-neighbor (NN) and next-nearest-neighbor (NNN) 
        interactions. The implementation captures the famous Dirac cones at the K and K' 
        points of the Brillouin zone, where electrons behave as massless Dirac fermions.
      `,
      
      theory: {
        background: `
          Graphene's electronic properties emerge from its honeycomb lattice structure, 
          which consists of two triangular sublattices (A and B) with one carbon atom per site. 
          The tight-binding approximation provides an excellent description of the low-energy 
          electronic structure, capturing the linear dispersion near the Fermi level.
        `,
        
        fundamentalEquations: [
          {
            name: "Tight-binding Hamiltonian",
            latex: "\\hat{H} = -t \\sum_{\\langle i,j \\rangle} (\\hat{a}_i^\\dagger \\hat{b}_j + h.c.) - t' \\sum_{\\langle\\langle i,j \\rangle\\rangle} (\\hat{a}_i^\\dagger \\hat{a}_j + \\hat{b}_i^\\dagger \\hat{b}_j + h.c.)",
            description: "Full Hamiltonian including NN and NNN hopping",
            variables: [
              { symbol: "t", description: "Nearest-neighbor hopping", units: "eV", range: [2.5, 3.0] },
              { symbol: "t'", description: "Next-nearest-neighbor hopping", units: "eV", range: [-0.3, 0.3] }
            ]
          },
          {
            name: "Band dispersion",
            latex: "E^\\pm(\\vec{k}) = -t' f_2(\\vec{k}) \\pm t |f_1(\\vec{k})|",
            description: "Energy eigenvalues for valence (-) and conduction (+) bands",
            variables: [
              { symbol: "f_1(\\vec{k})", description: "NN structure factor", units: "dimensionless" },
              { symbol: "f_2(\\vec{k})", description: "NNN structure factor", units: "dimensionless" }
            ]
          }
        ],
        
        physicalPrinciples: [
          "Honeycomb lattice leads to Dirac cones",
          "Time-reversal symmetry protects band touching",
          "Sublattice symmetry ensures E(k) = -E(k) for t' = 0",
          "Strain acts as a gauge field for Dirac fermions"
        ],
        
        approximations: [
          "Single π-orbital per carbon atom",
          "Tight-binding approximation (localized orbitals)",
          "Nearest and next-nearest neighbor interactions only"
        ],
        
        limitingCases: [
          {
            name: "Linear dispersion at Dirac points",
            conditions: "k → K, t' = 0",
            behavior: "E(k) ≈ ±ℏvF|k - K|",
            equation: "v_F = \\frac{3ta}{2\\hbar} ≈ 10^6 \\text{ m/s}"
          },
          {
            name: "Massive Dirac fermions",
            conditions: "t' ≠ 0",
            behavior: "Gap opens: Δ = 3√3t'",
            equation: "E(K) = ±3\\sqrt{3}|t'|"
          }
        ]
      },
      
      implementation: {
        numericalMethods: [
          {
            name: "Direct diagonalization",
            description: "Exact solution of Hamiltonian matrix",
            stability: "unconditional",
            accuracy: "Machine precision",
            complexity: "O(N³) for N×N matrix"
          }
        ],
        
        algorithms: [
          {
            name: "Band structure calculation",
            steps: [
              "Generate k-point path through Brillouin zone",
              "Construct Hamiltonian matrix for each k-point", 
              "Diagonalize to find eigenvalues",
              "Sort bands by energy"
            ],
            complexity: "O(N_k × N_basis³)",
            memoryUsage: "O(N_basis²) per k-point"
          }
        ],
        
        stabilityConsiderations: [
          "Use double precision for eigenvalue calculations",
          "Check Hermiticity of Hamiltonian matrix",
          "Validate k-point sampling density"
        ],
        
        performanceNotes: [
          "useMemo optimization for expensive calculations",
          "Efficient k-space sampling schemes",
          "Progressive loading for large computations"
        ]
      },
      
      usage: {
        quickStart: "Adjust hopping parameters t and t' to explore band structure changes. Enable strain to see gauge field effects.",
        
        parameterGuide: [
          {
            name: "Nearest-neighbor hopping (t)",
            description: "Primary hopping between adjacent carbon atoms",
            physicalMeaning: "Determines bandwidth and Fermi velocity",
            defaultValue: 2.8,
            range: [2.5, 3.2],
            units: "eV",
            sensitivity: "high"
          },
          {
            name: "Next-nearest-neighbor hopping (t')",
            description: "Weaker hopping between second neighbors",
            physicalMeaning: "Opens gap at Dirac points, breaks electron-hole symmetry",
            defaultValue: -0.1,
            range: [-0.3, 0.3],
            units: "eV", 
            sensitivity: "medium"
          }
        ],
        
        examples: [
          {
            name: "Pristine graphene",
            description: "Pure graphene with no NNN hopping",
            parameters: { t: 2.8, t_prime: 0.0 },
            expectedBehavior: "Perfect Dirac cones touching at Fermi level",
            physicalInsight: "Demonstrates massless Dirac fermion behavior"
          },
          {
            name: "Gapped graphene",
            description: "Include NNN hopping to open gap",
            parameters: { t: 2.8, t_prime: -0.1 },
            expectedBehavior: "Small gap opens at Dirac points",
            physicalInsight: "Shows how symmetry breaking creates mass"
          }
        ],
        
        troubleshooting: [
          {
            symptom: "Bands cross at non-Dirac points",
            possibleCauses: ["Incorrect lattice vectors", "Wrong k-path"],
            solutions: ["Verify Brillouin zone construction", "Check high-symmetry points"]
          }
        ]
      },
      
      references: [
        {
          type: "review",
          authors: "Castro Neto, A. H., Guinea, F., Peres, N. M. R., Novoselov, K. S., & Geim, A. K.",
          title: "The electronic properties of graphene",
          journal: "Reviews of Modern Physics",
          year: 2009,
          doi: "10.1103/RevModPhys.81.109"
        },
        {
          type: "paper",
          authors: "Wallace, P. R.",
          title: "The band theory of graphite",
          journal: "Physical Review",
          year: 1947,
          doi: "10.1103/PhysRev.71.622",
          notes: "Original tight-binding calculation"
        }
      ],
      
      validation: {
        benchmarks: [
          {
            name: "Fermi velocity",
            description: "Linear dispersion slope at Dirac points",
            expectedResult: 1.0e6,
            tolerance: 0.1e6,
            reference: "Castro Neto et al. (2009)"
          },
          {
            name: "Dirac point energy",
            description: "Band touching point for pristine graphene",
            expectedResult: 0.0,
            tolerance: 1e-10,
            reference: "Exact by symmetry"
          }
        ],
        
        testCases: [
          {
            name: "Pristine graphene test",
            description: "Verify Dirac cones in pristine sample",
            parameters: { t: 2.8, t_prime: 0.0 },
            assertions: [
              "Energy at K point equals zero",
              "Linear dispersion near K points",
              "Electron-hole symmetry preserved"
            ]
          }
        ],
        
        knownLimitations: [
          "Single-orbital approximation",
          "No electron-electron interactions",
          "Classical strain coupling only"
        ]
      }
    };
  }
}

export default DocumentationGenerator;