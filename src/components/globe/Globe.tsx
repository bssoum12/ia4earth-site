"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as S from "./shaders";
import { MASK_B64, MASK_H, MASK_W } from "./landMask";

/**
 * Globe 3D plein écran : continents en points, arcs « réseau IA », balise sur Tunis.
 * Port fidèle du prototype. `onFail` est appelé si WebGL est indisponible (globe de repli CSS).
 */
export default function Globe({ onFail }: { onFail: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const tag = tagRef.current;
    if (!cv || !tag) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    } catch {
      onFail();
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const D2R = Math.PI / 180;
    const V3 = THREE.Vector3;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const small = Math.min(W, H) < 600; // mobile : moins de points
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 200);
    const globe = new THREE.Group();
    scene.add(globe);

    const disposables: Array<{ dispose(): void }> = [];
    const track = <T extends { dispose(): void }>(o: T): T => (disposables.push(o), o);

    const U = { uTime: { value: 0 }, uScan: { value: 0 }, uPx: { value: 3 } };
    const smat = (vs: string, fs: string, uniforms: Record<string, THREE.IUniform>, extra?: Partial<THREE.ShaderMaterialParameters>) =>
      track(new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms, ...extra }));
    const ADD = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false };

    function ll(lat: number, lon: number, r: number) {
      const phi = (90 - lat) * D2R;
      const th = (lon + 180) * D2R;
      return new V3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
    }

    /* Terres : masque binaire 720 x 360 */
    const bin = atob(MASK_B64);
    const mask = new Uint8Array(bin.length);
    for (let bi = 0; bi < bin.length; bi++) mask[bi] = bin.charCodeAt(bi);
    function isLand(lat: number, lon: number) {
      let x = Math.floor(((lon + 180) / 360) * MASK_W);
      let y = Math.floor(((90 - lat) / 180) * MASK_H);
      x = Math.max(0, Math.min(MASK_W - 1, x));
      y = Math.max(0, Math.min(MASK_H - 1, y));
      const i = y * MASK_W + x;
      return (mask[i >> 3] >> (7 - (i & 7))) & 1;
    }

    /* Sphère, atmosphère */
    const base = new THREE.Mesh(track(new THREE.SphereGeometry(1, 96, 64)), smat(S.vsBase, S.fsBase, { uScan: U.uScan }));
    globe.add(base);
    const atmo = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.17, 64, 48)),
      smat(S.vsAtmo, S.fsAtmo, {}, { side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    globe.add(atmo);

    /* Points : continents et grille océanique */
    function ptsGeo(p: number[], c: number[], s: number[], z: number[]) {
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
      g.setAttribute("aCol", new THREE.Float32BufferAttribute(c, 3));
      g.setAttribute("aSeed", new THREE.Float32BufferAttribute(s, 1));
      g.setAttribute("aSize", new THREE.Float32BufferAttribute(z, 1));
      return g;
    }
    const lp: number[] = [], lc: number[] = [], ls: number[] = [], lz: number[] = [];
    const op: number[] = [], oc: number[] = [], os: number[] = [], oz: number[] = [];
    const NP = small ? 18000 : 40000;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const seaStep = small ? 3 : 5;
    for (let i = 0; i < NP; i++) {
      const y = 1 - (2 * (i + 0.5)) / NP;
      const rr = Math.sqrt(1 - y * y);
      const a = GA * i;
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr;
      const lat = Math.asin(y) / D2R;
      let th = Math.atan2(z, -x);
      if (th < 0) th += 2 * Math.PI;
      const lon = th / D2R - 180;
      if (isLand(lat, lon)) {
        const t = 0.5 + 0.5 * Math.sin(lon * 0.045 + lat * 0.07);
        const hot = Math.random() > 0.972;
        const br = hot ? 1.0 : 0.55 + 0.45 * Math.random();
        const cr = hot ? 0.95 : 0.35 * (1 - t) + 0.12 * t;
        const cg = hot ? 1.0 : 1.0 * (1 - t) + 0.85 * t;
        const cb = hot ? 0.45 : 0.25 * (1 - t) + 0.55 * t;
        lp.push(x * 1.003, y * 1.003, z * 1.003);
        lc.push(cr * br, cg * br, cb * br);
        ls.push(Math.random());
        lz.push(hot ? 1.9 : 0.95 + 0.25 * Math.random());
      } else if (i % seaStep === 0) {
        op.push(x * 1.002, y * 1.002, z * 1.002);
        oc.push(0.06, 0.38, 0.45);
        os.push(Math.random());
        oz.push(0.55);
      }
    }
    const landMat = smat(S.vsDots, S.fsDots, { uTime: U.uTime, uScan: U.uScan, uPx: U.uPx, uAlpha: { value: 1 }, uNight: { value: 1 } }, ADD);
    const seaMat = smat(S.vsDots, S.fsDots, { uTime: U.uTime, uScan: U.uScan, uPx: U.uPx, uAlpha: { value: 0.5 }, uNight: { value: 1 } }, ADD);
    globe.add(new THREE.Points(ptsGeo(op, oc, os, oz), seaMat));
    globe.add(new THREE.Points(ptsGeo(lp, lc, ls, lz), landMat));

    /* Voile de nuages et lucioles : une planète vivante */
    const cloudP: number[] = [], cloudC: number[] = [], cloudS: number[] = [], cloudZ: number[] = [];
    for (let cI = 0; cI < 9000; cI++) {
      const cy = 1 - 2 * Math.random();
      const cr2 = Math.sqrt(1 - cy * cy);
      const ca = Math.random() * 6.2832;
      const cxx = Math.cos(ca) * cr2;
      const czz = Math.sin(ca) * cr2;
      const n = Math.sin(cxx * 5.1 + cy * 3.3) * Math.sin(czz * 4.7 - cy * 2.1) + Math.sin(cxx * 11 + czz * 9) * 0.35;
      if (n < 0.42) continue;
      cloudP.push(cxx * 1.035, cy * 1.035, czz * 1.035);
      cloudC.push(0.75, 1.0, 0.9);
      cloudS.push(Math.random());
      cloudZ.push(0.9);
    }
    const clouds = new THREE.Points(
      ptsGeo(cloudP, cloudC, cloudS, cloudZ),
      smat(S.vsDots, S.fsDots, { uTime: U.uTime, uScan: { value: -9 }, uPx: U.uPx, uAlpha: { value: 0.32 }, uNight: { value: 1 } }, ADD),
    );
    globe.add(clouds);
    const ffP: number[] = [], ffC: number[] = [], ffS: number[] = [], ffZ: number[] = [];
    for (let fI = 0; fI < 260; fI++) {
      const fv = new V3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .normalize()
        .multiplyScalar(1.12 + Math.random() * 0.9);
      ffP.push(fv.x, fv.y, fv.z);
      ffC.push(0.7, 1.0, 0.3);
      ffS.push(Math.random());
      ffZ.push(1.6 + Math.random());
    }
    scene.add(
      new THREE.Points(
        ptsGeo(ffP, ffC, ffS, ffZ),
        smat(S.vsDots, S.fsDots, { uTime: U.uTime, uScan: { value: -9 }, uPx: U.uPx, uAlpha: { value: 0.9 }, uNight: { value: 0 } }, ADD),
      ),
    );

    /* Anneau de balayage IA */
    const scanRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(1, 0.003, 6, 180)),
      track(new THREE.MeshBasicMaterial({ color: 0x6dff8a, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    scanRing.rotation.x = Math.PI / 2;
    globe.add(scanRing);

    /* Sprites lumineux */
    type SpriteUniforms = { uAlpha: THREE.IUniform; uSize: THREE.IUniform };
    function sprite(color: number, size: number, alpha: number) {
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));
      const u = { uPx: U.uPx, uSize: { value: size }, uColor: { value: new THREE.Color(color) }, uAlpha: { value: alpha } };
      const p = new THREE.Points(g, smat(S.vsSprite, S.fsSprite, u, ADD));
      p.frustumCulled = false;
      p.userData.u = u as SpriteUniforms;
      return p;
    }

    /* Tunis */
    const TUNIS: [number, number] = [36.8065, 10.1815];
    const Pn = ll(TUNIS[0], TUNIS[1], 1).normalize();
    const beacon = sprite(0xffb938, 46, 0);
    beacon.position.copy(Pn).multiplyScalar(1.006);
    globe.add(beacon);

    const ripples: THREE.Mesh[] = [];
    const ripGeo = track(new THREE.RingGeometry(0.018, 0.022, 64));
    for (let r = 0; r < 3; r++) {
      const rg = new THREE.Mesh(
        ripGeo,
        track(new THREE.MeshBasicMaterial({ color: 0xffb938, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })),
      );
      rg.position.copy(Pn).multiplyScalar(1.004);
      rg.quaternion.setFromUnitVectors(new V3(0, 0, 1), Pn);
      globe.add(rg);
      ripples.push(rg);
    }

    const gc = document.createElement("canvas");
    gc.width = 4;
    gc.height = 128;
    const gx = gc.getContext("2d")!;
    const gg = gx.createLinearGradient(0, 0, 0, 128);
    gg.addColorStop(0, "rgba(255,225,150,0)");
    gg.addColorStop(1, "rgba(255,185,56,1)");
    gx.fillStyle = gg;
    gx.fillRect(0, 0, 4, 128);
    const beam = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.006, 0.015, 0.6, 12, 1, true)),
      track(new THREE.MeshBasicMaterial({ map: track(new THREE.CanvasTexture(gc)), transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    beam.position.copy(Pn).multiplyScalar(1.304);
    beam.quaternion.setFromUnitVectors(new V3(0, 1, 0), Pn);
    globe.add(beam);

    const beaconTop = new THREE.Mesh(
      track(new THREE.OctahedronGeometry(0.035)),
      track(new THREE.MeshBasicMaterial({ color: 0xffe08a, wireframe: true, transparent: true, opacity: 0.95 })),
    );
    beaconTop.position.copy(Pn).multiplyScalar(1.62);
    globe.add(beaconTop);

    /* Réseau : arcs depuis Tunis */
    const CITIES: [string, number, number][] = [
      ["Paris", 48.86, 2.35], ["Madrid", 40.42, -3.7], ["Rome", 41.9, 12.5], ["Istanbul", 41.01, 28.98],
      ["Casablanca", 33.57, -7.59], ["Le Caire", 30.04, 31.24], ["Dakar", 14.69, -17.45], ["Lagos", 6.52, 3.38],
      ["Nairobi", -1.29, 36.82], ["Johannesburg", -26.2, 28.05], ["Dubaï", 25.2, 55.27], ["Riyad", 24.7, 46.7],
      ["Bruxelles", 50.85, 4.35], ["Addis-Abeba", 9.03, 38.75], ["Londres", 51.5, -0.12],
    ];
    const cityVecs: THREE.Vector3[] = [];
    function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number) {
      const ang = a.angleTo(b);
      if (ang < 1e-4) return a.clone();
      const s = Math.sin(ang);
      return a.clone().multiplyScalar(Math.sin((1 - t) * ang) / s).add(b.clone().multiplyScalar(Math.sin(t * ang) / s));
    }
    const PAL: [THREE.Color, THREE.Color][] = [
      [new THREE.Color(0.8, 1.0, 0.25), new THREE.Color(0.15, 0.95, 0.85)],
      [new THREE.Color(0.3, 1.0, 0.55), new THREE.Color(0.15, 0.8, 1.0)],
      [new THREE.Color(1.0, 0.85, 0.3), new THREE.Color(0.35, 1.0, 0.55)],
    ];
    const arcs: { u: Record<string, THREE.IUniform>; i: number }[] = [];
    const cp: number[] = [], cc: number[] = [], cs2: number[] = [], cz: number[] = [];
    for (let c = 0; c < CITIES.length; c++) {
      const cv3 = ll(CITIES[c][1], CITIES[c][2], 1).normalize();
      cityVecs.push(cv3);
      const ang = Pn.angleTo(cv3);
      const h = 0.06 + (0.32 * ang) / Math.PI;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= 40; s++) {
        const tt = s / 40;
        pts.push(slerp(Pn, cv3, tt).multiplyScalar(1.004 + h * Math.sin(Math.PI * tt)));
      }
      const pal = PAL[c % 3];
      const u = {
        uTime: U.uTime,
        uOff: { value: c * 0.137 },
        uGrow: { value: 0 },
        uA: { value: new V3(pal[0].r, pal[0].g, pal[0].b) },
        uB: { value: new V3(pal[1].r, pal[1].g, pal[1].b) },
      };
      const tube = new THREE.Mesh(
        track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.0032, 5, false)),
        smat(S.vsArc, S.fsArc, u, ADD),
      );
      globe.add(tube);
      arcs.push({ u, i: c });
      cp.push(cv3.x * 1.005, cv3.y * 1.005, cv3.z * 1.005);
      cc.push(pal[1].r, pal[1].g, pal[1].b);
      cs2.push(Math.random());
      cz.push(2.2);
    }
    const cityAlpha = { value: 0 };
    globe.add(
      new THREE.Points(
        ptsGeo(cp, cc, cs2, cz),
        smat(S.vsDots, S.fsDots, { uTime: U.uTime, uScan: { value: -9 }, uPx: U.uPx, uAlpha: cityAlpha, uNight: { value: 0 } }, ADD),
      ),
    );

    /* Anneaux orbitaux et satellites */
    const orbits: { sats: THREE.Object3D[]; speed: number }[] = [];
    function addOrbit(R: number, color: number, op2: number, rx: number, rz: number, nSat: number, speed: number) {
      const g = new THREE.Group();
      g.rotation.set(rx, 0, rz);
      g.add(
        new THREE.Mesh(
          track(new THREE.TorusGeometry(R, 0.0022, 6, 220)),
          track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op2, blending: THREE.AdditiveBlending, depthWrite: false })),
        ),
      );
      const sats: THREE.Object3D[] = [];
      for (let n = 0; n < nSat; n++) {
        const pv = new THREE.Object3D();
        pv.rotation.z = (n * 2 * Math.PI) / nSat;
        const sp = sprite(color, 15, 1);
        sp.position.set(R, 0, 0);
        pv.add(sp);
        g.add(pv);
        sats.push(pv);
      }
      globe.add(g);
      orbits.push({ sats, speed });
    }
    addOrbit(1.42, 0x6dff8a, 0.4, 1.25, 0.35, 3, 0.35);
    addOrbit(1.62, 0x2de8d0, 0.36, 0.35, -0.6, 2, -0.26);
    addOrbit(1.82, 0xc8ff5a, 0.3, 1.9, 0.1, 2, 0.18);

    /* Étoiles */
    const sp2: number[] = [];
    for (let q = 0; q < 1800; q++) {
      const v = new V3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .normalize()
        .multiplyScalar(32 + Math.random() * 40);
      sp2.push(v.x, v.y, v.z);
    }
    const sg = track(new THREE.BufferGeometry());
    sg.setAttribute("position", new THREE.Float32BufferAttribute(sp2, 3));
    const stars = new THREE.Points(
      sg,
      track(new THREE.PointsMaterial({ size: 0.09, color: 0xc8ffe0, transparent: true, opacity: 0.7, depthWrite: false })),
    );
    scene.add(stars);

    /* Orientation : Tunis face caméra */
    const PSI = -Math.atan2(Pn.x, Pn.z);
    const TILT = TUNIS[0] * D2R * 0.78;
    let L = { x: 0.8, y: 0.02, z: 3.55 };
    function layout() {
      const asp = W / H;
      if (asp > 1.25) L = { x: 0.8, y: 0.02, z: 3.55 };
      else if (asp > 0.75) L = { x: 0, y: 0.22, z: 4.5 };
      else L = { x: 0, y: 0.95, z: 6.4 }; // mobile : globe plus loin et en haut, le texte reste lisible
      U.uPx.value = dpr * Math.min(1.5, Math.max(0.65, H / 900)) * 3.1;
    }
    layout();

    let mx = 0, my = 0, pxs = 0, pys = 0;
    let cursorX = -9999, cursorY = -9999;
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / W - 0.5) * 2;
      my = (e.clientY / H - 0.5) * 2;
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* Rotation à la main (glisser) avec inertie ; « Revenir sur Tunis » ramène l'orientation */
    let userYaw = 0, userPitch = 0, velYaw = 0, velPitch = 0;
    let dragging = false, resetting = false, lastX = 0, lastY = 0;
    const dragEl = document.getElementById("globe-drag");
    const resetBtn = resetRef.current;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      resetting = false;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = velPitch = 0;
      dragEl?.setPointerCapture(e.pointerId);
      dragEl?.classList.add("is-drag");
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = dx * 0.006;
      velPitch = dy * 0.004;
      userYaw += velYaw;
      userPitch = Math.max(-0.7, Math.min(0.7, userPitch + velPitch));
      if (reduce) render(performance.now());
    };
    const onUp = () => {
      dragging = false;
      dragEl?.classList.remove("is-drag");
    };
    const onReset = () => {
      userYaw = ((((userYaw + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
      resetting = true;
      if (reduce) {
        userYaw = userPitch = 0;
        render(performance.now());
      }
    };
    dragEl?.addEventListener("pointerdown", onDown);
    dragEl?.addEventListener("pointermove", onMove);
    dragEl?.addEventListener("pointerup", onUp);
    dragEl?.addEventListener("pointercancel", onUp);
    resetBtn?.addEventListener("click", onReset);

    /* Étiquettes des villes du réseau (desktop) */
    const labelHost = labelsRef.current;
    const labels: HTMLElement[] = [];
    if (labelHost && !small) {
      CITIES.forEach(([name]) => {
        const el = document.createElement("span");
        el.className = "city-label";
        el.textContent = name;
        labelHost.appendChild(el);
        labels.push(el);
      });
    }

    /* Poses du globe selon la section visible (desktop : le globe change de côté) */
    const POSES: Record<string, { x: number; y: number; s: number; o: number }> = {
      top: { x: 1, y: 1, s: 1, o: 1 },
      salon: { x: -1.25, y: -0.1, s: 0.62, o: 0.4 },
      panels: { x: 1.3, y: 0, s: 0.6, o: 0.3 },
      programme: { x: -1.3, y: 0, s: 0.6, o: 0.3 },
      concours: { x: 1.3, y: 0, s: 0.6, o: 0.32 },
      organisation: { x: -1.3, y: 0, s: 0.55, o: 0.24 },
      inscription: { x: 0.9, y: 0, s: 0.55, o: 0.3 },
    };
    const POSE_IDS = Object.keys(POSES);
    const pose = { x: 1, y: 1, s: 1, o: 1 };
    const smooth = (a: number, b: number, v: number) => {
      const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    function updatePose() {
      const mid = H * 0.62;
      const tops = POSE_IDS.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? 1e9);
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= mid) i = k;
      const ida = POSE_IDS[i];
      const idb = POSE_IDS[Math.min(i + 1, POSE_IDS.length - 1)];
      const a = POSES[ida];
      const b = POSES[idb];
      const wide = W / H > 1.25;
      // « top » reprend la mise en page du hero ; les autres sections décalent le globe sur les côtés (écrans larges)
      const ax = ida === "top" ? L.x : wide ? a.x : 0;
      const bx = idb === "top" ? L.x : wide ? b.x : 0;
      const ay = ida === "top" ? L.y : a.y;
      const by = idb === "top" ? L.y : b.y;
      const span = (tops[Math.min(i + 1, tops.length - 1)] ?? 0) - tops[i];
      const t = i === POSE_IDS.length - 1 || span <= 0 ? 0 : smooth(0.55, 1, (mid - tops[i]) / span);
      pose.x = ax + (bx - ax) * t;
      pose.y = ay + (by - ay) * t;
      pose.s = a.s + (b.s - a.s) * t;
      pose.o = a.o + (b.o - a.o) * t;
    }

    const vTop = new V3(), vN = new V3(), vC = new V3();
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const t0 = performance.now();
    let prev = t0;
    let running = false;
    let raf = 0;

    function render(now: number) {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const docH = Math.max(1, document.documentElement.scrollHeight - H);
      const sy = window.pageYOffset || 0;
      const sp = reduce ? 0 : clamp(sy / docH, 0, 1);
      let sc = reduce ? 0 : clamp(sy / (H * 0.9), 0, 1);
      sc = sc * sc * (3 - 2 * sc);

      const intro = reduce ? 1 : Math.min(1, t / 3.6);
      const k = 1 - Math.pow(1 - intro, 3);
      U.uTime.value = reduce ? 1.3 : t;
      // intro : un balayage lumineux traverse la Terre du sud au nord, puis le rythme normal reprend
      U.uScan.value = reduce ? 0.35 : intro < 1 ? -1.5 + 2.5 * k : Math.sin(t * 0.32) * 1.1;

      // rotation manuelle : inertie après le glisser, retour progressif sur Tunis
      if (!dragging) {
        const f = Math.pow(0.94, dt * 60);
        userYaw += velYaw;
        userPitch = clamp(userPitch + velPitch, -0.7, 0.7);
        velYaw *= f;
        velPitch *= f;
        if (resetting) {
          const e = Math.min(1, dt * 4);
          userYaw -= userYaw * e;
          userPitch -= userPitch * e;
          velYaw = velPitch = 0;
          if (Math.abs(userYaw) + Math.abs(userPitch) < 0.01) {
            userYaw = userPitch = 0;
            resetting = false;
          }
        }
      }

      if (reduce) {
        pose.x = L.x; pose.y = L.y; pose.s = 1; pose.o = 1;
      } else {
        updatePose();
      }
      if (W / H < 0.9) pose.o *= 0.85; // portrait : globe plus discret derrière le texte

      const psi = PSI + (1 - k) * 2.8 + userYaw + (reduce ? 0 : Math.sin(t * 0.25) * 0.09 + Math.sin(sp * Math.PI) * 1.4);
      globe.rotation.set(TILT + userPitch + (reduce ? 0 : Math.sin(t * 0.19) * 0.025), psi, 0);
      globe.position.set(pose.x, pose.y, 0);
      globe.scale.setScalar(pose.s);

      pxs += (mx - pxs) * 0.05;
      pys += (my - pys) * 0.05;
      camera.position.set(reduce ? 0 : pxs * 0.18, reduce ? 0 : -pys * 0.12, L.z * (1 + 0.12 * sc) + (1 - k) * 2.2);
      camera.lookAt(0, 0, 0);

      const sl = U.uScan.value;
      scanRing.position.y = Math.sin(sl) * 1.006;
      const rs = Math.cos(sl) * 1.006;
      scanRing.scale.set(rs, rs, 1);

      const bk = reduce ? 1 : clamp((t - 1.8) / 1.2, 0, 1);
      const bu = beacon.userData.u as SpriteUniforms;
      bu.uAlpha.value = bk;
      bu.uSize.value = 46 * (1 + (reduce ? 0 : 0.12 * Math.sin(t * 3)));
      (beam.material as THREE.MeshBasicMaterial).opacity = 0.85 * bk;
      beaconTop.scale.setScalar(Math.max(0.001, bk));
      beaconTop.rotation.y = t * 1.2;
      beaconTop.rotation.x = t * 0.7;
      for (let r2 = 0; r2 < ripples.length; r2++) {
        const s2 = reduce ? (0.25 + r2 / 3) % 1 : (t * 0.42 + r2 / 3) % 1;
        ripples[r2].scale.setScalar(1 + s2 * 8);
        (ripples[r2].material as THREE.MeshBasicMaterial).opacity = Math.pow(1 - s2, 1.6) * 0.75 * bk;
      }
      for (let a2 = 0; a2 < arcs.length; a2++) {
        arcs[a2].u.uGrow.value = reduce ? 1 : clamp((t - 2.4 - arcs[a2].i * 0.14) / 1.3, 0, 1);
      }
      cityAlpha.value = reduce ? 1 : clamp((t - 3.0) / 1.5, 0, 1);
      if (!reduce) {
        for (let o = 0; o < orbits.length; o++)
          for (let n2 = 0; n2 < orbits[o].sats.length; n2++) orbits[o].sats[n2].rotation.z += dt * orbits[o].speed;
        stars.rotation.y = t * 0.004;
        clouds.rotation.y = t * 0.012;
      }

      cv!.style.opacity = String((reduce ? 1 : Math.min(1, t / 0.8)) * pose.o);
      resetBtn?.classList.toggle("show", Math.abs(userYaw) + Math.abs(userPitch) > 0.08 && sc < 0.4);
      renderer.render(scene, camera);

      beaconTop.getWorldPosition(vTop);
      const pr = vTop.clone().project(camera);
      const px = (pr.x * 0.5 + 0.5) * W;
      const py = (-pr.y * 0.5 + 0.5) * H;
      vN.copy(Pn).applyQuaternion(globe.quaternion);
      vC.copy(camera.position).sub(globe.position).normalize();
      const facing = vN.dot(vC);
      tag!.style.opacity = String(clamp((facing - 0.12) * 5, 0, 1) * clamp(1 - sc * 2.4, 0, 1) * bk);
      tag!.style.transform = `translate3d(${Math.round(px + 26)}px,${Math.round(py - 8)}px,0)`;

      // étiquettes des villes : visibles quand la ville fait face à la caméra, mise en avant près du curseur
      if (labels.length) {
        const showAll = clamp(1 - sc * 2.6, 0, 1) * clamp((t - 3.4) / 1, 0, 1);
        let best = -1, bestD = 70;
        const sx: number[] = [], sy: number[] = [], op: number[] = [];
        for (let c = 0; c < labels.length; c++) {
          const wp = cityVecs[c].clone().multiplyScalar(1.005).applyMatrix4(globe.matrixWorld);
          const pj = wp.clone().project(camera);
          sx[c] = (pj.x * 0.5 + 0.5) * W;
          sy[c] = (-pj.y * 0.5 + 0.5) * H;
          const nrm = cityVecs[c].clone().applyQuaternion(globe.quaternion);
          op[c] = clamp((nrm.dot(vC) - 0.2) * 4, 0, 1) * showAll;
          const d = Math.hypot(sx[c] - cursorX, sy[c] - cursorY);
          if (op[c] > 0.3 && d < bestD) { best = c; bestD = d; }
        }
        for (let c = 0; c < labels.length; c++) {
          const el = labels[c];
          el.style.opacity = String(op[c] * (c === best ? 1 : 0.5));
          el.style.transform = `translate3d(${Math.round(sx[c] + 8)}px,${Math.round(sy[c] - 8)}px,0)`;
          el.classList.toggle("on", c === best);
        }
      }
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      render(now);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === W && Math.abs(h - H) < 90) return;
      W = w;
      H = h;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      layout();
      if (reduce) render(performance.now());
    }
    const onVisibility = () => (document.hidden ? stop() : start());
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) render(performance.now());
    else start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      dragEl?.removeEventListener("pointerdown", onDown);
      dragEl?.removeEventListener("pointermove", onMove);
      dragEl?.removeEventListener("pointerup", onUp);
      dragEl?.removeEventListener("pointercancel", onUp);
      resetBtn?.removeEventListener("click", onReset);
      labels.forEach((l) => l.remove());
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [onFail]);

  return (
    <>
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />
      <div className="tunis-tag" ref={tagRef} aria-hidden="true">
        <span className="tunis-tag__dot" />
        <div>
          <b>Tunis</b>
          <small>36,81° N, 10,18° E</small>
        </div>
      </div>
      <div className="city-labels" ref={labelsRef} aria-hidden="true" />
      <button type="button" className="globe-reset" ref={resetRef}>
        Revenir sur Tunis
      </button>
    </>
  );
}
