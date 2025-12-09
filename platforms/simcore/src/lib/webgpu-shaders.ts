// WebGPU compute shaders for physics simulations

// TDSE solver compute shader (Schrödinger equation evolution)
export const tdseComputeShader = `
struct SimulationParams {
  dt: f32,
  hbar: f32,
  mass: f32,
  n_points: u32,
  dx: f32,
  padding: vec3<f32>
}

@group(0) @binding(0) var<storage, read_write> psi_real: array<f32>;
@group(0) @binding(1) var<storage, read_write> psi_imag: array<f32>;
@group(0) @binding(2) var<storage, read> potential: array<f32>;
@group(0) @binding(3) var<uniform> params: SimulationParams;

// Complex number operations
fn complex_multiply(a_real: f32, a_imag: f32, b_real: f32, b_imag: f32) -> vec2<f32> {
  return vec2<f32>(
    a_real * b_real - a_imag * b_imag,
    a_real * b_imag + a_imag * b_real
  );
}

fn complex_exp(phase: f32) -> vec2<f32> {
  return vec2<f32>(cos(phase), sin(phase));
}

@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.n_points) {
    return;
  }

  // Current wave function values
  let psi_r = psi_real[idx];
  let psi_i = psi_imag[idx];

  // Potential evolution (half step)
  let V = potential[idx];
  let phase = -0.5 * V * params.dt / params.hbar;
  let exp_phase = complex_exp(phase);
  
  let evolved = complex_multiply(psi_r, psi_i, exp_phase.x, exp_phase.y);
  
  // Store result
  psi_real[idx] = evolved.x;
  psi_imag[idx] = evolved.y;
}
`;

// LLG dynamics compute shader (magnetization evolution)
export const llgComputeShader = `
struct LLGParams {
  dt: f32,
  alpha: f32,
  gamma: f32,
  n_spins: u32,
  applied_field: vec3<f32>,
  anisotropy: f32
}

@group(0) @binding(0) var<storage, read_write> magnetization: array<vec3<f32>>;
@group(0) @binding(1) var<storage, read_write> effective_field: array<vec3<f32>>;
@group(0) @binding(2) var<uniform> params: LLGParams;

// Vector operations
fn cross_product(a: vec3<f32>, b: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

fn normalize_vector(v: vec3<f32>) -> vec3<f32> {
  let len = length(v);
  if (len < 1e-10) {
    return vec3<f32>(0.0, 0.0, 1.0);
  }
  return v / len;
}

@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.n_spins) {
    return;
  }

  // Current magnetization
  let m = magnetization[idx];

  // Calculate effective field
  // H_eff = H_applied + H_anisotropy
  let anisotropy_field = vec3<f32>(0.0, 0.0, 2.0 * params.anisotropy * m.z);
  let h_eff = params.applied_field + anisotropy_field;
  effective_field[idx] = h_eff;

  // LLG equation: dm/dt = -γ(m × H) - α(m × (m × H))
  let m_cross_h = cross_product(m, h_eff);
  let m_cross_m_cross_h = cross_product(m, m_cross_h);

  let precession = -params.gamma * m_cross_h;
  let damping = -params.alpha * m_cross_m_cross_h;

  let dmdt = precession + damping;

  // Euler integration
  let new_m = m + dmdt * params.dt;

  // Renormalize to maintain |m| = 1
  magnetization[idx] = normalize_vector(new_m);
}
`;

// Phonon band structure compute shader
export const phononComputeShader = `
struct PhononParams {
  n_atoms: u32,
  n_kpoints: u32,
  lattice_constant: f32,
  spring_constant: f32,
  atom_mass: f32,
  padding: vec3<f32>
}

@group(0) @binding(0) var<storage, read> k_points: array<vec3<f32>>;
@group(0) @binding(1) var<storage, read_write> eigenvalues: array<f32>;
@group(0) @binding(2) var<storage, read_write> eigenvectors: array<vec3<f32>>;
@group(0) @binding(3) var<uniform> params: PhononParams;

// Simplified phonon dispersion calculation
@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let k_idx = global_id.x;
  if (k_idx >= params.n_kpoints) {
    return;
  }

  let k = k_points[k_idx];
  let k_mag = length(k);

  // Simple dispersion relation: ω² = (4K/M) * sin²(ka/2)
  let ka_half = k_mag * params.lattice_constant * 0.5;
  let sin_ka_half = sin(ka_half);
  let omega_squared = (4.0 * params.spring_constant / params.atom_mass) * sin_ka_half * sin_ka_half;
  
  // Store eigenvalue (frequency)
  eigenvalues[k_idx] = sqrt(omega_squared);

  // Simple eigenvector (longitudinal mode)
  if (k_mag > 1e-10) {
    eigenvectors[k_idx] = normalize(k);
  } else {
    eigenvectors[k_idx] = vec3<f32>(1.0, 0.0, 0.0);
  }
}
`;

// Quantum tunneling probability compute shader
export const tunnelingComputeShader = `
struct TunnelingParams {
  energy: f32,
  barrier_height: f32,
  barrier_width: f32,
  n_points: u32,
  dx: f32,
  hbar: f32,
  mass: f32,
  padding: f32
}

@group(0) @binding(0) var<storage, read> x_values: array<f32>;
@group(0) @binding(1) var<storage, read_write> transmission: array<f32>;
@group(0) @binding(2) var<storage, read_write> reflection: array<f32>;
@group(0) @binding(3) var<uniform> params: TunnelingParams;

// Wave number calculations
fn calculate_k(energy: f32, potential: f32) -> f32 {
  let kinetic = energy - potential;
  if (kinetic > 0.0) {
    return sqrt(2.0 * params.mass * kinetic) / params.hbar;
  } else {
    return sqrt(2.0 * params.mass * abs(kinetic)) / params.hbar;
  }
}

@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.n_points) {
    return;
  }

  let x = x_values[idx];
  let E = params.energy;

  // Define potential
  var V: f32;
  if (abs(x) < params.barrier_width * 0.5) {
    V = params.barrier_height;
  } else {
    V = 0.0;
  }

  // Calculate wave numbers
  let k1 = calculate_k(E, 0.0);          // Outside barrier
  let k2 = calculate_k(E, V);            // Inside barrier

  // Transmission coefficient (simplified)
  var T: f32;
  if (E > V) {
    // Above barrier - classical transmission
    T = 1.0;
  } else {
    // Below barrier - quantum tunneling
    let kappa = k2;
    let barrier_factor = exp(-2.0 * kappa * params.barrier_width);
    T = 4.0 * E * (V - E) / (V * V) * barrier_factor;
  }

  transmission[idx] = clamp(T, 0.0, 1.0);
  reflection[idx] = 1.0 - transmission[idx];
}
`;

// Crystal structure optimization compute shader
export const crystalOptimizationShader = `
struct CrystalParams {
  n_atoms: u32,
  lattice_constant: f32,
  epsilon: f32,
  sigma: f32,
  dt: f32,
  padding: vec3<f32>
}

@group(0) @binding(0) var<storage, read_write> positions: array<vec3<f32>>;
@group(0) @binding(1) var<storage, read_write> forces: array<vec3<f32>>;
@group(0) @binding(2) var<storage, read_write> energies: array<f32>;
@group(0) @binding(3) var<uniform> params: CrystalParams;

// Lennard-Jones potential and force calculation
fn lj_force(r_vec: vec3<f32>) -> vec3<f32> {
  let r = length(r_vec);
  if (r < 1e-6) {
    return vec3<f32>(0.0);
  }

  let r_normalized = r_vec / r;
  let sigma_over_r = params.sigma / r;
  let sigma_over_r6 = pow(sigma_over_r, 6.0);
  let sigma_over_r12 = sigma_over_r6 * sigma_over_r6;

  let force_magnitude = 24.0 * params.epsilon * (2.0 * sigma_over_r12 - sigma_over_r6) / r;
  return force_magnitude * r_normalized;
}

@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let i = global_id.x;
  if (i >= params.n_atoms) {
    return;
  }

  let pos_i = positions[i];
  var force_i = vec3<f32>(0.0);
  var energy_i = 0.0;

  // Calculate forces and energy from other atoms
  for (var j = 0u; j < params.n_atoms; j++) {
    if (i == j) {
      continue;
    }

    let pos_j = positions[j];
    let r_vec = pos_i - pos_j;
    let r = length(r_vec);

    if (r < 3.0 * params.sigma) { // Cutoff distance
      // Force calculation
      force_i += lj_force(r_vec);

      // Energy calculation (half to avoid double counting)
      let sigma_over_r = params.sigma / r;
      let sigma_over_r6 = pow(sigma_over_r, 6.0);
      let sigma_over_r12 = sigma_over_r6 * sigma_over_r6;
      energy_i += 0.5 * 4.0 * params.epsilon * (sigma_over_r12 - sigma_over_r6);
    }
  }

  forces[i] = force_i;
  energies[i] = energy_i;

  // Simple velocity Verlet integration for position update
  positions[i] = pos_i + force_i * params.dt * params.dt;
}
`;

// Band structure compute shader for 2D materials
export const bandStructureShader = `
struct BandParams {
  n_kpoints: u32,
  n_bands: u32,
  hopping_t: f32,
  lattice_constant: f32,
  spin_orbit: f32,
  padding: vec3<f32>
}

@group(0) @binding(0) var<storage, read> k_points: array<vec2<f32>>;
@group(0) @binding(1) var<storage, read_write> eigenvalues: array<f32>;
@group(0) @binding(2) var<uniform> params: BandParams;

// Simplified tight-binding Hamiltonian
@compute @workgroup_size(64)
fn computeMain(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let k_idx = global_id.x;
  if (k_idx >= params.n_kpoints) {
    return;
  }

  let k = k_points[k_idx];
  let kx = k.x;
  let ky = k.y;

  // Graphene-like dispersion relation
  let a = params.lattice_constant;
  let t = params.hopping_t;

  // Calculate the tight-binding energy
  let cos_term1 = cos(kx * a);
  let cos_term2 = cos(ky * a * sqrt(3.0) * 0.5);
  let cos_term3 = cos((kx - ky) * a * 0.5);

  let energy_term = t * sqrt(1.0 + 4.0 * cos_term1 * cos_term2 + 4.0 * cos_term2 * cos_term2);

  // Store both positive and negative energy bands
  let band_offset = k_idx * params.n_bands;
  if (band_offset + 1 < arrayLength(&eigenvalues)) {
    eigenvalues[band_offset] = energy_term;      // Conduction band
    eigenvalues[band_offset + 1] = -energy_term; // Valence band
  }
}
`;