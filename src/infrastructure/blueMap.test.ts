import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadBlueMapChunk } from './blueMap';

declare const atob: (s: string) => string;

function buildChunk(): {base64: string, buffer: ArrayBuffer} {
  const buf = new ArrayBuffer(36);
  const view = new DataView(buf);
  new TextEncoder().encodeInto('BLKB', new Uint8Array(buf,0,4));
  view.setUint32(4, 1, true);
  view.setFloat32(8, 1, true); // x
  view.setFloat32(12, 2, true); // y
  view.setFloat32(16, 3, true); // z
  view.setFloat32(20, 0.1, true);
  view.setFloat32(24, 0.2, true);
  view.setFloat32(28, 0.3, true);
  view.setFloat32(32, 0.4, true);
  const base64 = Buffer.from(buf).toString('base64');
  return { base64, buffer: buf };
}

const { base64, buffer } = buildChunk();

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('loadBlueMapChunk', () => {
  it('loads chunk without DecompressionStream', async () => {
    (global as any).fetch = vi.fn().mockResolvedValue({ text: () => base64 });
    delete (global as any).window?.DecompressionStream;
    delete (global as any).DecompressionStream;
    const blocks = await loadBlueMapChunk('/foo');
    expect(blocks[0].pos).toEqual([1,2,3]);
    blocks[0].color.forEach((c,i)=>{
      expect(c).toBeCloseTo([0.1,0.2,0.3,0.4][i]);
    });
  });

  it('loads chunk with DecompressionStream', async () => {
    (global as any).fetch = vi.fn().mockResolvedValue({ text: () => base64 });
    const gzBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    class DS {
      readable: ReadableStream<Uint8Array>;
      constructor(_type: string){
        this.readable = new ReadableStream({
          start(ctrl){
            ctrl.enqueue(gzBytes);
            ctrl.close();
          }
        });
      }
    }
    (global as any).DecompressionStream = DS;
    (global as any).window.DecompressionStream = DS;
    Blob.prototype.stream = function(){
      return { pipeThrough: () => (new DS('gzip')).readable } as any;
    };
    const blocks = await loadBlueMapChunk('/foo');
    expect(blocks.length).toBe(1);
  });

  it('throws on invalid magic', async () => {
    const bad = Buffer.from('ZZZZ').toString('base64');
    (global as any).fetch = vi.fn().mockResolvedValue({ text: () => bad });
    delete (global as any).window?.DecompressionStream;
    delete (global as any).DecompressionStream;
    await expect(loadBlueMapChunk('/bad')).rejects.toThrow('invalid format');
  });
});
