# Familia B — Rotación al scrollear (scroll-rotate) con Three.js

El modelo gira mientras el usuario baja. Mismo driver que la explosión (progreso de scroll), otra
salida (rotación en vez de separación). Sirve como hero interactivo sin controles.

Demo ejecutable: `examples/scroll-rotate.html`.

## Track 1 — Vanilla + CDN

Reusa el setup de escena/HDRI/loader de `threejs-exploded.md`. La diferencia es qué haces con `t`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script type="module">
// ...escena, camera, model cargado (ver threejs-exploded.md)...

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TURNS = 1;                                     // vueltas completas en todo el recorrido

if (reduce) {
  model.rotation.y = 0;                              // fallback estático
} else {
  const s = { t: 0 };
  gsap.to(s, {
    t: 1, ease: 'none',
    scrollTrigger: { trigger: '#stage', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
    onUpdate: () => {
      model.rotation.y = s.t * Math.PI * 2 * TURNS;
      model.rotation.x = Math.sin(s.t * Math.PI) * 0.25;   // ligera inclinación de ida y vuelta
    }
  });
}
</script>
```

`scrub: 0.5` añade medio segundo de inercia (suaviza el seguimiento). `scrub: true` lo pega 1:1.

### Sin GSAP (solo scroll nativo)

Si no quieres GSAP, calcula el progreso a mano (mismo `scrollProgress` de `model-viewer-hdr.md`):

```js
addEventListener('scroll', () => {
  const t = scrollProgress(document.querySelector('#stage'));
  model.rotation.y = t * Math.PI * 2;
}, { passive: true });
```

## Track 2 — React Three Fiber

```jsx
import { useFrame } from '@react-three/fiber';
import { useScroll, useGLTF } from '@react-three/drei';

function SpinModel() {
  const { scene } = useGLTF('/models/chasis.glb');   // SUSTITUYE
  const scroll = useScroll();
  useFrame(() => {
    scene.rotation.y = scroll.offset * Math.PI * 2;
    scene.rotation.x = Math.sin(scroll.offset * Math.PI) * 0.25;
  });
  return <primitive object={scene} />;
}
// envuélvelo en <ScrollControls pages={3}> como en threejs-exploded.md
```

## Variantes útiles

- **Rotar la cámara en vez del modelo** (mejor si el modelo tiene "frente"): orbita la cámara
  alrededor con `camera.position.set(Math.sin(a)*R, y, Math.cos(a)*R); camera.lookAt(0,0,0)`.
- **Snap a caras**: con ScrollTrigger `snap: 1/4` clava el giro cada 90° al soltar.
- **Combinar con explosión**: un mismo `t` puede alimentar rotación *y* separación (el curso CAD
  hace ambas). Ver `threejs-exploded.md` → "Reensamblaje rotando".

Reglas transversales: fallback estático bajo reduced-motion; `passive: true` en el listener de
scroll; `.glb` con Draco.
