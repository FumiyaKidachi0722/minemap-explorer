'use client';

import { useRef, useEffect } from 'react';

// Minimal 4x4 matrix utilities for WebGL
const mat4 = {
  create() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  },
  perspective(
    out: Float32Array,
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ) {
    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) / (near - far);
    out[11] = -1;

    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
    return out;
  },
  multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    const a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

    const b00 = b[0],
      b01 = b[1],
      b02 = b[2],
      b03 = b[3];
    const b10 = b[4],
      b11 = b[5],
      b12 = b[6],
      b13 = b[7];
    const b20 = b[8],
      b21 = b[9],
      b22 = b[10],
      b23 = b[11];
    const b30 = b[12],
      b31 = b[13],
      b32 = b[14],
      b33 = b[15];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;

    out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;

    out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;

    out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return out;
  },
  translate(out: Float32Array, a: Float32Array, v: [number, number, number]) {
    const x = v[0],
      y = v[1],
      z = v[2];
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      const a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
      const a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
      const a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;

      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  },
  rotateY(out: Float32Array, a: Float32Array, rad: number) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  },
  rotateX(out: Float32Array, a: Float32Array, rad: number) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  },
};

export default function ViewerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl') as WebGLRenderingContext;
    if (!gl) return;

    // Shader setup
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vs,
      `
      attribute vec4 position;
      uniform mat4 u_matrix;
      void main() {
        gl_Position = u_matrix * position;
      }
    `
    );
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      fs,
      `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `
    );
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const posLoc = gl.getAttribLocation(program, 'position');
    const matLoc = gl.getUniformLocation(program, 'u_matrix')!;
    const colorLoc = gl.getUniformLocation(program, 'u_color')!;

    const cubeVerts = new Float32Array([
      // front
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5,
      0.5, -0.5, 0.5, 0.5,
      // back
      -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5, -0.5, -0.5,
      // top
      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5, -0.5,
      // bottom
      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
      -0.5, 0.5, -0.5, -0.5, 0.5,
      // right
      0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
      0.5, 0.5, -0.5, 0.5,
      // left
      -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5,
      0.5, 0.5, -0.5, 0.5, -0.5,
    ]);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    const proj = mat4.create();
    mat4.perspective(proj, Math.PI / 3, aspect, 0.1, 100);

    const cubes: [number, number, number][] = [];
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        cubes.push([x, 0, z]);
      }
    }

    const player = { x: 0, y: 1.8, z: 5, yaw: 0, pitch: 0 };
    const keys: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        player.yaw -= e.movementX * 0.002;
        player.pitch -= e.movementY * 0.002;
        player.pitch = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, player.pitch)
        );
      }
    };
    document.addEventListener('mousemove', onMouseMove);

    const onClick = () => {
      canvas.requestPointerLock();
    };
    canvas.addEventListener('click', onClick);

    function update(delta: number) {
      const speed = delta * 3;
      const forward = keys['KeyW'] || keys['ArrowUp'];
      const back = keys['KeyS'] || keys['ArrowDown'];
      const left = keys['KeyA'] || keys['ArrowLeft'];
      const right = keys['KeyD'] || keys['ArrowRight'];

      const sin = Math.sin(player.yaw);
      const cos = Math.cos(player.yaw);
      if (forward) {
        player.x -= sin * speed;
        player.z -= cos * speed;
      }
      if (back) {
        player.x += sin * speed;
        player.z += cos * speed;
      }
      if (left) {
        player.x -= cos * speed;
        player.z += sin * speed;
      }
      if (right) {
        player.x += cos * speed;
        player.z -= sin * speed;
      }
    }

    let last = 0;
    function drawScene(time: number) {
      const delta = time * 0.001 - last;
      last = time * 0.001;
      update(delta);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.7, 0.8, 1.0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      for (const cube of cubes) {
        const m = mat4.create();
        mat4.translate(m, m, cube);
        const v = mat4.create();
        mat4.rotateX(v, v, player.pitch);
        mat4.rotateY(v, v, player.yaw);
        mat4.translate(v, v, [-player.x, -player.y, -player.z]);
        const mv = mat4.create();
        mat4.multiply(mv, v, m);
        const mvp = mat4.create();
        mat4.multiply(mvp, proj, mv);
        gl.uniformMatrix4fv(matLoc, false, mvp);
        gl.uniform4f(colorLoc, 0.3, 0.7, 0.4, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
      }
      requestAnimationFrame(drawScene);
    }
    requestAnimationFrame(drawScene);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} width={600} height={400} className="border" />;
}
