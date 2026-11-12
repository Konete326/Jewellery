import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{g as t,p as n,rt as r}from"./index-CMtNDrNz.js";var i=e(r(),1),a=t();function o({color:e=[.85,.68,.22],opacity:t=.35,speed:r=8e-4,zIndex:o=0,position:s=`absolute`,className:c}){let l=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let t=l.current;if(!t)return;let n=null,i=!0,a={x:100,y:100,tX:100,tY:100},o={},s=t.getContext(`webgl`,{powerPreference:`low-power`,preserveDrawingBuffer:!1})||t.getContext(`experimental-webgl`);if(!s)return;function c(e,t,n){let r=e.createShader(n);return e.shaderSource(r,t),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)}let u=c(s,`
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `,s.VERTEX_SHADER),d=c(s,`
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 12; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }
      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 pVec = vUv - u_pointer_position;
        pVec.x *= u_ratio;
        float p = clamp(length(pVec), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        vec3 col = vec3(0.0);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        col = u_color * noise;
        gl_FragColor = vec4(col, noise);
      }
    `,s.FRAGMENT_SHADER);if(!u||!d)return;let f=s.createProgram();if(s.attachShader(f,u),s.attachShader(f,d),s.linkProgram(f),!s.getProgramParameter(f,s.LINK_STATUS))return;let p=s.getProgramParameter(f,s.ACTIVE_UNIFORMS);for(let e=0;e<p;e++){let t=s.getActiveUniform(f,e).name;o[t]=s.getUniformLocation(f,t)}let m=new Float32Array([-1,-1,1,-1,-1,1,1,1]),h=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,h),s.bufferData(s.ARRAY_BUFFER,m,s.STATIC_DRAW),s.useProgram(f);let g=s.getAttribLocation(f,`a_position`);s.enableVertexAttribArray(g),s.vertexAttribPointer(g,2,s.FLOAT,!1,0,0),s.uniform3f(o.u_color,e[0],e[1],e[2]),s.uniform1f(o.u_speed,r);let _=()=>{let e=t.parentElement,n=e?.clientWidth||window.innerWidth,r=e?.clientHeight||window.innerHeight,i=Math.min(window.devicePixelRatio||1,1.25);t.width=Math.round(n*i),t.height=Math.round(r*i),o.u_ratio&&s.uniform1f(o.u_ratio,t.width/(t.height||1)),s.viewport(0,0,t.width,t.height)};_(),window.addEventListener(`resize`,_);let v=new IntersectionObserver(([e])=>{i=e.isIntersecting},{threshold:.05});v.observe(t);let y=(e,n)=>{let r=t.getBoundingClientRect();r.width>0&&r.height>0&&(a.tX=e-r.left,a.tY=n-r.top)},b=e=>y(e.clientX,e.clientY),x=e=>{e.targetTouches[0]&&y(e.targetTouches[0].clientX,e.targetTouches[0].clientY)};window.addEventListener(`pointermove`,b,{passive:!0}),window.addEventListener(`mousemove`,b,{passive:!0}),window.addEventListener(`touchmove`,x,{passive:!0});let S=e=>{if(n=requestAnimationFrame(S),document.hidden||!i)return;a.x+=(a.tX-a.x)*.15,a.y+=(a.tY-a.y)*.15;let r=t.getBoundingClientRect(),c=r.width||window.innerWidth||1,l=r.height||window.innerHeight||1;s.uniform1f(o.u_time,e||performance.now()),s.uniform2f(o.u_pointer_position,a.x/c,1-a.y/l),s.drawArrays(s.TRIANGLE_STRIP,0,4)};return n=requestAnimationFrame(S),()=>{n&&cancelAnimationFrame(n),v.disconnect(),window.removeEventListener(`resize`,_),window.removeEventListener(`pointermove`,b),window.removeEventListener(`mousemove`,b),window.removeEventListener(`touchmove`,x),h&&s.deleteBuffer(h),u&&s.deleteShader(u),d&&s.deleteShader(d),f&&s.deleteProgram(f)}},[e,r]),(0,a.jsx)(`canvas`,{ref:l,className:n(`pointer-events-none`,c),style:{position:s,top:0,left:0,width:`100%`,height:`100%`,opacity:t,zIndex:o}})}var s=e=>Math.min(1,Math.max(0,e));function c(e,t,n,r){let i=t=>3*(1-t)*(1-t)*t*e+3*(1-t)*t*t*n+t*t*t,a=e=>3*(1-e)*(1-e)*e*t+3*(1-e)*e*e*r+e*e*e;return e=>{if(e<=0)return 0;if(e>=1)return 1;let t=0,n=1,r=e;for(let a=0;a<40;a++)r=(t+n)/2,i(r)<e?t=r:n=r;return a(r)}}var l={ink:[.7,0,.2,1],lusion:[.35,0,0,1],osmo:[.625,.05,0,1],"expo.out":[.16,1,.3,1],"power3.out":[.25,1,.5,1],"power2.inOut":[.65,0,.35,1]};function u(e){let t=String(e??``).trim();if(t===`linear`)return e=>e;let n=l[t];if(n)return c(...n);let r=t.match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);return r?c(+r[1],+r[2],+r[3],+r[4]):c(...l.ink)}var d={word:240,line:360,all:0},f=2400;function p(e,t){return t<=1?0:Math.max(0,Math.min(e,f/(t-1)))}function m(e,t,n){return e+p(t,n)*Math.max(0,n-1)}function h(e,t,n,r,i){let a=p(i,n),o=m(r,i,n);return s((s(e)*o-t*a)/Math.max(1,r))}var g=.9;function _(e){return+(e>=.9)}function v(e){let t=[],n=String(e??``).split(`
`);return n.forEach((e,r)=>{let i=e.split(/\s+/).filter(Boolean);i.forEach((e,a)=>{t.push({word:e,space:a<i.length-1,br:a===i.length-1&&r<n.length-1})})}),t}function y(e,t){let n=[],r=-1,i=-1/0;for(let a of e)a-i>t*.5&&(r++,i=a),n.push(Math.max(0,r));return n}function b(e,t,n,r,i){let a=t.length?Math.max(...t)+1:0,o=Array(a).fill(1/0),s=Array(a).fill(-1/0);e.forEach((e,n)=>{o[t[n]]=Math.min(o[t[n]],e[1]),s[t[n]]=Math.max(s[t[n]],e[3])});let c=(e,t)=>(e+t)/2,l=o.map((e,t)=>t===0?Math.max(0,e-n):Math.max(e-n,c(s[t-1],e))),u=s.map((e,t)=>t===a-1?Math.min(i,e+n):Math.min(e+n,c(e,o[t+1]))),d=e.map(()=>[0,0,0,0]);for(let i=0;i<a;i++){let a=e.map((e,t)=>t).filter(e=>t[e]===i).sort((t,n)=>e[t][0]-e[n][0]);a.forEach((t,o)=>{let s=e[t],f=o>0?e[a[o-1]]:null,p=o<a.length-1?e[a[o+1]]:null,m=f?c(f[2],s[0]):Math.max(0,s[0]-n),h=p?c(s[2],p[0]):Math.min(r,s[2]+n);d[t]=[m,l[i],h,u[i]]})}return d}function x(e,t){let n=e===`all`?t.map(()=>0):e===`line`?t.slice():t.map((e,t)=>t),r=n.length?Math.max(...n)+1:0;return r>64?n.map(e=>Math.floor(e*64/r)):n}function S(e,t){return t===`uppercase`?e.toUpperCase():t===`lowercase`?e.toLowerCase():t===`capitalize`?e.replace(/^\p{L}/u,e=>e.toUpperCase()):e}function C(e,t,n){return s((n-e)/Math.max(1,n*.5+t*.5))}function w(e,t,n,r){return t+(e-t)*Math.exp(-n*r)}var T={now:()=>performance.now(),raf:e=>requestAnimationFrame(e),caf:e=>cancelAnimationFrame(e)};function E(e,t=T){if(e.duration<=0)return e.onUpdate(e.to),e.onDone?.(),{cancel(){}};let n=t.now(),r=!1,i=0,a=o=>{if(r)return;let s=Math.min(1,Math.max(0,(o-n)/e.duration));e.onUpdate(s>=1?e.to:e.from+(e.to-e.from)*e.ease(s)),s>=1?(r=!0,e.onDone?.()):i=t.raf(a)};return i=t.raf(a),{cancel(){r=!0,t.caf(i)}}}function D(e){let t=e.trim(),n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let e=n[1].length===3?n[1].split(``).map(e=>e+e).join(``):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}return/^transparent$/i.test(t)?null:(n=t.match(/^rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?))?\s*\)/i),n?n[4]!==void 0&&Number(n[4])===0?null:[n[1]/255,n[2]/255,n[3]/255]:null)}var O=`#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,k=`#version 300 es
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
}`,A=[`uMask`,`uResolution`,`uUnits`,`uSpan`,`uTile`,`uFeather`,`uBleed`,`uNoiseScale`,`uEm`,`uLod`,`uHandoff`,`uInk`],j=class{canvas;gl=null;program=null;loc=new Map;textures=new Map;masks=new Map;redraws=new Map;lost=!1;ok=!1;constructor(){this.canvas=document.createElement(`canvas`),this.canvas.width=2,this.canvas.height=2,this.canvas.addEventListener(`webglcontextlost`,this.onLost),this.canvas.addEventListener(`webglcontextrestored`,this.onRestored),this.ok=this.init()}onLost=e=>{e.preventDefault(),this.lost=!0,this.ok=!1};onRestored=()=>{if(this.lost=!1,this.textures.clear(),this.ok=this.init(),this.ok){for(let[e,t]of this.masks)this.upload(e,t);for(let e of this.redraws.values())e()}};init(){let e=this.canvas.getContext(`webgl2`,{alpha:!0,antialias:!1,premultipliedAlpha:!0,preserveDrawingBuffer:!0,powerPreference:`low-power`});if(!e||e.isContextLost())return!1;let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:null},n=t(e.VERTEX_SHADER,O),r=t(e.FRAGMENT_SHADER,k);if(!n||!r)return!1;let i=e.createProgram();if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))return!1;e.useProgram(i),e.bindVertexArray(e.createVertexArray()),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let a=e.getAttribLocation(i,`aPos`);e.enableVertexAttribArray(a),e.vertexAttribPointer(a,2,e.FLOAT,!1,0,0),this.loc.clear();for(let t of A)this.loc.set(t,e.getUniformLocation(i,t));return e.uniform1i(this.loc.get(`uMask`),0),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),e.enable(e.SCISSOR_TEST),this.gl=e,this.program=i,!0}register(e,t){this.redraws.set(e,t)}upload(e,t){this.masks.set(e,t);let n=this.gl;if(!n||this.lost)return;let r=this.textures.get(e)??n.createTexture();n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,t),n.generateMipmap(n.TEXTURE_2D),this.textures.set(e,r)}forget(e){let t=this.textures.get(e);t&&this.gl&&!this.lost&&this.gl.deleteTexture(t),this.textures.delete(e),this.masks.delete(e),this.redraws.delete(e)}draw(e,t,n,r,i){let a=this.gl,o=this.textures.get(e);if(!a||!this.program||!this.ok||!o||n<1||r<1)return!1;(this.canvas.width<n||this.canvas.height<r)&&(this.canvas.width=Math.min(4096,Math.max(this.canvas.width,n)),this.canvas.height=Math.min(4096,Math.max(this.canvas.height,r)));let s=Math.min(n,this.canvas.width),c=Math.min(r,this.canvas.height),l=this.canvas.height-c;a.useProgram(this.program),a.viewport(0,l,s,c),a.scissor(0,l,s,c),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,o);let u=e=>this.loc.get(e);return a.uniform2f(u(`uResolution`),s,c),a.uniform1fv(u(`uUnits`),i.units),a.uniform2fv(u(`uSpan`),i.spans),a.uniform4fv(u(`uTile`),i.tiles),a.uniform1f(u(`uFeather`),i.feather),a.uniform1f(u(`uBleed`),i.bleed),a.uniform1f(u(`uNoiseScale`),i.noiseScale),a.uniform1f(u(`uEm`),i.em),a.uniform1f(u(`uLod`),i.lod),a.uniform1f(u(`uHandoff`),g),a.uniform3f(u(`uInk`),...i.ink),a.drawArrays(a.TRIANGLE_STRIP,0,4),t.clearRect(0,0,s,c),t.drawImage(this.canvas,0,0,s,c,0,0,s,c),!0}},M=null;function N(){return typeof document>`u`?null:(M||=new j,M.ok?M:null)}var P=1;function F(e){let t=D(e);if(t)return t;if(/^transparent$/i.test(e.trim())||/^rgba?\([^)]*[,/]\s*0\s*\)$/i.test(e.trim()))return null;try{let t=document.createElement(`canvas`);t.width=t.height=1;let n=t.getContext(`2d`);if(!n)return null;n.fillStyle=`#000`,n.fillStyle=e,n.fillRect(0,0,1,1);let r=n.getImageData(0,0,1,1).data;return r[3]===0?null:[r[0]/255,r[1]/255,r[2]/255]}catch{return null}}function I(e,t){return i.useSyncExternalStore(t=>{let n=window.matchMedia(e);return n.addEventListener(`change`,t),()=>n.removeEventListener(`change`,t)},()=>window.matchMedia(e).matches,()=>t)}var L=(...e)=>e.filter(Boolean).join(` `),R=`(prefers-reduced-motion: reduce)`,z=typeof window>`u`?i.useEffect:i.useLayoutEffect;function B({children:e,as:t=`h2`,trigger:n=`inView`,progress:r=0,by:o=`word`,duration:c=1800,stagger:l,ease:f=`linear`,bleed:p=.6,feather:g=.12,noiseScale:T=2.2,inkColor:D,once:O=!0,dprCap:k=2,className:A}){let j=i.useRef(null),M=i.useRef(null),B=I(R,!1),[V,H]=i.useState(!1),U=B||V,W=i.useMemo(()=>u(f),[f]),G=i.useMemo(()=>v(e),[e]),K=l??d[o],q=i.useRef({P:n===`manual`?s(r):0,units:[],n:0,tween:null,ready:!1,pending:!1,paint:()=>{},start:()=>{}}),J=i.useRef({E:W,duration:c,gap:K,bleed:p,feather:g,noiseScale:T,inkColor:D,by:o});J.current={E:W,duration:c,gap:K,bleed:p,feather:g,noiseScale:T,inkColor:D,by:o},z(()=>{let e=j.current;if(e&&!U){for(let t of e.querySelectorAll(`[data-ink-word]`))t.style.opacity=`0`;return()=>{for(let t of e.querySelectorAll(`[data-ink-word]`))t.style.opacity=``}}},[U,G]);let Y=i.useCallback(e=>{let t=q.current;t.tween?.cancel();let n=J.current,r=m(n.duration,n.gap,Math.max(1,t.n))*Math.abs(e-t.P)*(e<t.P?.6:1);t.tween=E({from:t.P,to:e,duration:r,ease:e=>e,onUpdate:e=>{t.P=e,t.paint()},onDone:()=>{t.tween=null}})},[]);return i.useEffect(()=>{if(U||window.matchMedia(R).matches)return;let e=N(),t=j.current,n=M.current,r=n?.getContext(`2d`);if(!e||!t||!n||!r){H(!0);return}let i=P++,a=q.current,o=[...t.querySelectorAll(`[data-ink-word]`)],c=document.createElement(`canvas`),l=0,u=0,d=16,f=0,p=[.1,.1,.1],m=new Float32Array(64),g=new Float32Array(128),v=new Float32Array(256),C=1,w=!1,T=()=>{let e=J.current;p=e.inkColor&&F(e.inkColor)||F(getComputedStyle(t).color)||[.1,.1,.1]},E=()=>{if(w)return;let r=getComputedStyle(t);d=parseFloat(r.fontSize)||16,f=Math.ceil(d*.35);let s=t.getBoundingClientRect();C=Math.min(window.devicePixelRatio||1,k);let p=Math.floor((s.left-f)*C)/C,m=Math.floor((s.top-f)*C)/C;l=Math.max(1,Math.min(4096,Math.ceil((s.right+f)*C-p*C))),u=Math.max(1,Math.min(4096,Math.ceil((s.bottom+f)*C-m*C)));let h=l/C,_=u/C;n.style.left=`${p-s.left}px`,n.style.top=`${m-s.top}px`,n.style.width=`${h}px`,n.style.height=`${_}px`,n.width=l,n.height=u,c.width=l,c.height=u;let T=c.getContext(`2d`);if(!T)return;let E=o.map(e=>e.getBoundingClientRect()),D=parseFloat(r.lineHeight)||d*1.2,O=y(E.map(e=>e.top),D);a.units=x(J.current.by,O),a.n=a.units.length?Math.max(...a.units)+1:0;let A=d*.3;T.setTransform(1,0,0,1,0,0),T.globalCompositeOperation=`source-over`,T.fillStyle=`rgb(0,0,0)`,T.fillRect(0,0,l,u);let j=b(E.map(e=>[e.left-p,e.top-m,e.right-p,e.bottom-m]),O,A,h,_);g.fill(0);for(let e=0;e<64;e++)g[e*2]=1;v.fill(0);for(let e=0;e<64;e++)v[e*4]=1/0,v[e*4+1]=1/0,v[e*4+2]=-1/0,v[e*4+3]=-1/0;j.forEach(([e,t,n,r],i)=>{let o=a.units[i]??0,s=Math.round(e*C),c=Math.round(t*C),l=Math.round(n*C),d=Math.round(r*C);T.fillStyle=`rgb(0,${o+1},0)`,T.fillRect(s,c,l-s,d-c),v[o*4]=Math.min(v[o*4],s),v[o*4+1]=Math.min(v[o*4+1],u-d),v[o*4+2]=Math.max(v[o*4+2],l),v[o*4+3]=Math.max(v[o*4+3],u-c);let f=E[i];g[o*2]=Math.min(g[o*2],(f.left-p)/h),g[o*2+1]=Math.max(g[o*2+1],(f.right-p)/h)}),T.setTransform(1,0,0,1,0,0),T.globalCompositeOperation=`lighter`,T.fillStyle=`rgb(255,0,0)`,T.font=`${r.fontStyle} ${r.fontWeight} ${parseFloat(r.fontSize)*C}px ${r.fontFamily}`;let M=r.letterSpacing;`letterSpacing`in T&&(T.letterSpacing=M===`normal`?`0px`:`${parseFloat(M)*C}px`),T.fontKerning=`normal`,T.textBaseline=`alphabetic`;let N=o.map(e=>{let t=document.createElement(`span`);return t.style.cssText=`display:inline-block;width:0;height:0;vertical-align:baseline`,e.appendChild(t),t}),P=N.map(e=>e.getBoundingClientRect().top);N.forEach(e=>e.remove()),o.forEach((e,t)=>{let n=E[t],i=S(e.textContent??``,r.textTransform);T.fillText(i,(n.left-p)*C,Math.round(P[t]*C)-m*C)}),T.setTransform(1,0,0,1,0,0),e.upload(i,c),a.ready=!0,a.paint()};a.paint=()=>{t.style.setProperty(`--ink-headline`,String(a.P));let c=J.current,f=!1,y=!0;for(let e=0;e<64;e++)m[e]=0;let b=Math.max(1,a.n),x=[];for(let e=0;e<b;e++){let t=h(a.P,e,b,c.duration,c.gap),n=t>=1?1:c.E(t);x.push(n),m[e]=n,n>0&&n<.9&&(f=!0),n<.9&&(y=!1)}o.forEach((e,t)=>{e.style.opacity=String(_(x[a.units[t]??0]??0))}),n.style.visibility=y?`hidden`:`visible`,a.ready&&l&&u&&(f?e.draw(i,r,l,u,{units:m,spans:g,tiles:v,feather:c.feather,bleed:s(c.bleed),noiseScale:c.noiseScale,em:d*C,lod:Math.max(0,Math.log2(Math.max(1,d*C*.12))),ink:p}):r.clearRect(0,0,l,u))},e.register(i,()=>a.paint()),T(),a.paint();let D=0,O=()=>{cancelAnimationFrame(D),D=requestAnimationFrame(E)},A=getComputedStyle(t),I=`${A.fontStyle} ${A.fontWeight} ${A.fontSize} ${A.fontFamily}`;Promise.all([document.fonts?.ready,document.fonts?.load(I).catch(()=>[])]).then(()=>{if(E(),a.pending){let e=t.getBoundingClientRect();e.top<window.innerHeight&&e.bottom>0&&(a.pending=!1,a.start())}}),document.fonts?.addEventListener?.(`loadingdone`,O);let L=new ResizeObserver(O);L.observe(t);let z=()=>{T(),a.paint()},B=new MutationObserver(z);B.observe(document.documentElement,{attributes:!0,attributeFilter:[`class`,`data-theme`,`style`]});let V=window.matchMedia(`(prefers-color-scheme: dark)`);return V.addEventListener(`change`,z),()=>{w=!0,a.tween?.cancel(),a.tween=null,a.ready=!1,a.paint=()=>{},cancelAnimationFrame(D),document.fonts?.removeEventListener?.(`loadingdone`,O),L.disconnect(),B.disconnect(),V.removeEventListener(`change`,z),e.forget(i)}},[U,k,G,o]),i.useEffect(()=>{if(U||n!==`inView`)return;let e=j.current;if(!e)return;let t=q.current;t.start=()=>Y(1);let r=new IntersectionObserver(([e])=>{if(!e)return;let n=e.boundingClientRect,i=n.top<window.innerHeight&&n.bottom>0;e.isIntersecting&&i?(t.ready?t.start():t.pending=!0,O&&r.disconnect()):O||(t.pending=!1,Y(0))},{threshold:[.15,.35]});return r.observe(e),()=>{r.disconnect(),t.pending=!1,t.start=()=>{}}},[U,n,O,Y,G]),i.useEffect(()=>{if(U||n!==`scroll`)return;let e=j.current;if(!e)return;let t=q.current;t.tween?.cancel(),t.tween=null;let r=0,i=0,a=n=>{r=0;let o=i?Math.min(.05,(n-i)/1e3):1/60;i=n;let s=e.getBoundingClientRect(),c=C(s.top,s.height,window.innerHeight);t.P=w(t.P,c,12,o),Math.abs(t.P-c)<5e-4&&(t.P=c),t.paint(),t.P===c?i=0:r=requestAnimationFrame(a)},o=()=>{r||=requestAnimationFrame(a)};return window.addEventListener(`scroll`,o,{passive:!0}),window.addEventListener(`resize`,o),o(),()=>{cancelAnimationFrame(r),window.removeEventListener(`scroll`,o),window.removeEventListener(`resize`,o)}},[U,n]),i.useEffect(()=>{if(U||n!==`manual`)return;let e=q.current;e.tween?.cancel(),e.tween=null,e.P=s(r),e.paint()},[U,n,r]),i.createElement(t,{ref:j,"data-ink-headline":``,"data-trigger":n,className:L(`relative`,A)},G.map((e,t)=>(0,a.jsxs)(i.Fragment,{children:[(0,a.jsx)(`span`,{"data-ink-word":``,children:e.word}),e.space||e.br?` `:null,e.br?(0,a.jsx)(`br`,{}):null]},t)),U?null:(0,a.jsx)(`canvas`,{ref:M,"aria-hidden":`true`,className:`pointer-events-none absolute left-0 top-0 block`}))}export{o as n,B as t};