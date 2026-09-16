/* ============================================================
   2D MARKETING — HERO 3D SONY FX5 CAMERA + EXPLODED VIEW
   Scroll-driven radial explosion animation
   Built with Three.js + GSAP ScrollTrigger
   ============================================================ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

class Hero3D {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    this.section = document.getElementById('hero-3d-section');
    if (!this.canvas || !this.section) return;

    // Check WebGL support
    try {
      var testGl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (!testGl) return;
    } catch (e) {
      return;
    }

    this.parts = [];
    this.modelGroup = new THREE.Group();
    this.scrollProgress = 0;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initScene();
    this.initLights();
    this.loadOrBuildModel();
    this.initScroll();
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.3, 7.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.scene.add(this.modelGroup);
  }

  initLights() {
    // Ambient light with subtle crimson tone
    const ambient = new THREE.AmbientLight(0x1a1515, 1.2);
    this.scene.add(ambient);

    // Key directional light (cool white)
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(5, 6, 6);
    this.scene.add(key);

    // High-contrast crimson rim light (2D brand color #C00000)
    const rim = new THREE.DirectionalLight(0xc00000, 4.5);
    rim.position.set(-6, 3, -4);
    this.scene.add(rim);

    // Subtle bottom red fill
    const fill = new THREE.PointLight(0x990000, 2.0, 20);
    fill.position.set(0, -4, 3);
    this.scene.add(fill);

    // Cinema lens glow spotlight
    const spot = new THREE.SpotLight(0xff3333, 2.5, 25, Math.PI / 6, 0.4);
    spot.position.set(0, 7, 3);
    this.scene.add(spot);
  }

  createPlaceholderCamera() {
    // Cinema camera materials
    const matChassis = new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.35,
      metalness: 0.8
    });
    const matDarkMetal = new THREE.MeshStandardMaterial({
      color: 0x0e0f11,
      roughness: 0.45,
      metalness: 0.9
    });
    const matGrip = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.85,
      metalness: 0.1
    });
    const matRedAccent = new THREE.MeshStandardMaterial({
      color: 0xc00000,
      roughness: 0.25,
      metalness: 0.6,
      emissive: 0x400000,
      emissiveIntensity: 0.6
    });
    const matChrome = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.15,
      metalness: 0.95
    });
    const matLensGlass = new THREE.MeshPhysicalMaterial({
      color: 0x051025,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.6,
      reflectivity: 0.9
    });
    const matScreen = new THREE.MeshBasicMaterial({
      color: 0x081015
    });

    const addPart = (mesh, explodeDir, customScale = 1.0) => {
      this.modelGroup.add(mesh);
      this.parts.push({
        mesh: mesh,
        homePos: mesh.position.clone(),
        homeRot: mesh.rotation.clone(),
        dir: explodeDir.clone().normalize(),
        scaleMult: customScale
      });
    };

    // 1. Main Camera Chassis (Body)
    const bodyGeom = new THREE.BoxGeometry(1.6, 1.2, 1.4);
    const bodyMesh = new THREE.Mesh(bodyGeom, matChassis);
    bodyMesh.position.set(0, 0, 0);
    addPart(bodyMesh, new THREE.Vector3(0, 0, -0.4));

    // 2. Cinema Lens Mount (E-mount Ring)
    const mountGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
    mountGeom.rotateX(Math.PI / 2);
    const mountMesh = new THREE.Mesh(mountGeom, matChrome);
    mountMesh.position.set(0, 0.05, 0.78);
    addPart(mountMesh, new THREE.Vector3(0, 0, 0.8));

    // 3. Cinema Lens Barrel (Main Optics Section)
    const barrelGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.9, 32);
    barrelGeom.rotateX(Math.PI / 2);
    const barrelMesh = new THREE.Mesh(barrelGeom, matDarkMetal);
    barrelMesh.position.set(0, 0.05, 1.3);
    addPart(barrelMesh, new THREE.Vector3(0, 0.1, 1.8));

    // 4. Focus & Iris Gear Rings (Cinema Teeth)
    const ringGeom = new THREE.TorusGeometry(0.53, 0.04, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeom, matRedAccent);
    ringMesh.position.set(0, 0.05, 1.2);
    addPart(ringMesh, new THREE.Vector3(0.3, 0.3, 1.6));

    // 5. Front Lens Element & Hood
    const hoodGeom = new THREE.CylinderGeometry(0.65, 0.52, 0.35, 32, 1, true);
    hoodGeom.rotateX(Math.PI / 2);
    const hoodMesh = new THREE.Mesh(hoodGeom, matChassis);
    hoodMesh.position.set(0, 0.05, 1.9);
    addPart(hoodMesh, new THREE.Vector3(0, 0.2, 2.4));

    const glassGeom = new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const glassMesh = new THREE.Mesh(glassGeom, matLensGlass);
    glassMesh.rotation.x = Math.PI / 2;
    glassMesh.position.set(0, 0.05, 1.75);
    addPart(glassMesh, new THREE.Vector3(0, 0.1, 2.1));

    // 6. Top Cinema Handle
    const handleGeom = new THREE.BoxGeometry(0.4, 0.3, 1.3);
    const handleMesh = new THREE.Mesh(handleGeom, matGrip);
    handleMesh.position.set(0, 0.85, -0.1);
    addPart(handleMesh, new THREE.Vector3(0, 1.8, 0.2));

    // 7. Shotgun Mic / XLR Module
    const micGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.1, 24);
    micGeom.rotateX(Math.PI / 2);
    const micMesh = new THREE.Mesh(micGeom, matDarkMetal);
    micMesh.position.set(0.35, 1.05, 0.3);
    addPart(micMesh, new THREE.Vector3(0.9, 1.6, 0.5));

    // 8. Articulated Side Monitor / Viewfinder
    const screenFrameGeom = new THREE.BoxGeometry(0.1, 0.8, 1.2);
    const screenFrameMesh = new THREE.Mesh(screenFrameGeom, matChassis);
    screenFrameMesh.position.set(-1.0, 0.2, 0.1);
    screenFrameMesh.rotation.y = -0.3;

    const lcdGeom = new THREE.PlaneGeometry(1.0, 0.65);
    lcdGeom.rotateY(Math.PI / 2);
    const lcdMesh = new THREE.Mesh(lcdGeom, matScreen);
    lcdMesh.position.set(-1.06, 0.2, 0.1);
    lcdMesh.rotation.y = -0.3;
    screenFrameMesh.add(lcdMesh);

    addPart(screenFrameMesh, new THREE.Vector3(-2.0, 0.5, 0.4));

    // 9. V-Mount Battery Pack (Rear)
    const battGeom = new THREE.BoxGeometry(1.3, 0.9, 0.5);
    const battMesh = new THREE.Mesh(battGeom, matDarkMetal);
    battMesh.position.set(0, -0.05, -1.0);
    addPart(battMesh, new THREE.Vector3(0, -0.4, -2.0));

    // 10. 15mm Baseplate & Dual Carbon Rods
    const rodsGroup = new THREE.Group();
    const rod1Geom = new THREE.CylinderGeometry(0.06, 0.06, 2.6, 16);
    rod1Geom.rotateX(Math.PI / 2);
    const rod1 = new THREE.Mesh(rod1Geom, matChrome);
    rod1.position.set(0.4, -0.85, 0.4);
    const rod2 = rod1.clone();
    rod2.position.set(-0.4, -0.85, 0.4);
    rodsGroup.add(rod1, rod2);
    addPart(rodsGroup, new THREE.Vector3(0, -1.8, 0.2));

    // 11. DJI RS Gimbal Ring & Tilt Hub
    const gimbalRingGeom = new THREE.TorusGeometry(1.7, 0.08, 16, 48, Math.PI * 1.3);
    const gimbalRing = new THREE.Mesh(gimbalRingGeom, matDarkMetal);
    gimbalRing.position.set(0, -0.4, 0);
    gimbalRing.rotation.z = Math.PI * 0.85;
    addPart(gimbalRing, new THREE.Vector3(-0.8, -2.2, -0.8));

    // 12. Gimbal Pan Motor & Base Grip
    const motorGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24);
    const motor = new THREE.Mesh(motorGeom, matChassis);
    motor.position.set(0, -1.8, -0.3);
    addPart(motor, new THREE.Vector3(0.5, -2.8, -0.4));

    // Center model group
    this.modelGroup.position.set(0, -0.1, 0);
    this.modelGroup.rotation.y = -0.4;
    this.modelGroup.rotation.x = 0.15;
  }

  loadOrBuildModel() {
    const loader = new GLTFLoader();
    loader.load(
      './assets/models/sony-fx5.glb',
      (gltf) => {
        this.cameraModel = gltf.scene;
        this.cameraModel.scale.set(1.5, 1.5, 1.5);
        this.modelGroup.add(this.cameraModel);

        const box = new THREE.Box3().setFromObject(this.cameraModel);
        const center = box.getCenter(new THREE.Vector3());

        this.cameraModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const home = child.position.clone();
            const worldPos = child.getWorldPosition(new THREE.Vector3());
            const dir = worldPos.sub(center);
            if (dir.lengthSq() < 1e-5) dir.set(0, 1, 0);
            dir.normalize();
            this.parts.push({
              mesh: child,
              homePos: home,
              homeRot: child.rotation.clone(),
              dir: dir,
              scaleMult: 1.5
            });
          }
        });
      },
      undefined,
      () => {
        // Fallback: build high-detail procedural FX5
        this.createPlaceholderCamera();
      }
    );
  }

  updateExplosion(progress) {
    if (this.isReducedMotion) {
      this.parts.forEach((p) => p.mesh.position.copy(p.homePos));
      return;
    }

    // Explode from 0.05 to 0.50, hold/float 0.50 to 0.70, reassemble 0.70 to 0.95
    let spread = 0;
    if (progress < 0.50) {
      spread = (progress / 0.50); // 0 -> 1
    } else if (progress < 0.72) {
      spread = 1.0;
    } else if (progress <= 1.0) {
      spread = 1.0 - ((progress - 0.72) / 0.28); // 1 -> 0
    }
    spread = Math.max(0, Math.min(1, spread));

    // Non-linear easing
    const easedSpread = spread * spread * (3 - 2 * spread);
    const SPREAD_AMOUNT = 1.8;

    this.parts.forEach((p) => {
      const targetPos = p.homePos.clone().addScaledVector(p.dir, SPREAD_AMOUNT * easedSpread * p.scaleMult);
      p.mesh.position.lerp(targetPos, 0.15);

      if (easedSpread > 0.01) {
        p.mesh.rotation.x = p.homeRot.x + easedSpread * 0.35 * p.dir.y;
        p.mesh.rotation.y = p.homeRot.y + easedSpread * 0.45 * p.dir.x;
      } else {
        p.mesh.rotation.copy(p.homeRot);
      }
    });

    // Whole assembly rotation driven by scroll
    this.modelGroup.rotation.y = -0.4 + progress * Math.PI * 1.5;
    this.modelGroup.rotation.x = 0.15 - progress * 0.25;

    // Subtle camera dolly
    this.camera.position.z = 7.5 - progress * 1.5;
  }

  initScroll() {
    const handleScroll = () => {
      const rect = this.section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = rect.height - windowH;
      if (totalDist <= 0) return;

      const current = -rect.top;
      const progress = Math.max(0, Math.min(1, current / totalDist));
      this.scrollProgress = progress;
      this.updateExplosion(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Gentle idle floating when idle
    const time = performance.now() * 0.001;
    if (this.scrollProgress < 0.05 || this.scrollProgress > 0.95) {
      this.modelGroup.position.y = -0.1 + Math.sin(time * 1.5) * 0.05;
      this.modelGroup.rotation.y += 0.003;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Hero3D());
} else {
  new Hero3D();
}
