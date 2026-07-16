
import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

const VERT = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDark;
  varying vec2 vUv;

  vec3 palette(float t) {
    vec3 a = vec3(0.10, 0.12, 0.22);
    vec3 b = vec3(0.35, 0.40, 0.75);
    vec3 c = vec3(0.15, 0.55, 0.95);
    vec3 d = vec3(0.55, 0.30, 0.95);
    return a + b * cos(6.2831 * (c * t + d));
  }

  // Simple 2D noise
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
                   dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
               mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
                   dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution) - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.04;
    float n = 0.0;
    n += noise(uv * 1.2 + vec2(t, -t));
    n += 0.5 * noise(uv * 2.4 + vec2(-t * 1.3, t * 0.7));
    n += 0.25 * noise(uv * 4.8 + vec2(t * 0.5, t * 1.1));
    n = n * 0.5 + 0.5;

    // Two moving orbs
    float d1 = length(uv - vec2(sin(t * 2.0) * 0.35, cos(t * 1.7) * 0.25));
    float d2 = length(uv - vec2(cos(t * 1.3) * 0.4, sin(t * 2.2) * 0.35));
    float orb1 = smoothstep(0.55, 0.0, d1);
    float orb2 = smoothstep(0.6, 0.0, d2);

    vec3 col = palette(n * 0.6 + t * 0.15);
    col = mix(col, vec3(0.30, 0.35, 0.95), orb1 * 0.65);
    col = mix(col, vec3(0.15, 0.85, 0.95), orb2 * 0.35);

    // Vignette
    float v = smoothstep(1.1, 0.2, length(uv));
    col *= v;

    // Reduce intensity in light mode
    col *= mix(0.4, 0.9, uDark);
    gl_FragColor = vec4(col, 1.0);
  }
`

export default function OGLBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 1.5) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    host.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uDark: { value: document.documentElement.classList.contains('dark') ? 1 : 0 },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [w, h]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const obs = new MutationObserver(() => {
      program.uniforms.uDark.value = document.documentElement.classList.contains('dark') ? 1 : 0
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let raf = 0
    let last = performance.now()
    const start = last
    const loop = (now: number) => {
      last = now
      program.uniforms.uTime.value = (now - start) / 1000
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      obs.disconnect()
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas)
    }
  }, [])

  return (
    <div
      ref={hostRef}
      aria-hidden
      data-testid="ogl-background"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.55] dark:opacity-[0.45] mix-blend-screen dark:mix-blend-screen"
      style={{ maskImage: 'radial-gradient(ellipse at 50% 20%, black 40%, transparent 85%)' }}
    />
  )
}


