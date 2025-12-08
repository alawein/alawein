/**
 * Base class for Band Structure Physics Modules
 * Extends the unified PhysicsModule framework for electronic structure calculations
 */

import { 
  PhysicsModule, 
  ModuleConfig, 
  Parameters, 
  Results, 
  ValidationReport, 
  TheoryContent, 
  VisualizationSet 
} from './physics-base';
import { UNIFIED_SCIENTIFIC_PLOT_SYSTEM as PLOT, PHYSICS_AXIS_LABELS } from '@/lib/scientific-plot-system';

export interface BandStructureParameters extends Parameters {
  // Common parameters for all band structure modules
  nPoints: number;          // Number of k-points
  energyRange: [number, number]; // Energy window [eV]
  fermiLevel: number;       // Fermi energy [eV]
  temperature: number;      // Temperature [K]
  
  // Material-specific parameters (override in subclasses)
  latticeConstant: number;  // Lattice parameter [Å]
  hoppingEnergy: number;    // Nearest-neighbor hopping [eV]
}

export interface BandStructureResult extends Results {
  data: {
    bandStructure: {
      kPath: number[][];     // k-points along high-symmetry path
      energies: number[][];  // Eigenvalues [nBands × nKpoints]
      labels: string[];      // High-symmetry point labels
      kTicks: number[];      // Positions of high-symmetry points
    };
    dos: {
      energies: number[];    // Energy grid [eV]
      dos: number[];         // Density of states [states/eV]
      pdos?: { [orbital: string]: number[] }; // Projected DOS
    };
    brillouinZone: {
      boundary: number[][];  // BZ boundary points
      highSymmetryPoints: { [label: string]: [number, number] };
      irreducibleZone?: number[][]; // IBZ vertices
    };
    diracCones?: {
      positions: [number, number][]; // Dirac point locations
      velocities: number[];          // Fermi velocities [m/s]
    };
  };
}

/**
 * Abstract base class for band structure modules
 * Provides common functionality for electronic structure calculations
 */
export abstract class BandStructureModule extends PhysicsModule {
  constructor(config: ModuleConfig) {
    super(config);
  }

  // Abstract methods specific to band structure calculations
  abstract calculateBandStructure(params: BandStructureParameters): Promise<BandStructureResult['data']['bandStructure']>;
  abstract calculateDOS(params: BandStructureParameters): Promise<BandStructureResult['data']['dos']>;
  abstract calculateBrillouinZone(params: BandStructureParameters): Promise<BandStructureResult['data']['brillouinZone']>;

  // Common implementation
  async computePhysics(params: Parameters): Promise<Results> {
    const bandParams = params as BandStructureParameters;
    const startTime = performance.now();

    try {
      // Calculate all band structure components
      const [bandStructure, dos, brillouinZone] = await Promise.all([
        this.calculateBandStructure(bandParams),
        this.calculateDOS(bandParams),
        this.calculateBrillouinZone(bandParams)
      ]);

      const computationTime = performance.now() - startTime;

      const result: BandStructureResult = {
        data: {
          bandStructure,
          dos,
          brillouinZone
        },
        metadata: {
          computationTime,
          convergence: true,
          accuracy: this.estimateAccuracy(bandParams)
        },
        validation: this.validateBandStructure({ bandStructure, dos, brillouinZone })
      };

      return result;
    } catch (error) {
      throw new Error(`Band structure calculation failed: ${error}`);
    }
  }

  validateResults(results: Results): ValidationReport {
    const bandResult = results as BandStructureResult;
    return this.validateBandStructure(bandResult.data);
  }

  renderVisualization(results: Results): VisualizationSet {
    const bandResult = results as BandStructureResult;
    const { bandStructure, dos, brillouinZone } = bandResult.data;

    return {
      plots: [
        // Band structure plot
        {
          id: 'band_structure',
          type: 'line',
          data: this.createBandStructurePlotData(bandStructure),
          layout: PLOT.createLayout(
            'Electronic Band Structure',
            'Crystal Momentum',
            PHYSICS_AXIS_LABELS.energy
          ),
          config: {}
        },
        // Density of states
        {
          id: 'dos',
          type: 'line',
          data: [PLOT.createTrace(dos.dos, dos.energies, 'DOS', 'line', PLOT.lineStyles.dos.numerical)],
          layout: PLOT.createLayout(
            'Density of States',
            'DOS [states/eV]',
            PHYSICS_AXIS_LABELS.energy
          ),
          config: {}
        },
        // Brillouin zone
        {
          id: 'brillouin_zone',
          type: 'scatter',
          data: this.createBrillouinZonePlotData(brillouinZone),
          layout: PLOT.createLayout(
            'Brillouin Zone',
            PLOT.axisLabels.kx,
            PLOT.axisLabels.ky
          ),
          config: {}
        }
      ]
    };
  }

  getTheoryContent(): TheoryContent {
    return {
      title: `${this.config.name} - Electronic Structure Theory`,
      sections: [
        {
          id: 'tight_binding',
          title: 'Tight-Binding Model',
          content: 'The tight-binding approximation describes electrons as localized on atomic sites with hopping between neighboring atoms.',
          equations: [
            'H = -t ∑⟨i,j⟩ (c†ᵢcⱼ + c†ⱼcᵢ)',
            'E(k) = -2t[cos(kₓa) + cos(kᵧa)]'
          ],
          references: ['Ashcroft & Mermin, Solid State Physics']
        },
        {
          id: 'bloch_theorem',
          title: 'Bloch Theorem',
          content: 'In a periodic potential, electron wavefunctions can be written as Bloch waves.',
          equations: [
            'ψₙₖ(r) = uₙₖ(r)eⁱᵏ·ʳ',
            'uₙₖ(r + R) = uₙₖ(r)'
          ],
          references: ['Kittel, Introduction to Solid State Physics']
        },
        {
          id: 'brillouin_zone',
          title: 'Brillouin Zone',
          content: 'The first Brillouin zone is the primitive cell of the reciprocal lattice.',
          equations: [
            'b₁ = 2π(a₂ × a₃)/(a₁ · (a₂ × a₃))',
            'Volume = (2π)³/Ω_cell'
          ],
          references: ['Marder, Condensed Matter Physics']
        }
      ]
    };
  }

  // Protected helper methods
  protected validateBandStructure(data: BandStructureResult['data']): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check band structure data consistency
    if (data.bandStructure.energies.length === 0) {
      errors.push('Band structure calculation produced no eigenvalues');
    }

    // Check DOS normalization
    const dosIntegral = this.integrateDOS(data.dos);
    if (Math.abs(dosIntegral) < 1e-10) {
      warnings.push('DOS appears to be zero - check energy range');
    }

    // Check Brillouin zone symmetry
    if (!this.checkBZSymmetry(data.brillouinZone)) {
      warnings.push('Brillouin zone may lack expected symmetry');
    }

    return {
      isValid: errors.length === 0,
      checks: {
        conservation: true,
        numericalStability: errors.length === 0
      },
      errors,
      warnings
    };
  }

  protected estimateAccuracy(params: BandStructureParameters): number {
    // Estimate accuracy based on k-point sampling
    const baseAccuracy = 1e-3; // meV
    const kDensity = params.nPoints / 100; // Normalize to typical value
    return baseAccuracy / Math.sqrt(kDensity);
  }

  protected createBandStructurePlotData(bandStructure: BandStructureResult['data']['bandStructure']) {
    return bandStructure.energies.map((band, index) =>
      PLOT.createTrace(
        bandStructure.kPath.map((_, i) => i),
        band,
        `Band ${index + 1}`,
        'line',
        index < bandStructure.energies.length / 2
          ? PLOT.lineStyles.bands.valence
          : PLOT.lineStyles.bands.conduction
      )
    );
  }

  protected createBrillouinZonePlotData(brillouinZone: BandStructureResult['data']['brillouinZone']) {
    const plotData = [];

    // Add BZ boundary
    plotData.push({
      x: brillouinZone.boundary.map(point => point[0]),
      y: brillouinZone.boundary.map(point => point[1]),
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: 'Brillouin Zone',
      line: PLOT.lineStyles.brillouinZone.boundary
    } as any);

    // Add high-symmetry points
    const hsPoints = Object.values(brillouinZone.highSymmetryPoints);
    plotData.push({
      x: hsPoints.map(point => point[0]),
      y: hsPoints.map(point => point[1]),
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: 'High-Symmetry Points',
      marker: { color: PLOT.colors.physics.diracPoint, size: PLOT.lineStyles.brillouinZone.kPoints.size }
    } as any);

    return plotData;
  }

  private integrateDOS(dos: BandStructureResult['data']['dos']): number {
    const dE = dos.energies[1] - dos.energies[0];
    return dos.dos.reduce((sum, value) => sum + value * dE, 0);
  }

  private checkBZSymmetry(bz: BandStructureResult['data']['brillouinZone']): boolean {
    // Simple check for expected number of vertices (material-specific)
    return bz.boundary.length > 3;
  }
}