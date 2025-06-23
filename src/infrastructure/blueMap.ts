import { Block } from '@/domain/block';

/**
 * Load a gzipped base64 encoded BlueMap chunk file.
 * The format is very small and only used for the demo.
 */
export async function loadBlueMapChunk(url: string): Promise<Block[]> {
  const res = await fetch(url);
  const b64 = await res.text();
  const gzBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  let buf: ArrayBuffer;
  if ('DecompressionStream' in window) {
    const ds = new DecompressionStream('gzip');
    const stream = new Blob([gzBytes]).stream().pipeThrough(ds);
    buf = await new Response(stream).arrayBuffer();
  } else {
    buf = gzBytes.buffer;
  }

  const data = new DataView(buf);
  const magic = new TextDecoder().decode(new Uint8Array(buf.slice(0, 4)));
  if (magic !== 'BLKB') throw new Error('invalid format');
  const count = data.getUint32(4, true);
  const blocks: Block[] = [];
  let offset = 8;
  for (let i = 0; i < count; i++) {
    const x = data.getFloat32(offset, true);
    offset += 4;
    const y = data.getFloat32(offset, true);
    offset += 4;
    const z = data.getFloat32(offset, true);
    offset += 4;
    const c0 = data.getFloat32(offset, true);
    offset += 4;
    const c1 = data.getFloat32(offset, true);
    offset += 4;
    const c2 = data.getFloat32(offset, true);
    offset += 4;
    const c3 = data.getFloat32(offset, true);
    offset += 4;
    blocks.push({ pos: [x, y, z], color: [c0, c1, c2, c3] });
  }
  return blocks;
}
