# Familia B — Explosión radial (vista explosionada) con Three.js

El efecto homónimo de la skill, tomado del curso CAD: el modelo se **desensambla** separando cada
pieza a lo largo de un vector radial desde el centro, y **reensambla** al volver. El driver es el
progreso de scroll (`t` de 0 = ensamblado a 1 = explotado). Se genera **programáticamente** desde
los nodos del `.glb`, no hay posiciones pre-horneadas.

Demo ejecutable: `examples/exploded.html` (usa piezas procedurales que emulan un chasis).

## La idea en 3 pasos

1. **Captura la pose ensamblada.** Por cada pieza guarda su posición original y calcula su vector
   de explosión: dirección desde el centro del modelo hacia el centro de la pieza.
2. **Interpola.** `pos = home + dir * distancia * t`. Con `t=0` todo está en su sitio; con `t=1`
   las piezas se abren radialmente.
3. **Conecta `t` al scroll** (idealmente con GSAP ScrollTrigger `scrub`).

## Track 1 — Vanilla + CDN

```html
<script type="importmap">
{ "imports": {
  "three": "https://unpkg.com/three@0.169.0/build/three.module.js",
  "three/addons/": "https://unpkg.com/three@0.169.0/examples/jsm/"
}}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// --- escena + HDRI procedural (sin archivo .hdr) ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const pmrem = new THREE.PMREMGenerator(renderer);
const scene = new THREE.Scene();
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // luz de estudio

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 0.5, 4);

// --- carga del modelo con Draco ---
const draco = new DRACOLoader().setDecoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);

// SUSTITUYE: '/models/chasis.glb' por tu modelo. Cada malla hija = una pieza.
const gltf = await loader.loadAsync('/models/chasis.glb');
const model = gltf.scene;
scene.add(model);

// --- calcula vectores de explosión por pieza ---
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
const parts = [];
model.traverse((o) => {
  if (!o.isMesh) return;
  const home = o.position.clone();
  const worldPos = o.getWorldPosition(new THREE.Vector3());
  const dir = worldPos.sub(center);                // vector radial desde el centro
  if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);     // pieza en el centro: ábrela hacia arriba
  dir.normalize();
  parts.push({ mesh: o, home, dir });
});

const SPREAD = 1.6;                                 // cuánto se separan (en unidades de escena)
function setExplosion(t) {                          // t: 0..1
  for (const p of parts) {
    p.mesh.position.copy(p.home).addScaledVector(p.dir, SPREAD * t);
  }
}

// --- conecta t al scroll con ScrollTrigger scrub ---
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  setExplosion(0);                                  // fallback: modelo ensamblado, sin animación
} else {
  const state = { t: 0 };
  gsap.to(state, {
    t: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#stage',                            // el contenedor con altura de "riel"
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,                                  // ata el avance al scroll 1:1
      onUpdate: () => setExplosion(state.t)
    }
  });
}

// --- resize + render loop ---
const stage = document.querySelector('#stage-canvas');
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();
stage.appendChild(renderer.domElement);
renderer.setAnimationLoop(() => {
  model.rotation.y += 0.001;                        // giro sutil de fondo (opcional)
  renderer.render(scene, camera);
});
</script>
```

HTML mínimo del "riel" de scroll:

```html
<section id="stage" style="height:300vh; position:relative">
  <div id="stage-canvas" style="position:sticky; top:0; height:100vh"></div>
</section>
```

## Reensamblaje rotando

El curso CAD reensambla **girando** mientras cierra. Combina la interpolación radial con una
rotación del grupo dependiente de `t`:

```js
function setExplosion(t) {
  for (const p of parts) p.mesh.position.copy(p.home).addScaledVector(p.dir, SPREAD * t);
  model.rotation.y = t * Math.PI * 2;               // una vuelta completa entre armado y explotado
}
```

## Track 2 — React Three Fiber

`useScroll()` da el `offset` 0..1; aplícalo en `useFrame`. `<ScrollControls>` crea el riel.

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, useGLTF, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Exploded() {
  const { scene } = useGLTF('/models/chasis.glb');   // SUSTITUYE
  const scroll = useScroll();
  const parts = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const out = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const home = o.position.clone();
      const dir = o.getWorldPosition(new THREE.Vector3()).sub(center);
      dir.lengthSq() < 1e-6 ? dir.set(0, 1, 0) : dir.normalize();
      out.push({ mesh: o, home, dir });
    });
    return out;
  }, [scene]);

  useFrame(() => {
    const t = scroll.offset;                         // 0..1
    for (const p of parts) p.mesh.position.copy(p.home).addScaledVector(p.dir, 1.6 * t);
    scene.rotation.y = t * Math.PI * 2;
  });
  return <primitive object={scene} />;
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4], fov: 40 }}>
      <Environment preset="studio" />
      <ScrollControls pages={3}>
        <Exploded />
      </ScrollControls>
    </Canvas>
  );
}
```

## Ajustes finos

- **`SPREAD` por eje**: si el modelo es muy plano, escala `dir` de forma no uniforme (p. ej.
  `dir.y *= 2`) para que las capas se separen más en vertical.
- **Explosión por capas**: agrupa piezas y dales un `delay` en el `t` (cada capa empieza a abrir a
  distinto umbral) para un desarme secuencial en vez de simultáneo.
- **`snap`** en ScrollTrigger para "clavar" el estado armado/explotado al soltar el scroll.

Reglas transversales: siempre `setExplosion(0)` bajo reduced-motion; el `.glb` con Draco (ver
`assets-pipeline.md`); combina con `shader-paper-toon.md` para el look blueprint del curso CAD.
