/* istanbul ignore file */
'use client';

import { useEffect, useRef } from 'react';
import { mat4 } from '@/lib/mat4';

// Simple viewer used on the demo page. Handles keyboard and mouse input and
// renders a small grid of cubes using raw WebGL APIs.

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
