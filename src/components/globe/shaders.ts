// Shaders extraits du prototype (GLSL)

export const vsBase = `varying vec3 vN;
varying vec3 vObj;
void main() {
  vN = normalize(normalMatrix * normal);
  vObj = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const fsBase = `uniform float uScan;
varying vec3 vN;
varying vec3 vObj;
void main() {
  vec3 n = normalize(vN);
  float fr = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.4);
  vec3 p = normalize(vObj);
  float lat = asin(clamp(p.y, -1.0, 1.0));
  float lon = atan(p.z, p.x);
  float g1 = 1.0 - smoothstep(0.0, 0.035, abs(fract(lat / 0.2618 + 0.5) - 0.5));
  float g2 = 1.0 - smoothstep(0.0, 0.035, abs(fract(lon / 0.2618 + 0.5) - 0.5));
  float grid = max(g1, g2) * (0.35 + 0.65 * fr);
  float d = (lat - uScan) * 10.0;
  float sc = exp(-d * d);
  vec3 deep = vec3(0.010, 0.075, 0.075);
  vec3 mid = vec3(0.020, 0.150, 0.150);
  vec3 col = mix(deep, mid, 0.5 + 0.5 * p.y);
  col += fr * vec3(0.14, 0.67, 0.71);
  col += grid * vec3(0.14, 0.67, 0.71) * 0.5;
  col += sc * vec3(0.65, 1.00, 0.51) * 0.35;
  float lt = max(0.0, dot(n, normalize(vec3(0.6, 0.5, 0.6))));
  col += pow(lt, 3.0) * vec3(0.11, 0.56, 0.43) * 0.45;
  gl_FragColor = vec4(col, 1.0);
}`;

export const vsAtmo = `varying vec3 vN;
void main() {
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const fsAtmo = `varying vec3 vN;
void main() {
  float i = pow(max(0.72 - dot(vN, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
  float sun = max(dot(vN, normalize(vec3(0.6, 0.5, 0.6))), 0.0);
  vec3 low = vec3(0.11, 0.56, 0.43);
  vec3 high = vec3(0.14, 0.67, 0.71);
  vec3 c = mix(low, high, clamp(0.5 + 0.7 * vN.y, 0.0, 1.0));
  c = mix(c, vec3(0.65, 1.00, 0.51), sun * 0.55);
  float k = i * (0.55 + 0.6 * sun);
  gl_FragColor = vec4(c * k, k);
}`;

export const vsDots = `attribute vec3 aCol;
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform float uPx;
uniform float uScan;
uniform float uAlpha;
uniform float uNight;
varying vec3 vCol;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vec3 nv = normalize(normalMatrix * position);
  float day = smoothstep(-0.3, 0.4, dot(nv, normalize(vec3(0.6, 0.5, 0.6))));
  float nightK = uNight * (1.0 - day);
  float lat = asin(clamp(position.y / length(position), -1.0, 1.0));
  float d = (lat - uScan) * 8.0;
  float scan = exp(-d * d);
  float tw = 0.7 + 0.3 * sin(uTime * 1.8 + aSeed * 37.0);
  vCol = aCol * (0.85 + 1.4 * scan) * (1.0 - 0.5 * nightK);
  // lumières de villes : les points « chauds » virent à l'ambre côté nuit
  float lights = step(1.8, aSize) * nightK;
  vCol = mix(vCol, vec3(1.0, 0.72, 0.28) * 1.4, lights);
  vA = uAlpha * tw * (0.85 + 0.9 * scan);
  gl_PointSize = uPx * aSize * (1.0 + 0.9 * scan) * (3.5 / -mv.z);
}`;

export const fsDots = `varying vec3 vCol;
varying float vA;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vCol, a * vA);
}`;

export const vsSprite = `uniform float uPx;
uniform float uSize;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * uSize * (3.5 / -mv.z);
}`;

export const fsSprite = `uniform vec3 uColor;
uniform float uAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
  if (d > 1.0) discard;
  float core = smoothstep(0.35, 0.0, d);
  float halo = pow(1.0 - d, 2.2);
  vec3 c = mix(uColor, vec3(1.0), core * 0.8);
  gl_FragColor = vec4(c, (halo * 0.9 + core) * uAlpha);
}`;

export const vsArc = `varying float vT;
void main() {
  vT = uv.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const fsArc = `uniform float uTime;
uniform float uOff;
uniform float uGrow;
uniform vec3 uA;
uniform vec3 uB;
varying float vT;
void main() {
  if (vT > uGrow) discard;
  float head = fract(uTime * 0.16 + uOff);
  float x = fract(head - vT);
  float pulse = exp(-x * 10.0);
  vec3 c = mix(uA, uB, vT);
  float k = 0.28 + 1.6 * pulse;
  gl_FragColor = vec4(c * k, 0.35 + 0.65 * pulse);
}`;
