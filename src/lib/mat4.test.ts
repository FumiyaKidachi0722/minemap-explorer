import { describe, it, expect } from 'vitest';
import { mat4 } from './mat4';

describe('mat4 utility', () => {
  it('creates identity matrix', () => {
    const m = mat4.create();
    expect(Array.from(m)).toEqual([
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ]);
  });

  it('multiplies and translates matrices', () => {
    const a = mat4.create();
    const b = mat4.create();
    mat4.translate(b, b, [1,2,3]);
    const out = mat4.create();
    mat4.multiply(out, a, b);
    expect(out[12]).toBeCloseTo(1);
    expect(out[13]).toBeCloseTo(2);
    expect(out[14]).toBeCloseTo(3);
  });

  it('rotates matrices', () => {
    const m = mat4.create();
    mat4.rotateY(m, m, Math.PI/2);
    expect(m[0]).toBeCloseTo(0);
    expect(m[8]).toBeCloseTo(1);
  });
});
