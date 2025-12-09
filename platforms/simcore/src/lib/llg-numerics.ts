export const vec3 = {
  add: (a: [number, number, number], b: [number, number, number]): [number, number, number] =>
    [a[0] + b[0], a[1] + b[1], a[2] + b[2]],

  subtract: (a: [number, number, number], b: [number, number, number]): [number, number, number] =>
    [a[0] - b[0], a[1] - b[1], a[2] - b[2]],

  scale: (v: [number, number, number], s: number): [number, number, number] =>
    [v[0] * s, v[1] * s, v[2] * s],

  dot: (a: [number, number, number], b: [number, number, number]): number =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],

  cross: (a: [number, number, number], b: [number, number, number]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],

  magnitude: (v: [number, number, number]): number =>
    Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),

  normalize: (v: [number, number, number]): [number, number, number] => {
    const mag = vec3.magnitude(v);
    return mag > 1e-12 ? vec3.scale(v, 1 / mag) : [0, 0, 1];
  }
};

export const solveLLGRK4 = (
  m: [number, number, number],
  H_eff: [number, number, number],
  alpha: number,
  gamma: number,
  dt: number
): [number, number, number] => {
  const llgDerivative = (mag: [number, number, number], field: [number, number, number]) => {
    const mxH = vec3.cross(mag, field);
    const mxmxH = vec3.cross(mag, mxH);
    const precession = vec3.scale(mxH, -gamma);
    const damping = vec3.scale(mxmxH, -alpha * gamma);
    return vec3.add(precession, damping);
  };

  const k1 = llgDerivative(m, H_eff);
  const m2 = vec3.add(m, vec3.scale(k1, dt / 2));
  const k2 = llgDerivative(vec3.normalize(m2), H_eff);
  const m3 = vec3.add(m, vec3.scale(k2, dt / 2));
  const k3 = llgDerivative(vec3.normalize(m3), H_eff);
  const m4 = vec3.add(m, vec3.scale(k3, dt));
  const k4 = llgDerivative(vec3.normalize(m4), H_eff);

  const dk = vec3.add(
    vec3.add(k1, vec3.scale(k2, 2)),
    vec3.add(vec3.scale(k3, 2), k4)
  );

  const newM = vec3.add(m, vec3.scale(dk, dt / 6));
  return vec3.normalize(newM);
};

export const calculateEffectiveField = (
  m: [number, number, number],
  appliedField: [number, number, number],
  anisotropyStrength: number,
  easyAxis: [number, number, number]
): [number, number, number] => {
  const mDotEasy = vec3.dot(m, easyAxis);
  const anisotropyField = vec3.scale(easyAxis, 2 * anisotropyStrength * mDotEasy);
  return vec3.add(appliedField, anisotropyField);
};

export const calculateEnergy = (
  m: [number, number, number],
  appliedField: [number, number, number],
  anisotropyStrength: number,
  easyAxis: [number, number, number]
): number => {
  const zeemanEnergy = -vec3.dot(m, appliedField);
  const mDotEasy = vec3.dot(m, easyAxis);
  const anisotropyEnergy = -anisotropyStrength * mDotEasy * mDotEasy;
  return zeemanEnergy + anisotropyEnergy;
};
