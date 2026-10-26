'use client';
import * as React from 'react';
const clamp01 = (t) => Math.min(1, Math.max(0, t));
export function cubicBezier(x1, y1, x2, y2) {
    const bx = (t) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
    const by = (t) => 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
    return (x) => {
        if (x <= 0)
            return 0;
        if (x >= 1)
            return 1;
        let lo = 0;
        let hi = 1;
        let t = x;
        for (let i = 0; i < 40; i++) {
            t = (lo + hi) / 2;
            if (bx(t) < x)
                lo = t;
            else
                hi = t;
        }
        return by(t);
    };
}
export const NAMED_CURVES = {
    ink: [0.7, 0, 0.2, 1],
    lusion: [0.35, 0, 0, 1],
    osmo: [0.625, 0.05, 0, 1],
    'expo.out': [0.16, 1, 0.3, 1],
    'power3.out': [0.25, 1, 0.5, 1],
    'power2.inOut': [0.65, 0, 0.35, 1],
};
export function resolveEase(value) {
    const v = String(value ?? '').trim();
    if (v === 'linear')
        return (t) => t;
    const named = NAMED_CURVES[v];
    if (named)
        return cubicBezier(...named);
    const m = v.match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);
    if (m)
        return cubicBezier(+m[1], +m[2], +m[3], +m[4]);
    return cubicBezier(...NAMED_CURVES.ink);
}
export const DEFAULT_STAGGER = { word: 240, line: 360, all: 0 };
export const MAX_SPREAD = 2400;
export function effectiveStagger(stagger, n) {
    if (n <= 1)
        return 0;
    return Math.max(0, Math.min(stagger, MAX_SPREAD / (n - 1)));
}
export function totalTime(duration, stagger, n) {
    return duration + effectiveStagger(stagger, n) * Math.max(0, n - 1);
}
export function unitProgress(P, k, n, duration, stagger) {
    const s = effectiveStagger(stagger, n);
    const T = totalTime(duration, stagger, n);
    return clamp01((clamp01(P) * T - k * s) / Math.max(1, duration));
}
export const HANDOFF = 0.9;
export function handoffAt(p) {
    return p >= HANDOFF ? 1 : 0;
}
export function splitWords(text) {
    const out = [];
    const lines = String(text ?? '').split('\n');
    lines.forEach((line, li) => {
        const words = line.split(/\s+/).filter(Boolean);
        words.forEach((word, wi) => {
            out.push({ word, space: wi < words.length - 1, br: wi === words.length - 1 && li < lines.length - 1 });
        });
    });
    return out;
}
export function groupLines(tops, lineHeight) {
    const out = [];
    let line = -1;
    let lastTop = -Infinity;
    for (const top of tops) {
        if (top - lastTop > lineHeight * 0.5) {
            line++;
            lastTop = top;
        }
        out.push(Math.max(0, line));
    }
    return out;
}
export function wordTiles(boxes, lines, pad, width, height) {
    const n = lines.length ? Math.max(...lines) + 1 : 0;
    const top = Array(n).fill(Infinity);
    const bot = Array(n).fill(-Infinity);
    boxes.forEach((b, i) => {
        top[lines[i]] = Math.min(top[lines[i]], b[1]);
        bot[lines[i]] = Math.max(bot[lines[i]], b[3]);
    });
    const mid = (a, b) => (a + b) / 2;
    const bandTop = top.map((t, l) => (l === 0 ? Math.max(0, t - pad) : Math.max(t - pad, mid(bot[l - 1], t))));
    const bandBot = bot.map((b, l) => (l === n - 1 ? Math.min(height, b + pad) : Math.min(b + pad, mid(b, top[l + 1]))));
    const out = boxes.map(() => [0, 0, 0, 0]);
    for (let l = 0; l < n; l++) {
        const idx = boxes.map((_, i) => i).filter((i) => lines[i] === l).sort((a, b) => boxes[a][0] - boxes[b][0]);
        idx.forEach((i, j) => {
            const b = boxes[i];
            const prev = j > 0 ? boxes[idx[j - 1]] : null;
            const next = j < idx.length - 1 ? boxes[idx[j + 1]] : null;
            const x0 = prev ? mid(prev[2], b[0]) : Math.max(0, b[0] - pad);
            const x1 = next ? mid(b[2], next[0]) : Math.min(width, b[2] + pad);
            out[i] = [x0, bandTop[l], x1, bandBot[l]];
        });
    }
    return out;
}
export function unitsFor(by, lines) {
    const raw = by === 'all' ? lines.map(() => 0) : by === 'line' ? lines.slice() : lines.map((_, i) => i);
    const n = raw.length ? Math.max(...raw) + 1 : 0;
    return n > MAX_UNITS ? raw.map((u) => Math.floor((u * MAX_UNITS) / n)) : raw;
}
export const MAX_UNITS = 64;
export function applyTransform(word, transform) {
    if (transform === 'uppercase')
        return word.toUpperCase();
    if (transform === 'lowercase')
        return word.toLowerCase();
    if (transform === 'capitalize')
        return word.replace(/^\p{L}/u, (c) => c.toUpperCase());
    return word;
}
export function scrollProgress(top, height, viewport) {
    return clamp01((viewport - top) / Math.max(1, viewport * 0.5 + height * 0.5));
}
export function damp(current, target, lambda, dt) {
    return target + (current - target) * Math.exp(-lambda * dt);
}
const browserClock = {
    now: () => performance.now(),
    raf: (cb) => requestAnimationFrame(cb),
    caf: (id) => cancelAnimationFrame(id),
};
export function createTween(o, clock = browserClock) {
    if (o.duration <= 0) {
        o.onUpdate(o.to);
        o.onDone?.();
        return { cancel() { } };
    }
    const start = clock.now();
    let dead = false;
    let id = 0;
    const step = (now) => {
        if (dead)
            return;
        const k = Math.min(1, Math.max(0, (now - start) / o.duration));
        o.onUpdate(k >= 1 ? o.to : o.from + (o.to - o.from) * o.ease(k));
        if (k >= 1) {
            dead = true;
            o.onDone?.();
        }
        else
            id = clock.raf(step);
    };
    id = clock.raf(step);
    return {
        cancel() {
            dead = true;
            clock.caf(id);
        },
    };
}
export function colorToRgb(css) {
    const s = css.trim();
    let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
        const hex = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
        return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    }
    if (/^transparent$/i.test(s))
        return null;
    m = s.match(/^rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?))?\s*\)/i);
    if (m) {
        if (m[4] !== undefined && Number(m[4]) === 0)
            return null;
        return [+m[1] / 255, +m[2] / 255, +m[3] / 255];
    }
    return null;
}
const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform float uUnits[64];
uniform vec2 uSpan[64];
uniform vec4 uTile[64];
uniform float uFeather;
uniform float uBleed;
uniform float uNoiseScale;
uniform float uEm;
uniform float uLod;
uniform float uHandoff;
uniform vec3 uInk;

uint hashU(uvec2 p) {
  uint n = p.x * 1664525u ^ (p.y * 22695477u + 12345u);
  n ^= n >> 15u; n *= 2246822519u;
  n ^= n >> 13u; n *= 3266489917u;
  n ^= n >> 16u;
  return n;
}
float hash2(vec2 p) {
  ivec2 ip = ivec2(floor(p)) + 32768;
  return float(hashU(uvec2(ip))) / 4294967295.0;
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = m * p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v / 0.9375;
}

void main() {
  vec4 m0 = texelFetch(uMask, ivec2(vUv * uResolution), 0);
  float unit = floor(m0.g * 255.0 + 0.5);
  if (unit < 0.5) { fragColor = vec4(0.0); return; }
  int k = int(unit) - 1;
  float p = uUnits[k];
  if (p <= 0.0 || p >= uHandoff) { fragColor = vec4(0.0); return; }

  float glyph = m0.r;
  vec2 q = vUv * uResolution / uEm;
  float n = fbm(q * uNoiseScale + unit * 3.17);
  vec2 span = uSpan[k];
  float lean = clamp((vUv.x - span.x) / max(span.y - span.x, 1e-4), 0.0, 1.0);
  float f = mix(n, lean, 0.35);

  float w = max(uFeather, 0.01);
  vec2 fq = q * 9.0;
  float r1 = 1.0 - abs(2.0 * vnoise(vec2(fq.x * 3.0 + fq.y * 1.2, fq.y * 0.7 - fq.x * 0.3) + vnoise(fq * 1.7) * 1.5) - 1.0);
  float r2 = 1.0 - abs(2.0 * vnoise(vec2(fq.x * 0.6 - fq.y * 0.4 + 5.0, fq.y * 3.0 + fq.x * 0.9) + vnoise(fq * 1.3 + 9.0) * 1.5) - 1.0);
  float fib = pow(max(r1, r2), 14.0);

  float dark = smoothstep(0.45, 0.75, dot(uInk, vec3(0.299, 0.587, 0.114)));
  float t = -w + (1.0 + 2.0 * w) * p;
  float front = 1.0 - smoothstep(t - w, t + w * 0.25, f - fib * w * mix(0.35, 0.15, dark));
  float band = smoothstep(t - w * 0.9, t, f) * (1.0 - smoothstep(t, t + w * 0.25, f));
  float settle = smoothstep(0.62, uHandoff, p);

  float wetTone = 0.8 + 0.15 * band + 0.06 * (vnoise(q * 40.0) - 0.5);
  float inLetter = glyph * front * mix(wetTone, 1.0, settle);

  float soft = textureLod(uMask, vUv, uLod + 1.0).r;
  float rag = (fbm(q * 6.0 + unit * 1.3) - 0.5) * 0.22;
  float grow = 1.0 - pow(1.0 - clamp(p / 0.45, 0.0, 1.0), 2.0);
  float level = mix(0.48, 0.15, grow * uBleed);
  float s = soft + rag;
  float bled = smoothstep(level - 0.025, level + 0.025, s) * (1.0 - glyph);
  float rim = bled * (1.0 - smoothstep(level + 0.02, level + 0.11, s));
  float fade = smoothstep(0.0, 0.06, p) * (1.0 - smoothstep(0.45, 0.82, p));
  vec4 tile = uTile[k];
  vec2 px = vUv * uResolution;
  float edgeDist = min(min(px.x - tile.x, tile.z - px.x), min(px.y - tile.y, tile.w - px.y));
  float keep = smoothstep(0.0, uEm * 0.12, edgeDist);
  float outLetter = (bled * 0.14 + rim * mix(0.62, 0.36, dark) + rim * fib * mix(0.25, 0.08, dark)) * front * fade * keep;

  float a = clamp(inLetter + outLetter, 0.0, 1.0);
  fragColor = vec4(uInk * a, a);
}`;
const UNIFORMS = ['uMask', 'uResolution', 'uUnits', 'uSpan', 'uTile', 'uFeather', 'uBleed', 'uNoiseScale', 'uEm', 'uLod', 'uHandoff', 'uInk'];
class InkSurface {
    canvas;
    gl = null;
    program = null;
    loc = new Map();
    textures = new Map();
    masks = new Map();
    redraws = new Map();
    lost = false;
    ok = false;
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 2;
        this.canvas.height = 2;
        this.canvas.addEventListener('webglcontextlost', this.onLost);
        this.canvas.addEventListener('webglcontextrestored', this.onRestored);
        this.ok = this.init();
    }
    onLost = (e) => {
        e.preventDefault();
        this.lost = true;
        this.ok = false;
    };
    onRestored = () => {
        this.lost = false;
        this.textures.clear();
        this.ok = this.init();
        if (!this.ok)
            return;
        for (const [id, mask] of this.masks)
            this.upload(id, mask);
        for (const redraw of this.redraws.values())
            redraw();
    };
    init() {
        const gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
        if (!gl || gl.isContextLost())
            return false;
        const compile = (type, src) => {
            const sh = gl.createShader(type);
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            if (gl.getShaderParameter(sh, gl.COMPILE_STATUS))
                return sh;
            return null;
        };
        const vs = compile(gl.VERTEX_SHADER, VERT);
        const fs = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs)
            return false;
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return false;
        }
        gl.useProgram(program);
        gl.bindVertexArray(gl.createVertexArray());
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'aPos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        this.loc.clear();
        for (const name of UNIFORMS)
            this.loc.set(name, gl.getUniformLocation(program, name));
        gl.uniform1i(this.loc.get('uMask'), 0);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
        gl.enable(gl.SCISSOR_TEST);
        this.gl = gl;
        this.program = program;
        return true;
    }
    register(id, redraw) {
        this.redraws.set(id, redraw);
    }
    upload(id, mask) {
        this.masks.set(id, mask);
        const gl = this.gl;
        if (!gl || this.lost)
            return;
        const tex = this.textures.get(id) ?? gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.textures.set(id, tex);
    }
    forget(id) {
        const tex = this.textures.get(id);
        if (tex && this.gl && !this.lost)
            this.gl.deleteTexture(tex);
        this.textures.delete(id);
        this.masks.delete(id);
        this.redraws.delete(id);
    }
    draw(id, target, width, height, u) {
        const gl = this.gl;
        const tex = this.textures.get(id);
        if (!gl || !this.program || !this.ok || !tex || width < 1 || height < 1)
            return false;
        if (this.canvas.width < width || this.canvas.height < height) {
            this.canvas.width = Math.min(4096, Math.max(this.canvas.width, width));
            this.canvas.height = Math.min(4096, Math.max(this.canvas.height, height));
        }
        const W = Math.min(width, this.canvas.width);
        const H = Math.min(height, this.canvas.height);
        const y = this.canvas.height - H;
        gl.useProgram(this.program);
        gl.viewport(0, y, W, H);
        gl.scissor(0, y, W, H);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        const L = (n) => this.loc.get(n);
        gl.uniform2f(L('uResolution'), W, H);
        gl.uniform1fv(L('uUnits'), u.units);
        gl.uniform2fv(L('uSpan'), u.spans);
        gl.uniform4fv(L('uTile'), u.tiles);
        gl.uniform1f(L('uFeather'), u.feather);
        gl.uniform1f(L('uBleed'), u.bleed);
        gl.uniform1f(L('uNoiseScale'), u.noiseScale);
        gl.uniform1f(L('uEm'), u.em);
        gl.uniform1f(L('uLod'), u.lod);
        gl.uniform1f(L('uHandoff'), HANDOFF);
        gl.uniform3f(L('uInk'), ...u.ink);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        target.clearRect(0, 0, W, H);
        target.drawImage(this.canvas, 0, 0, W, H, 0, 0, W, H);
        return true;
    }
}
let surface = null;
function getSurface() {
    if (typeof document === 'undefined')
        return null;
    if (!surface)
        surface = new InkSurface();
    return surface.ok ? surface : null;
}
let nextId = 1;
function resolveCssColor(v) {
    const direct = colorToRgb(v);
    if (direct)
        return direct;
    if (/^transparent$/i.test(v.trim()) || /^rgba?\([^)]*[,/]\s*0\s*\)$/i.test(v.trim()))
        return null;
    try {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        const ctx = cv.getContext('2d');
        if (!ctx)
            return null;
        ctx.fillStyle = '#000';
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        if (d[3] === 0)
            return null;
        return [d[0] / 255, d[1] / 255, d[2] / 255];
    }
    catch {
        return null;
    }
}
function useMedia(query, serverDefault) {
    return React.useSyncExternalStore((onChange) => {
        const mq = window.matchMedia(query);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, () => window.matchMedia(query).matches, () => serverDefault);
}
const cn = (...xs) => xs.filter(Boolean).join(' ');
const REDUCED = '(prefers-reduced-motion: reduce)';
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
export default function InkHeadline({ children, as = 'h2', trigger = 'inView', progress = 0, by = 'word', duration = 1800, stagger, ease = 'linear', bleed = 0.6, feather = 0.12, noiseScale = 2.2, inkColor, once = true, dprCap = 2, className, }) {
    const rootRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const reduced = useMedia(REDUCED, false);
    const [failed, setFailed] = React.useState(false);
    const plain = reduced || failed;
    const E = React.useMemo(() => resolveEase(ease), [ease]);
    const tokens = React.useMemo(() => splitWords(children), [children]);
    const gap = stagger ?? DEFAULT_STAGGER[by];
    const live = React.useRef({
        P: trigger === 'manual' ? clamp01(progress) : 0,
        units: [],
        n: 0,
        tween: null,
        ready: false,
        pending: false,
        paint: () => { },
        start: () => { },
    });
    const opts = React.useRef({ E, duration, gap, bleed, feather, noiseScale, inkColor, by });
    opts.current = { E, duration, gap, bleed, feather, noiseScale, inkColor, by };
    useIsoLayoutEffect(() => {
        const root = rootRef.current;
        if (!root || plain)
            return;
        for (const el of root.querySelectorAll('[data-ink-word]'))
            el.style.opacity = '0';
        return () => {
            for (const el of root.querySelectorAll('[data-ink-word]'))
                el.style.opacity = '';
        };
    }, [plain, tokens]);
    const animateTo = React.useCallback((target) => {
        const s = live.current;
        s.tween?.cancel();
        const o = opts.current;
        const T = totalTime(o.duration, o.gap, Math.max(1, s.n));
        const ms = T * Math.abs(target - s.P) * (target < s.P ? 0.6 : 1);
        s.tween = createTween({
            from: s.P,
            to: target,
            duration: ms,
            ease: (t) => t,
            onUpdate: (v) => {
                s.P = v;
                s.paint();
            },
            onDone: () => {
                s.tween = null;
            },
        });
    }, []);
    React.useEffect(() => {
        if (plain || window.matchMedia(REDUCED).matches)
            return;
        const surf = getSurface();
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!surf || !root || !canvas || !ctx) {
            setFailed(true);
            return;
        }
        const id = nextId++;
        const s = live.current;
        const words = [...root.querySelectorAll('[data-ink-word]')];
        const mask = document.createElement('canvas');
        let W = 0;
        let H = 0;
        let em = 16;
        let margin = 0;
        let ink = [0.1, 0.1, 0.1];
        const unitsBuf = new Float32Array(MAX_UNITS);
        const spansBuf = new Float32Array(MAX_UNITS * 2);
        const tilesBuf = new Float32Array(MAX_UNITS * 4);
        let dpr = 1;
        let dead = false;
        const theme = () => {
            const o = opts.current;
            ink = (o.inkColor && resolveCssColor(o.inkColor)) || resolveCssColor(getComputedStyle(root).color) || [0.1, 0.1, 0.1];
        };
        const build = () => {
            if (dead)
                return;
            const cs = getComputedStyle(root);
            em = parseFloat(cs.fontSize) || 16;
            margin = Math.ceil(em * 0.35);
            const box = root.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            const ox = Math.floor((box.left - margin) * dpr) / dpr;
            const oy = Math.floor((box.top - margin) * dpr) / dpr;
            W = Math.max(1, Math.min(4096, Math.ceil((box.right + margin) * dpr - ox * dpr)));
            H = Math.max(1, Math.min(4096, Math.ceil((box.bottom + margin) * dpr - oy * dpr)));
            const cssW = W / dpr;
            const cssH = H / dpr;
            canvas.style.left = `${ox - box.left}px`;
            canvas.style.top = `${oy - box.top}px`;
            canvas.style.width = `${cssW}px`;
            canvas.style.height = `${cssH}px`;
            canvas.width = W;
            canvas.height = H;
            mask.width = W;
            mask.height = H;
            const m = mask.getContext('2d');
            if (!m)
                return;
            const rects = words.map((el) => el.getBoundingClientRect());
            const lineHeight = parseFloat(cs.lineHeight) || em * 1.2;
            const lines = groupLines(rects.map((r) => r.top), lineHeight);
            s.units = unitsFor(opts.current.by, lines);
            s.n = s.units.length ? Math.max(...s.units) + 1 : 0;
            const pad = em * 0.3;
            m.setTransform(1, 0, 0, 1, 0, 0);
            m.globalCompositeOperation = 'source-over';
            m.fillStyle = 'rgb(0,0,0)';
            m.fillRect(0, 0, W, H);
            const tiles = wordTiles(rects.map((r) => [r.left - ox, r.top - oy, r.right - ox, r.bottom - oy]), lines, pad, cssW, cssH);
            spansBuf.fill(0);
            for (let k = 0; k < MAX_UNITS; k++)
                spansBuf[k * 2] = 1;
            tilesBuf.fill(0);
            for (let k = 0; k < MAX_UNITS; k++) {
                tilesBuf[k * 4] = Infinity;
                tilesBuf[k * 4 + 1] = Infinity;
                tilesBuf[k * 4 + 2] = -Infinity;
                tilesBuf[k * 4 + 3] = -Infinity;
            }
            tiles.forEach(([x0, y0, x1, y1], i) => {
                const u = s.units[i] ?? 0;
                const X0 = Math.round(x0 * dpr);
                const Y0 = Math.round(y0 * dpr);
                const X1 = Math.round(x1 * dpr);
                const Y1 = Math.round(y1 * dpr);
                m.fillStyle = `rgb(0,${u + 1},0)`;
                m.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
                tilesBuf[u * 4] = Math.min(tilesBuf[u * 4], X0);
                tilesBuf[u * 4 + 1] = Math.min(tilesBuf[u * 4 + 1], H - Y1);
                tilesBuf[u * 4 + 2] = Math.max(tilesBuf[u * 4 + 2], X1);
                tilesBuf[u * 4 + 3] = Math.max(tilesBuf[u * 4 + 3], H - Y0);
                const r = rects[i];
                spansBuf[u * 2] = Math.min(spansBuf[u * 2], (r.left - ox) / cssW);
                spansBuf[u * 2 + 1] = Math.max(spansBuf[u * 2 + 1], (r.right - ox) / cssW);
            });
            m.setTransform(1, 0, 0, 1, 0, 0);
            m.globalCompositeOperation = 'lighter';
            m.fillStyle = 'rgb(255,0,0)';
            m.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * dpr}px ${cs.fontFamily}`;
            const lsp = cs.letterSpacing;
            if ('letterSpacing' in m)
                m.letterSpacing = lsp === 'normal' ? '0px' : `${parseFloat(lsp) * dpr}px`;
            m.fontKerning = 'normal';
            m.textBaseline = 'alphabetic';
            const markers = words.map((el) => {
                const mk = document.createElement('span');
                mk.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
                el.appendChild(mk);
                return mk;
            });
            const baselines = markers.map((mk) => mk.getBoundingClientRect().top);
            markers.forEach((mk) => mk.remove());
            words.forEach((el, i) => {
                const r = rects[i];
                const text = applyTransform(el.textContent ?? '', cs.textTransform);
                m.fillText(text, (r.left - ox) * dpr, Math.round(baselines[i] * dpr) - oy * dpr);
            });
            m.setTransform(1, 0, 0, 1, 0, 0);
            surf.upload(id, mask);
            s.ready = true;
            s.paint();
        };
        s.paint = () => {
            root.style.setProperty('--ink-headline', String(s.P));
            const o = opts.current;
            let any = false;
            let done = true;
            for (let k = 0; k < MAX_UNITS; k++)
                unitsBuf[k] = 0;
            const n = Math.max(1, s.n);
            const unitP = [];
            for (let k = 0; k < n; k++) {
                const lin = unitProgress(s.P, k, n, o.duration, o.gap);
                const p = lin >= 1 ? 1 : o.E(lin);
                unitP.push(p);
                unitsBuf[k] = p;
                if (p > 0 && p < HANDOFF)
                    any = true;
                if (p < HANDOFF)
                    done = false;
            }
            words.forEach((el, i) => {
                el.style.opacity = String(handoffAt(unitP[s.units[i] ?? 0] ?? 0));
            });
            canvas.style.visibility = done ? 'hidden' : 'visible';
            if (!s.ready || !W || !H)
                return;
            if (!any) {
                ctx.clearRect(0, 0, W, H);
                return;
            }
            surf.draw(id, ctx, W, H, {
                units: unitsBuf,
                spans: spansBuf,
                tiles: tilesBuf,
                feather: o.feather,
                bleed: clamp01(o.bleed),
                noiseScale: o.noiseScale,
                em: em * dpr,
                lod: Math.max(0, Math.log2(Math.max(1, em * dpr * 0.12))),
                ink,
            });
        };
        surf.register(id, () => s.paint());
        theme();
        s.paint();
        let rebuildRaf = 0;
        const rebuild = () => {
            cancelAnimationFrame(rebuildRaf);
            rebuildRaf = requestAnimationFrame(build);
        };
        const hcs = getComputedStyle(root);
        const face = `${hcs.fontStyle} ${hcs.fontWeight} ${hcs.fontSize} ${hcs.fontFamily}`;
        Promise.all([document.fonts?.ready, document.fonts?.load(face).catch(() => [])]).then(() => {
            build();
            if (s.pending) {
                s.pending = false;
                s.start();
            }
        });
        document.fonts?.addEventListener?.('loadingdone', rebuild);
        const ro = new ResizeObserver(rebuild);
        ro.observe(root);
        const onTheme = () => {
            theme();
            s.paint();
        };
        const mo = new MutationObserver(onTheme);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
        const scheme = window.matchMedia('(prefers-color-scheme: dark)');
        scheme.addEventListener('change', onTheme);
        return () => {
            dead = true;
            s.tween?.cancel();
            s.tween = null;
            s.ready = false;
            s.paint = () => { };
            cancelAnimationFrame(rebuildRaf);
            document.fonts?.removeEventListener?.('loadingdone', rebuild);
            ro.disconnect();
            mo.disconnect();
            scheme.removeEventListener('change', onTheme);
            surf.forget(id);
        };
    }, [plain, dprCap, tokens, by]);
    React.useEffect(() => {
        if (plain || trigger !== 'inView')
            return;
        const root = rootRef.current;
        if (!root)
            return;
        const s = live.current;
        s.start = () => animateTo(1);
        const io = new IntersectionObserver(([entry]) => {
            if (!entry)
                return;
            if (entry.isIntersecting) {
                if (s.ready)
                    s.start();
                else
                    s.pending = true;
                if (once)
                    io.disconnect();
            }
            else if (!once) {
                s.pending = false;
                animateTo(0);
            }
        }, { threshold: 0.35 });
        io.observe(root);
        return () => {
            io.disconnect();
            s.pending = false;
            s.start = () => { };
        };
    }, [plain, trigger, once, animateTo, tokens]);
    React.useEffect(() => {
        if (plain || trigger !== 'scroll')
            return;
        const root = rootRef.current;
        if (!root)
            return;
        const s = live.current;
        s.tween?.cancel();
        s.tween = null;
        let raf = 0;
        let last = 0;
        const step = (now) => {
            raf = 0;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            const r = root.getBoundingClientRect();
            const target = scrollProgress(r.top, r.height, window.innerHeight);
            s.P = damp(s.P, target, 12, dt);
            if (Math.abs(s.P - target) < 5e-4)
                s.P = target;
            s.paint();
            if (s.P !== target)
                raf = requestAnimationFrame(step);
            else
                last = 0;
        };
        const onScroll = () => {
            if (!raf)
                raf = requestAnimationFrame(step);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [plain, trigger]);
    React.useEffect(() => {
        if (plain || trigger !== 'manual')
            return;
        const s = live.current;
        s.tween?.cancel();
        s.tween = null;
        s.P = clamp01(progress);
        s.paint();
    }, [plain, trigger, progress]);
    return React.createElement(as, { ref: rootRef, 'data-ink-headline': '', 'data-trigger': trigger, className: cn('relative', className) }, tokens.map((t, i) => (<React.Fragment key={i}>
        <span data-ink-word="">{t.word}</span>
        {t.space || t.br ? ' ' : null}
        {t.br ? <br /> : null}
      </React.Fragment>)), !plain ? <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 block"/> : null);
}
export { InkHeadline };
