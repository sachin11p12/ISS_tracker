'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useISSStore } from '@/store/issStore';
import { formatCoordinates, formatSpeed, formatAltitude, formatFootprint } from '@/lib/utils';
import { Crosshair, ZoomIn, ZoomOut, Play, Pause, Radio, Sparkles } from 'lucide-react';

const EARTH_RADIUS = 100;
const ISS_ALTITUDE_SCALE = 1.12;

// Shared Texture Cache for instant switching between Map and Globe
let cachedDayTexture: THREE.Texture | null = null;
let cachedSpecTexture: THREE.Texture | null = null;
let cachedCloudTexture: THREE.Texture | null = null;

// Convert spherical (latitude, longitude, altitude) to 3D Cartesian (x, y, z)
function latLngToVector3(latDeg: number, lngDeg: number, radius: number): THREE.Vector3 {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lngDeg + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Procedural high-detail Earth texture fallback
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#0d3b66');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#2d6a4f';
  // North America
  ctx.beginPath();
  ctx.ellipse(225, 160, 90, 60, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(310, 340, 55, 90, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Eurasia
  ctx.beginPath();
  ctx.ellipse(675, 160, 160, 80, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Africa
  ctx.beginPath();
  ctx.ellipse(550, 280, 75, 95, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(840, 360, 55, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  // Antarctica
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 465, 1024, 47);

  return new THREE.CanvasTexture(canvas);
}

// Procedural Cloud Layer Texture
function createProceduralCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 24; i++) {
    const x = Math.random() * 512;
    const y = 50 + Math.random() * 156;
    const rx = 20 + Math.random() * 60;
    const ry = 5 + Math.random() * 15;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export default function ISSGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // 3D Scene Object References
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const issGroupRef = useRef<THREE.Group | null>(null);
  const issStalkRef = useRef<THREE.Line | null>(null);
  const footprintMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const trailLineRef = useRef<THREE.Line | null>(null);

  // Interactive Drag & Zoom Controls
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraDistanceRef = useRef<number>(280);
  const targetCameraDistanceRef = useRef<number>(280);
  const globeRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: -1.5 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: -1.5 });
  const autoRotateRef = useRef<boolean>(true);
  const isAutoCenteringRef = useRef<boolean>(false);

  // UI State toggles
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showOrbitRings, setShowOrbitRings] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);
  const [textureQuality, setTextureQuality] = useState<'high' | 'procedural'>('high');

  // Coordinate references for smooth 60fps interpolation
  const currentGlobeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const targetGlobeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const {
    telemetry,
    trail,
    locationDetails,
    unitSystem,
    showFootprint,
    isMapExpanded,
    toggleMapExpanded,
  } = useISSStore();

  // Smoothly center camera on ISS position
  const centerOnISS = useCallback(() => {
    if (!telemetry) return;
    autoRotateRef.current = false;
    setAutoRotate(false);
    isAutoCenteringRef.current = true;

    const targetY = -(telemetry.longitude * (Math.PI / 180)) - Math.PI / 2;
    const targetX = telemetry.latitude * (Math.PI / 180) * 0.7;

    targetRotationRef.current = { x: targetX, y: targetY };
    targetCameraDistanceRef.current = 240;

    setTimeout(() => {
      isAutoCenteringRef.current = false;
    }, 1200);
  }, [telemetry]);

  // Construct Realistic 3D ISS Satellite Model
  const createISSModel = useCallback((): THREE.Group => {
    const group = new THREE.Group();

    const moduleMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25,
    });

    const trussMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.7,
      roughness: 0.4,
    });

    const solarCellMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.1,
    });

    const goldFoilMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.3,
    });

    // 1. Central Modules
    const centralCore = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 7, 12), moduleMaterial);
    centralCore.rotation.x = Math.PI / 2;
    group.add(centralCore);

    const crossModule = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 5, 12), goldFoilMaterial);
    crossModule.position.set(0, 0, 1.5);
    group.add(crossModule);

    // Cupola observation bubble
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), moduleMaterial);
    cupola.position.set(0, -1.2, 1.5);
    cupola.rotation.x = Math.PI;
    group.add(cupola);

    // 2. Main Truss
    const mainTruss = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 0.6), trussMaterial);
    mainTruss.position.set(0, 1.5, 0);
    group.add(mainTruss);

    // 3. Solar Array Wings
    const panelPositions = [-9.5, -6.5, 6.5, 9.5];
    panelPositions.forEach((xPos) => {
      const panelTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.5, 0.1), solarCellMaterial);
      panelTop.position.set(xPos, 5.0, 0);
      group.add(panelTop);

      const panelBottom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.5, 0.1), solarCellMaterial);
      panelBottom.position.set(xPos, -2.0, 0);
      group.add(panelBottom);

      const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 6), trussMaterial);
      joint.position.set(xPos, 1.5, 0);
      group.add(joint);
    });

    // 4. Pulsing Beacon Ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const beaconRing = new THREE.Mesh(ringGeo, ringMat);
    beaconRing.name = 'beaconRing';
    group.add(beaconRing);

    group.scale.set(0.65, 0.65, 0.65);

    return group;
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDestroyed = false;
    let animationFrameId: number;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 3000);
    camera.position.set(0, 40, cameraDistanceRef.current);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Deep Space Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 1000 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);

      const tint = 0.85 + Math.random() * 0.15;
      starColors[i] = tint;
      starColors[i + 1] = tint;
      starColors[i + 2] = 1.0;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(300, 50, 200);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 5. Earth Sphere Mesh
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 48, 48);
    const proceduralTexture = createProceduralEarthTexture();

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: cachedDayTexture || proceduralTexture,
      shininess: 25,
      specular: new THREE.Color(0x224466),
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Asynchronous texture loading with cache reuse
    if (!cachedDayTexture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');

      textureLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg',
        (tex) => {
          if (!isDestroyed && earthMeshRef.current) {
            tex.colorSpace = THREE.SRGBColorSpace;
            cachedDayTexture = tex;
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).map = tex;
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).needsUpdate = true;
            setTextureQuality('high');
          }
        },
        undefined,
        () => setTextureQuality('procedural')
      );

      textureLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg',
        (specTex) => {
          if (!isDestroyed && earthMeshRef.current) {
            cachedSpecTexture = specTex;
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).specularMap = specTex;
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).needsUpdate = true;
          }
        }
      );
    } else if (cachedSpecTexture) {
      earthMaterial.specularMap = cachedSpecTexture;
    }

    // 6. Atmosphere Cloud Layer
    const cloudsGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.008, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cachedCloudTexture || createProceduralCloudsTexture(),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    if (!cachedCloudTexture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');
      textureLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_2048.png',
        (cloudTex) => {
          if (!isDestroyed && cloudsMeshRef.current) {
            cloudTex.colorSpace = THREE.SRGBColorSpace;
            cachedCloudTexture = cloudTex;
            (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).map = cloudTex;
            (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
          }
        }
      );
    }

    // 7. Atmospheric Fresnel Glow Halo
    const atmoGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.04, 32, 32);
    const atmoMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.15, 0.75, 1.0, 1.0) * intensity * 1.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    scene.add(atmoMesh);
    atmosphereMeshRef.current = atmoMesh;

    // 8. ISS 3D Model Instance & Stalk
    const issGroup = createISSModel();
    scene.add(issGroup);
    issGroupRef.current = issGroup;

    const stalkGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const stalkMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 2,
      gapSize: 1.5,
      linewidth: 2,
    });
    const issStalk = new THREE.Line(stalkGeo, stalkMat);
    scene.add(issStalk);
    issStalkRef.current = issStalk;

    const footprintGeo = new THREE.RingGeometry(0.1, 15, 24);
    const footprintMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const footprintMesh = new THREE.Mesh(footprintGeo, footprintMat);
    scene.add(footprintMesh);
    footprintMeshRef.current = footprintMesh;

    // 9. Keplerian Orbit Loops
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    orbitGroupRef.current = orbitGroup;

    const inclination = 51.64 * (Math.PI / 180);
    const orbitRadius = EARTH_RADIUS * ISS_ALTITUDE_SCALE;

    for (let orbitIdx = 0; orbitIdx < 5; orbitIdx++) {
      const nodeShift = (orbitIdx * 25.0 * Math.PI) / 180;
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= 90; i++) {
        const u = (i / 90) * Math.PI * 2;
        const x = orbitRadius * (Math.cos(u) * Math.cos(nodeShift) - Math.sin(u) * Math.sin(nodeShift) * Math.cos(inclination));
        const y = orbitRadius * (Math.sin(u) * Math.sin(inclination));
        const z = orbitRadius * (Math.cos(u) * Math.sin(nodeShift) + Math.sin(u) * Math.cos(nodeShift) * Math.cos(inclination));
        points.push(new THREE.Vector3(x, y, z));
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isCurrentOrbit = orbitIdx === 0;

      const ringMat = new THREE.LineBasicMaterial({
        color: isCurrentOrbit ? 0xa855f7 : 0x38bdf8,
        transparent: true,
        opacity: isCurrentOrbit ? 0.85 : 0.22,
      });

      const ringLine = new THREE.Line(ringGeo, ringMat);
      orbitGroup.add(ringLine);
    }

    // 10. Actual Historic Trail Line
    const trailGeo = new THREE.BufferGeometry();
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
    });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trailLine);
    trailLineRef.current = trailLine;

    // 11. Mouse & Touch Drag & Zoom Event Listeners
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      autoRotateRef.current = false;
      setAutoRotate(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
      targetCameraDistanceRef.current = Math.max(160, Math.min(650, targetCameraDistanceRef.current * zoomFactor));
    };

    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        autoRotateRef.current = false;
        setAutoRotate(false);
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.006;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 2.2,
          Math.min(Math.PI / 2.2, targetRotationRef.current.x + deltaY * 0.006)
        );

        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDist > 0) {
          const factor = touchStartDist / dist;
          targetCameraDistanceRef.current = Math.max(160, Math.min(650, targetCameraDistanceRef.current * factor));
        }
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      touchStartDist = 0;
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasEl.addEventListener('wheel', onWheel, { passive: false });

    canvasEl.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 13. Visibility Optimization
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // 14. Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (autoRotateRef.current && !isDraggingRef.current && !isAutoCenteringRef.current) {
        targetRotationRef.current.y += delta * 0.08;
      }

      globeRotationRef.current.x += (targetRotationRef.current.x - globeRotationRef.current.x) * 0.1;
      globeRotationRef.current.y += (targetRotationRef.current.y - globeRotationRef.current.y) * 0.1;
      cameraDistanceRef.current += (targetCameraDistanceRef.current - cameraDistanceRef.current) * 0.12;

      const camY = cameraDistanceRef.current * Math.sin(globeRotationRef.current.x);
      const camRadiusXZ = cameraDistanceRef.current * Math.cos(globeRotationRef.current.x);
      const camX = camRadiusXZ * Math.sin(globeRotationRef.current.y);
      const camZ = camRadiusXZ * Math.cos(globeRotationRef.current.y);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += delta * 0.015;
      }

      if (issGroupRef.current) {
        const beaconRing = issGroupRef.current.getObjectByName('beaconRing') as THREE.Mesh;
        if (beaconRing) {
          const scale = 1.0 + Math.sin(time * 4) * 0.35;
          beaconRing.scale.set(scale, scale, scale);
          (beaconRing.material as THREE.MeshBasicMaterial).opacity = 0.9 - (scale - 1.0) * 0.8;
          beaconRing.lookAt(camera.position);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);

      canvasEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasEl.removeEventListener('wheel', onWheel);

      canvasEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      earthGeometry.dispose();
      proceduralTexture.dispose();
    };
  }, [createISSModel]);

  // Update ISS Position & Telemetry in 3D Space
  useEffect(() => {
    if (!telemetry || !issGroupRef.current || !issStalkRef.current || !footprintMeshRef.current) return;

    const issPosition = latLngToVector3(telemetry.latitude, telemetry.longitude, EARTH_RADIUS * ISS_ALTITUDE_SCALE);
    const groundPosition = latLngToVector3(telemetry.latitude, telemetry.longitude, EARTH_RADIUS * 1.002);

    issGroupRef.current.position.copy(issPosition);
    issGroupRef.current.lookAt(0, 0, 0);
    issGroupRef.current.rotateX(Math.PI / 2);

    const stalkGeo = issStalkRef.current.geometry as THREE.BufferGeometry;
    const positions = new Float32Array([
      groundPosition.x, groundPosition.y, groundPosition.z,
      issPosition.x, issPosition.y, issPosition.z,
    ]);
    stalkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    stalkGeo.computeBoundingSphere();

    footprintMeshRef.current.position.copy(groundPosition);
    footprintMeshRef.current.lookAt(0, 0, 0);

    if (sunLightRef.current && telemetry.solar_lat !== undefined) {
      const sunVec = latLngToVector3(telemetry.solar_lat, telemetry.solar_lon, 450);
      sunLightRef.current.position.copy(sunVec);
    }
  }, [telemetry]);

  // Update Orbit Trail Line
  useEffect(() => {
    if (!trailLineRef.current || !trail || trail.length < 2) return;

    const points: THREE.Vector3[] = trail.map((pt) =>
      latLngToVector3(pt.lat, pt.lng, EARTH_RADIUS * ISS_ALTITUDE_SCALE)
    );

    const trailGeo = new THREE.BufferGeometry().setFromPoints(points);
    trailLineRef.current.geometry.dispose();
    trailLineRef.current.geometry = trailGeo;
  }, [trail]);

  // Toggle Visibility Layer Controls
  useEffect(() => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.visible = showOrbitRings;
    }
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.visible = showClouds;
    }
    if (footprintMeshRef.current) {
      footprintMeshRef.current.visible = showFootprint;
    }
  }, [showOrbitRings, showClouds, showFootprint]);

  // Resize WebGL viewport on expand/compress toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && rendererRef.current && cameraRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isMapExpanded]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl transition-all duration-500 ease-in-out ${
        isMapExpanded
          ? 'h-[580px] sm:h-[640px] lg:h-[720px]'
          : 'h-[380px] sm:h-[420px] md:h-[460px]'
      }`}
    >
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating HUD Telemetry Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 px-3.5 py-2 font-mono text-xs font-semibold text-slate-100 backdrop-blur-xl border border-slate-800 shadow-xl">
          <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider">3D REALISTIC EARTH</span>
          <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300 font-bold border border-cyan-500/40">
            {textureQuality === 'high' ? 'NASA HD' : 'WEBGL 3D'}
          </span>
        </div>

        {telemetry && (
          <div className="hidden sm:block rounded-2xl bg-slate-900/85 p-3 font-mono text-xs text-slate-300 backdrop-blur-xl border border-slate-800/90 shadow-xl space-y-1.5 min-w-[220px]">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Position:</span>
              <span className="font-bold text-slate-100">{formatCoordinates(telemetry.latitude, telemetry.longitude)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Altitude:</span>
              <span className="font-bold text-cyan-400">{formatAltitude(telemetry.altitude, unitSystem)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Velocity:</span>
              <span className="font-bold text-slate-100">{formatSpeed(telemetry.velocity, unitSystem)}</span>
            </div>
            {locationDetails && (
              <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                <span className="text-slate-400">Overflying:</span>
                <span className="font-bold text-emerald-400 truncate max-w-[130px]">
                  {locationDetails.country || locationDetails.waterBodyName || 'Orbit'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Interactive Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            const next = !autoRotate;
            setAutoRotate(next);
            autoRotateRef.current = next;
          }}
          title={autoRotate ? 'Pause Earth Rotation' : 'Resume Earth Rotation'}
          className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 font-mono text-xs font-bold text-slate-200 shadow-xl backdrop-blur-xl hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
        >
          {autoRotate ? (
            <>
              <Pause className="h-3.5 w-3.5 text-cyan-400" />
              <span>Rotate: ON</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-slate-400" />
              <span>Rotate: OFF</span>
            </>
          )}
        </button>

        <button
          onClick={centerOnISS}
          title="Center 3D camera on ISS"
          className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/50 bg-cyan-950/85 px-3.5 py-2 font-mono text-xs font-bold text-cyan-300 shadow-xl backdrop-blur-xl hover:bg-cyan-900/90 hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
          <span>Center ISS</span>
        </button>

        <div className="flex items-center gap-1 rounded-2xl bg-slate-900/90 p-1 border border-slate-800 shadow-xl backdrop-blur-xl">
          <button
            onClick={() => setShowOrbitRings(!showOrbitRings)}
            title="Toggle 3D Orbit Loops"
            className={`rounded-xl px-2.5 py-1.5 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showOrbitRings ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Orbit Loops
          </button>
          <button
            onClick={() => setShowClouds(!showClouds)}
            title="Toggle Atmosphere Clouds"
            className={`rounded-xl px-2.5 py-1.5 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showClouds ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clouds
          </button>
        </div>
      </div>

      {/* Zoom Buttons (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => {
            targetCameraDistanceRef.current = Math.max(160, targetCameraDistanceRef.current * 0.85);
          }}
          title="Zoom In"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-200 shadow-xl backdrop-blur-xl hover:bg-slate-800 hover:text-cyan-400 transition-all cursor-pointer"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            targetCameraDistanceRef.current = Math.min(650, targetCameraDistanceRef.current * 1.15);
          }}
          title="Zoom Out"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-200 shadow-xl backdrop-blur-xl hover:bg-slate-800 hover:text-cyan-400 transition-all cursor-pointer"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Helper Tooltip (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3.5 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-xl border border-slate-800">
        <Sparkles className="h-3 w-3 text-cyan-400" />
        <span>Drag to rotate • Scroll to zoom • Photorealistic 3D Globe</span>
      </div>
    </div>
  );
}
