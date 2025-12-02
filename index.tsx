import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';

// --- SHARED CONSTANTS ---
const PARTICLE_COUNT = 15000;
const CYCLE_DURATION = 10000;

// --- HELPER FUNCTIONS ---
const getRandomPointOnSphere = (r: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return { x, y, z };
};

// --- SHAPE GENERATORS ---
const Generators = {
  // --- HERO SHAPES (Kept for Morphing Cycle) ---
  helix: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const y = (Math.random() - 0.5) * 260; 
      const radius = 40 + Math.random() * 5; 
      const turns = 4.5;
      const angle = (y / 130) * Math.PI * turns + (strand * Math.PI);
      
      let x = Math.cos(angle) * radius;
      let z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const hue = 0.6 + (y + 130) / 520 * 0.1; 
      tempColor.setHSL(hue, 1.0, 0.7);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  neural: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    const radius = 85;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = getRandomPointOnSphere(radius); 
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const isNode = Math.random() < 0.05;
      if (isNode) {
         tempColor.setHSL(0.6, 1.0, 0.9);
      } else {
         tempColor.setHSL(0.65, 0.8, 0.4);
      }
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  cube: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    const size = 90;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isInner = Math.random() < 0.35;
      const s = isInner ? size * 0.5 : size;
      const face = Math.floor(Math.random() * 3);
      const dir = Math.random() < 0.5 ? -1 : 1;
      
      let x = (Math.random() - 0.5) * 2 * s;
      let y = (Math.random() - 0.5) * 2 * s;
      let z = (Math.random() - 0.5) * 2 * s;
      
      if (face === 0) x = s * dir;
      if (face === 1) y = s * dir;
      if (face === 2) z = s * dir;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      tempColor.setHSL(0.6, 1.0, isInner ? 0.9 : 0.5);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  saturn: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    const PLANET_RADIUS = 60;      
    const RING_INNER = 90;
    const RING_OUTER = 160;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isPlanet = i < PARTICLE_COUNT * 0.35;

      if (isPlanet) {
        const p = getRandomPointOnSphere(PLANET_RADIUS);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        tempColor.setHSL(0.6, 0.9, 0.4);
      } else {
        const angle = Math.random() * Math.PI * 2;
        const dist = RING_INNER + Math.random() * (RING_OUTER - RING_INNER);
        
        positions[i * 3] = Math.cos(angle) * dist;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = Math.sin(angle) * dist;

        const t = (dist - RING_INNER) / (RING_OUTER - RING_INNER);
        const hue = 0.55 + t * 0.1; 
        tempColor.setHSL(hue, 0.9, 0.6); 
      }
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  wave: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    const size = 220;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * size;
      const z = (Math.random() - 0.5) * size;
      const y = Math.sin(x * 0.05) * 30 + Math.cos(z * 0.05) * 30;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const h = (y + 50) / 100;
      tempColor.setHSL(0.6 + h * 0.1, 0.9, 0.6);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  nebula: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const SPREAD = 600; 
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = getRandomPointOnSphere(SPREAD * (0.2 + Math.random() * 0.8));
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }
    return { positions, colors };
  },

  // --- NEW PRODUCT-SPECIFIC SHAPES ---

  // 1. Subscan: 9 Dots in Diamond + Decorative Shell
  subscanLogo: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    
    // Configuration for the 9 dots
    const SPACING = 55; 
    const DOT_RADIUS = 15; 
    const centers: {x: number, y: number}[] = [];

    // Create 3x3 grid points
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            centers.push({ x: x * SPACING, y: y * SPACING });
        }
    }
    
    // Rotate 45 degrees to form the diamond/rhombus shape
    const angle = Math.PI / 4;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotatedCenters = centers.map(p => ({
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos
    }));

    // Split particles: ~75% for the logo, ~25% for decorations
    const CORE_PARTICLES = Math.floor(PARTICLE_COUNT * 0.75);
    const SHELL_RADIUS = 135;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (i < CORE_PARTICLES) {
            // -- CORE: 9 Dots --
            const center = rotatedCenters[i % 9];
            
            // Denser core, softer edges
            const r = DOT_RADIUS * Math.pow(Math.random(), 0.8);
            const p = getRandomPointOnSphere(r);
            
            positions[i * 3] = center.x + p.x;
            positions[i * 3 + 1] = center.y + p.y;
            positions[i * 3 + 2] = p.z; 

            // Color: Pink/Purple Gradient (Subscan Brand Colors)
            const hue = 0.82 + Math.random() * 0.12; 
            tempColor.setHSL(hue, 0.9, 0.6);
        } else {
            // -- SHELL: Decorative Surround --
            const feature = Math.random();

            if (feature < 0.6) {
                // 1. Sparse Outer Sphere (Halo)
                const p = getRandomPointOnSphere(SHELL_RADIUS * (0.95 + Math.random() * 0.1));
                positions[i * 3] = p.x;
                positions[i * 3 + 1] = p.y;
                positions[i * 3 + 2] = p.z;
                
                // Very faint purple/grey
                tempColor.setHSL(0.75, 0.4, 0.15); 
            } else {
                // 2. Orbital Ring (Scanner effect)
                const theta = Math.random() * Math.PI * 2;
                const r = SHELL_RADIUS * 1.2;
                // Thin band
                const bandWidth = 10;
                const rad = r + (Math.random() - 0.5) * bandWidth;
                
                // Base circle on XZ
                let x = rad * Math.cos(theta);
                let z = rad * Math.sin(theta);
                let y = (Math.random() - 0.5) * 4;
                
                // Tilt the ring
                const tilt = Math.PI / 6; 
                const ty = y * Math.cos(tilt) - z * Math.sin(tilt);
                const tz = y * Math.sin(tilt) + z * Math.cos(tilt);
                
                positions[i * 3] = x;
                positions[i * 3 + 1] = ty;
                positions[i * 3 + 2] = tz;

                // Slightly brighter accent for ring
                tempColor.setHSL(0.85, 0.6, 0.3);
            }
        }
        
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  // 2. Pubfi: News Sheet with Outer Frame
  newsSheet: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    
    const PAPER_W = 130;
    const PAPER_H = 170;
    
    // Frame Dimensions
    const FRAME_W = 150;
    const FRAME_H = 190;
    const FRAME_D = 30;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let x, y, z;
        
        // Use 20% of particles for the sparse outer frame
        const isFrame = i < PARTICLE_COUNT * 0.2;

        if (isFrame) {
            // -- OUTER WIREFRAME FRAME --
            const edge = Math.floor(Math.random() * 12);
            
            const rand = (Math.random() - 0.5) * 2; // -1 to 1
            const halfW = FRAME_W / 2;
            const halfH = FRAME_H / 2;
            const halfD = FRAME_D / 2;

            if (edge < 4) { // Parallel to X
                x = rand * halfW;
                y = (edge % 2 === 0 ? 1 : -1) * halfH;
                z = (edge < 2 ? 1 : -1) * halfD;
            } else if (edge < 8) { // Parallel to Y
                x = (edge % 2 === 0 ? 1 : -1) * halfW;
                y = rand * halfH;
                z = (edge < 6 ? 1 : -1) * halfD;
            } else { // Parallel to Z
                x = (edge % 2 === 0 ? 1 : -1) * halfW;
                y = (edge < 10 ? 1 : -1) * halfH;
                z = rand * halfD;
            }

            // Add subtle noise/scatter
            x += (Math.random() - 0.5) * 2;
            y += (Math.random() - 0.5) * 2;
            z += (Math.random() - 0.5) * 2;

            tempColor.setHSL(0.6, 0.4, 0.3);
        } else {
            // -- INNER PAPER CONTENT --
            const WIDTH = PAPER_W;
            const HEIGHT = PAPER_H;
            
            const r = Math.random();
            if (r < 0.15) {
                 // Header
                 x = (Math.random() - 0.5) * WIDTH;
                 y = HEIGHT * 0.4 + (Math.random() - 0.5) * 15;
            } else if (r < 0.35) {
                 // Image Box
                 const boxW = WIDTH * 0.4;
                 const boxH = HEIGHT * 0.25;
                 x = (WIDTH * 0.25) + (Math.random() - 0.5) * boxW;
                 y = (HEIGHT * 0.15) + (Math.random() - 0.5) * boxH;
            } else {
                // Text Columns
                const textAreaH = HEIGHT * 0.8;
                const yBase = -HEIGHT * 0.5 + Math.random() * textAreaH;
                
                const lineHeight = 8;
                y = Math.floor(yBase / lineHeight) * lineHeight;
                y += (Math.random() - 0.5) * 3;

                const inImageZone = (y > 0 && y < HEIGHT * 0.3);
                
                if (inImageZone) {
                    x = -WIDTH * 0.25 + (Math.random() - 0.5) * (WIDTH * 0.4);
                } else {
                    // Dual col
                    if (Math.random() > 0.5) {
                         x = -WIDTH * 0.25 + (Math.random() - 0.5) * (WIDTH * 0.4);
                    } else {
                         x = WIDTH * 0.25 + (Math.random() - 0.5) * (WIDTH * 0.4);
                    }
                }
            }
            
            z = Math.sin(x * 0.015) * 12;

            // Brighter colors for content
            const nY = (y + HEIGHT/2) / HEIGHT;
            tempColor.setHSL(0.58, 0.9, 0.5 + nY * 0.4); 
        }
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  // 3. Solvers: Hypercube (Tesseract)
  hypercube: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();

    let pIndex = 0;
    
    // --- 1. OUTER WIREFRAME (Sparse) ---
    const FRAME_SIZE = 200; // Increased size for better framing
    const FRAME_COUNT = Math.floor(PARTICLE_COUNT * 0.15); // 15% for the sparse outer box

    for (let i = 0; i < FRAME_COUNT; i++) {
        const edge = Math.floor(Math.random() * 12);
        const half = FRAME_SIZE / 2;
        let x, y, z;
        const r = (Math.random() - 0.5) * 2; // -1 to 1

        if (edge < 4) { // Parallel to X
            x = r * half;
            y = (edge % 2 === 0 ? 1 : -1) * half;
            z = (edge < 2 ? 1 : -1) * half;
        } else if (edge < 8) { // Parallel to Y
            x = (edge % 2 === 0 ? 1 : -1) * half;
            y = r * half;
            z = (edge < 6 ? 1 : -1) * half;
        } else { // Parallel to Z
            x = (edge % 2 === 0 ? 1 : -1) * half;
            y = (edge < 10 ? 1 : -1) * half;
            z = r * half;
        }
        
        // Scatter frame particles to make it sparse/dim
        positions[pIndex * 3] = x + (Math.random()-0.5) * 2;
        positions[pIndex * 3 + 1] = y + (Math.random()-0.5) * 2;
        positions[pIndex * 3 + 2] = z + (Math.random()-0.5) * 2;
        
        tempColor.setHSL(0.6, 0.5, 0.15); // Dark blue/grey
        colors[pIndex * 3] = tempColor.r;
        colors[pIndex * 3 + 1] = tempColor.g;
        colors[pIndex * 3 + 2] = tempColor.b;
        pIndex++;
    }
    
    // --- 2. Tesseract (Hypercube) ---
    // Reduced sizes for "slightly smaller" look (was 85/45)
    const OUTER_SIZE = 65;
    const INNER_SIZE = 35;
    
    const corners: {x: number, y: number, z: number}[] = [];
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          corners.push({ x, y, z });
        }
      }
    }

    const cubeEdges: [number, number][] = [];
    for (let i = 0; i < corners.length; i++) {
      for (let j = i + 1; j < corners.length; j++) {
        const c1 = corners[i];
        const c2 = corners[j];
        const dist = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) + Math.abs(c1.z - c2.z);
        if (dist === 2) { 
          cubeEdges.push([i, j]);
        }
      }
    }

    // Allocate remaining particles to lines and volume
    const remainingParticles = PARTICLE_COUNT - pIndex;
    const linesCount = cubeEdges.length * 2 + corners.length; 
    const linesParticlesTotal = Math.floor(remainingParticles * 0.75); // Most to lines
    const particlesPerLine = Math.floor(linesParticlesTotal / linesCount);
    
    const drawSegment = (p1: {x:number, y:number, z:number}, p2: {x:number, y:number, z:number}, colorStart: THREE.Color, colorEnd: THREE.Color) => {
        for(let i=0; i<particlesPerLine && pIndex < PARTICLE_COUNT; i++) {
            const t = i / particlesPerLine;
            // Moderate jitter for "slightly blurry" lines (was 1.5 -> 6.0 -> 3.5)
            const jitter = 3.5; 
            
            positions[pIndex * 3] = p1.x + (p2.x - p1.x) * t + (Math.random()-0.5)*jitter;
            positions[pIndex * 3 + 1] = p1.y + (p2.y - p1.y) * t + (Math.random()-0.5)*jitter;
            positions[pIndex * 3 + 2] = p1.z + (p2.z - p1.z) * t + (Math.random()-0.5)*jitter;
            
            tempColor.copy(colorStart).lerp(colorEnd, t);
            
            colors[pIndex * 3] = tempColor.r;
            colors[pIndex * 3 + 1] = tempColor.g;
            colors[pIndex * 3 + 2] = tempColor.b;
            
            pIndex++;
        }
    }

    const colOuter = new THREE.Color().setHSL(0.6, 0.8, 0.5); 
    const colInner = new THREE.Color().setHSL(0.5, 1.0, 0.8); 
    const colConn = new THREE.Color().setHSL(0.65, 0.6, 0.3); 

    // Outer Cube Edges
    cubeEdges.forEach(([i, j]) => {
        const c1 = corners[i];
        const c2 = corners[j];
        drawSegment(
            { x: c1.x * OUTER_SIZE, y: c1.y * OUTER_SIZE, z: c1.z * OUTER_SIZE },
            { x: c2.x * OUTER_SIZE, y: c2.y * OUTER_SIZE, z: c2.z * OUTER_SIZE },
            colOuter, colOuter
        );
    });

    // Inner Cube Edges
    cubeEdges.forEach(([i, j]) => {
        const c1 = corners[i];
        const c2 = corners[j];
        drawSegment(
            { x: c1.x * INNER_SIZE, y: c1.y * INNER_SIZE, z: c1.z * INNER_SIZE },
            { x: c2.x * INNER_SIZE, y: c2.y * INNER_SIZE, z: c2.z * INNER_SIZE },
            colInner, colInner
        );
    });

    // Connecting Edges
    corners.forEach((c) => {
        drawSegment(
            { x: c.x * OUTER_SIZE, y: c.y * OUTER_SIZE, z: c.z * OUTER_SIZE },
            { x: c.x * INNER_SIZE, y: c.y * INNER_SIZE, z: c.z * INNER_SIZE },
            colOuter, colInner
        );
    });
    
    // Fill remaining with volume haze
    while(pIndex < PARTICLE_COUNT) {
         const r = INNER_SIZE * 0.9;
         positions[pIndex * 3] = (Math.random()-0.5) * 2 * r;
         positions[pIndex * 3 + 1] = (Math.random()-0.5) * 2 * r;
         positions[pIndex * 3 + 2] = (Math.random()-0.5) * 2 * r;

         tempColor.setHSL(0.55, 0.8, 0.9);
         colors[pIndex * 3] = tempColor.r;
         colors[pIndex * 3 + 1] = tempColor.g;
         colors[pIndex * 3 + 2] = tempColor.b;
         pIndex++;
    }

    return { positions, colors };
  },

  // 4. DeGov: Consensus Cone (Hourglass/Convergence)
  consensusCone: () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tempColor = new THREE.Color();
    const HEIGHT = 240;
    const MAX_RADIUS = 90;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // y goes from -HEIGHT/2 to HEIGHT/2
      const y = (Math.random() - 0.5) * HEIGHT;
      
      // Radius depends on height (Hourglass shape)
      // Smallest at center (y=0), largest at top/bottom
      const t = Math.abs(y) / (HEIGHT / 2); // 0 at center, 1 at edges
      const radiusAtH = 10 + Math.pow(t, 1.5) * MAX_RADIUS;
      
      const r = Math.random() * radiusAtH;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(angle);

      // Color varies by height (Top inputs -> Center processing -> Bottom execution)
      const hue = 0.55 + (y / HEIGHT) * 0.1; // Slight shift
      tempColor.setHSL(hue, 0.8, 0.6 + (1-t)*0.3); // Brighter at center (consensus)

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
  },

  // --- LEGACY/UNUSED SHAPES (Kept if needed for reference) ---
  solverGem: () => {
     // Redirect to new shape
     return Generators.hypercube(); 
  }
};

// --- COMPONENTS ---

// 1. Hero Visualization (Morphing Cycle)
const HeroVis: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0, 350); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const nebulaPositions = Generators.nebula().positions;
    const shapes = [
      Generators.helix(),
      Generators.neural(),
      Generators.cube(),
      Generators.saturn(),
      Generators.wave()
    ];
    
    const shapeRotations = [
      { x: 0, y: 0, z: Math.PI / 4 },
      { x: 0, y: 0, z: 0 },
      { x: Math.PI / 5, y: Math.PI / 4, z: 0 },
      { x: Math.PI / 8, y: 0, z: Math.PI / 8 },
      { x: Math.PI / 6, y: 0, z: 0 },
    ];

    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const currentColors = new Float32Array(PARTICLE_COUNT * 3);
    currentPositions.set(shapes[0].positions);
    currentColors.set(shapes[0].colors);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(currentColors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let startTime = performance.now();
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = now - startTime;
      const cycleIndex = Math.floor(elapsed / CYCLE_DURATION);
      const cycleTime = elapsed % CYCLE_DURATION;

      const currentShapeIdx = cycleIndex % shapes.length;
      const nextShapeIdx = (cycleIndex + 1) % shapes.length;
      const currentShape = shapes[currentShapeIdx];
      const nextShape = shapes[nextShapeIdx];
      const baseRotation = shapeRotations[currentShapeIdx];
      const nextBaseRotation = shapeRotations[nextShapeIdx];

      let targetRot = { ...baseRotation };
      let targetPositions: Float32Array;
      let targetColors: Float32Array;
      let lerpSpeed = 0.05;
      let scaleTarget = 1.8;

      if (cycleTime < 4000) {
        targetPositions = currentShape.positions;
        targetColors = currentShape.colors;
        lerpSpeed = 0.05; 
        scaleTarget = 1.8 + Math.sin(elapsed * 0.002) * 0.05;
        targetRot.x += Math.sin(elapsed * 0.001) * 0.08; 
        targetRot.z += Math.cos(elapsed * 0.0013) * 0.08; 
        targetRot.y += elapsed * 0.00015;
      } else if (cycleTime < 5500) {
        targetPositions = nebulaPositions; 
        targetColors = currentShape.colors; 
        targetRot.y += elapsed * 0.00015;
        scaleTarget = 2.0; 
        lerpSpeed = 0.03; 
      } else if (cycleTime < 8500) {
        targetPositions = nebulaPositions; 
        targetColors = nextShape.colors; 
        targetRot = { ...nextBaseRotation };
        targetRot.y += elapsed * 0.00015; 
        scaleTarget = 2.3;
        lerpSpeed = 0.005; 
      } else {
        targetPositions = nextShape.positions;
        targetColors = nextShape.colors;
        targetRot = { ...nextBaseRotation };
        targetRot.y += elapsed * 0.00015;
        scaleTarget = 1.8;
        lerpSpeed = 0.04; 
      }

      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;
      const posArray = posAttr.array as Float32Array;
      const colArray = colAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        posArray[i] += (targetPositions[i] - posArray[i]) * lerpSpeed;
        colArray[i] += (targetColors[i] - colArray[i]) * lerpSpeed;
      }

      particles.rotation.x += (targetRot.x - particles.rotation.x) * lerpSpeed;
      particles.rotation.y += (targetRot.y - particles.rotation.y) * lerpSpeed;
      particles.rotation.z += (targetRot.z - particles.rotation.z) * lerpSpeed;
      
      const currentScale = particles.scale.x;
      const newScale = currentScale + (scaleTarget - currentScale) * lerpSpeed;
      particles.scale.setScalar(newScale);

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
         mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
  );
};

// 2. Product Visualization (Reusable, Single Shape)
interface ProductVisProps {
  type: keyof typeof Generators;
  rotation?: { x: number; y: number; z: number };
  scale?: number;
  rotationSpeed?: number; // Added: Control rotation speed and direction (negative for CW)
}

const ProductVis: React.FC<ProductVisProps> = ({ type, rotation = { x: 0, y: 0, z: 0 }, scale = 1.0, rotationSpeed = 0.002 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 2000);
    // Move camera further back to create "margin" around the object (was 300)
    camera.position.z = 420; 
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry
    const shapeData = Generators[type]();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(shapeData.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(shapeData.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.set(rotation.x, rotation.y, rotation.z);
    particles.scale.setScalar(scale);
    scene.add(particles);

    // Loop
    let animationFrameId: number;
    let isVisible = false;

    // Observer to save performance
    const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      
      particles.rotation.y += rotationSpeed; // Use prop
      
      // Gentle floating
      const time = performance.now() * 0.001;
      particles.position.y = Math.sin(time) * 5;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [type, rotation, scale, rotationSpeed]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

// 3. Global UI Logic (Listeners)
const GlobalUI: React.FC = () => {
    useEffect(() => {
        // Reveal animation observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        
        // Mobile Menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        
        const toggleMenu = () => navLinks?.classList.toggle('active');
        if (hamburger) hamburger.addEventListener('click', toggleMenu);

        // Smooth Scrolling for Navigation
        // Intercepts anchor clicks to ensure the scroll position accounts for the fixed header height.
        const handleLinkClick = (e: Event) => {
            const anchor = e.currentTarget as HTMLAnchorElement;
            const targetId = anchor.getAttribute('href');
            
            // Only handle internal hash links
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navLinks?.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                    
                    // Fixed header offset (matches CSS --header-height: 80px)
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        };

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => anchor.addEventListener('click', handleLinkClick));

        // Handle Contact Us mailto links with fallback
        const handleMailtoClick = (e: Event) => {
            const link = e.currentTarget as HTMLAnchorElement;
            const email = link.getAttribute('href')?.replace('mailto:', '');

            // Try to open mailto, but also provide fallback
            setTimeout(() => {
                // Copy email to clipboard as fallback
                if (email && navigator.clipboard) {
                    navigator.clipboard.writeText(email).then(() => {
                        // Show temporary notification
                        const notification = document.createElement('div');
                        notification.textContent = `Email copied: ${email}`;
                        notification.style.cssText = `
                            position: fixed;
                            top: 100px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #0040FF;
                            color: white;
                            padding: 16px 32px;
                            border-radius: 4px;
                            z-index: 10000;
                            font-family: var(--font-mono);
                            box-shadow: 0 4px 12px rgba(0,64,255,0.3);
                        `;
                        document.body.appendChild(notification);

                        setTimeout(() => {
                            notification.style.transition = 'opacity 0.3s';
                            notification.style.opacity = '0';
                            setTimeout(() => notification.remove(), 300);
                        }, 2000);
                    });
                }
            }, 100);
        };

        const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
        mailtoLinks.forEach(link => link.addEventListener('click', handleMailtoClick));

        return () => {
             if (hamburger) hamburger.removeEventListener('click', toggleMenu);
             anchors.forEach(anchor => anchor.removeEventListener('click', handleLinkClick));
             mailtoLinks.forEach(link => link.removeEventListener('click', handleMailtoClick));
             observer.disconnect();
        };
    }, []);
    return null;
}

// --- BOOTSTRAP ---
const bootstrap = () => {
    // 1. Hero
    const heroEl = document.getElementById('hero-canvas-container');
    if (heroEl) {
        createRoot(heroEl).render(
            <>
                <GlobalUI />
                <HeroVis />
            </>
        );
    }

    // 2. Subscan (Explorer -> 9 Dots Diamond)
    const subscanEl = document.getElementById('viz-subscan');
    if (subscanEl) {
        createRoot(subscanEl).render(
            <ProductVis type="subscanLogo" rotation={{ x: 0, y: 0, z: 0 }} />
        );
    }

    // 3. Pubfi (DeFi -> News Sheet)
    const pubfiEl = document.getElementById('viz-pubfi');
    if (pubfiEl) {
        createRoot(pubfiEl).render(
            // Negative rotationSpeed for Clockwise rotation
            <ProductVis type="newsSheet" rotation={{ x: 0, y: -0.2, z: 0 }} rotationSpeed={-0.002} />
        );
    }

    // 4. Solvers (Algorithms -> Hypercube)
    const solversEl = document.getElementById('viz-solvers');
    if (solversEl) {
        createRoot(solversEl).render(
            <ProductVis type="hypercube" rotation={{ x: 0.3, y: 0.3, z: 0 }} />
        );
    }

    // 5. DeGov (AI Governance -> Consensus Cone/Hourglass)
    const degovEl = document.getElementById('viz-degov');
    if (degovEl) {
        createRoot(degovEl).render(
            // Negative rotationSpeed for Clockwise rotation
            <ProductVis type="consensusCone" rotation={{ x: 0, y: 0, z: Math.PI / 12 }} rotationSpeed={-0.002} />
        );
    }
};

bootstrap();