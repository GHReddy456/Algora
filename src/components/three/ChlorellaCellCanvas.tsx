import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

function createCellularTextures() {
  const size = 512;

  // Mossy botanical chlorophyll texture matching the microscopy reference
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext("2d")!;
  const grad = cCtx.createRadialGradient(220, 210, 20, 256, 256, 256);
  grad.addColorStop(0, "#D9ED68");
  grad.addColorStop(0.5, "#7CC845");
  grad.addColorStop(1, "#3E872A");
  cCtx.fillStyle = grad;
  cCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1200; i++) {
    const x = (Math.sin(i * 17.13) * 0.5 + 0.5) * size;
    const y = (Math.cos(i * 41.77) * 0.5 + 0.5) * size;
    const r = 2 + (i % 14);
    cCtx.fillStyle =
      i % 2 === 0 ? "rgba(232, 245, 118, 0.28)" : "rgba(56, 128, 36, 0.22)";
    cCtx.beginPath();
    cCtx.arc(x, y, r, 0, Math.PI * 2);
    cCtx.fill();
  }

  // Frosted micro-pitted bump map for the outer cell wall
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d")!;
  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2800; i++) {
    const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * size;
    const y = (Math.cos(i * 78.233) * 0.5 + 0.5) * size;
    const r = 1.5 + (i % 6);
    const v = i % 2 === 0 ? 215 : 45;
    bCtx.fillStyle = `rgba(${v},${v},${v},0.3)`;
    bCtx.beginPath();
    bCtx.arc(x, y, r, 0, Math.PI * 2);
    bCtx.fill();
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { colorMap, bumpMap };
}

const FRESNEL_RIM_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRESNEL_RIM_FRAG = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float rim = pow(1.0 - ndotv, 2.5);
  float outerRing = smoothstep(0.55, 0.85, rim);
  float innerRing = smoothstep(0.88, 0.99, rim);
  vec3 col = mix(vec3(0.92, 0.97, 0.80), vec3(0.58, 0.80, 0.34), rim);
  float alpha = clamp(0.06 + outerRing * 0.42 + innerRing * 0.45, 0.0, 0.88);
  gl_FragColor = vec4(col, alpha);
}
`;

function MicroscopicChlorellaModel({ scrollProgress = 0 }: { scrollProgress: number }) {
  const rootRef = useRef<THREE.Group>(null);
  const swirlRef = useRef<THREE.Group>(null);

  const { colorMap, bumpMap } = useMemo(() => createCellularTextures(), []);

  // Two organic spiral arms of textured green chloroplasts & clear glass bubbles
  const organelles = useMemo(() => {
    const items: Array<{
      pos: [number, number, number];
      radius: number;
      isBubble: boolean;
      tint: string;
    }> = [];

    for (let i = 0; i < 44; i++) {
      const t = i / 44;
      const angle = t * Math.PI * 3.4 + (i % 3) * 0.28;
      const r = 0.56 + Math.sin(t * Math.PI) * 0.42 + ((i * 7) % 10) * 0.014;
      const z = Math.cos(i * 2.1) * 0.35;
      items.push({
        pos: [Math.cos(angle) * r, Math.sin(angle) * r, z],
        radius: 0.048 + (i % 5) * 0.015,
        isBubble: false,
        tint: i % 3 === 0 ? "#AEE34F" : i % 2 === 0 ? "#7AD148" : "#58A638",
      });
    }

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + 0.5;
      const r = 0.42 + ((i * 19) % 10) * 0.055;
      const z = Math.sin(i * 1.7) * 0.42;
      items.push({
        pos: [Math.cos(angle) * r, Math.sin(angle) * r, z],
        radius: 0.055 + (i % 4) * 0.025,
        isBubble: true,
        tint: "#F4FAF1",
      });
    }

    return items;
  }, []);

  // Wispy extracellular filaments around the outer rim
  const filamentGeos = useMemo(() => {
    const curves = [
      [
        new THREE.Vector3(1.12, 0.55, 0.12),
        new THREE.Vector3(1.32, 0.85, -0.05),
        new THREE.Vector3(1.52, 0.98, -0.2),
      ],
      [
        new THREE.Vector3(-1.08, -0.58, 0.2),
        new THREE.Vector3(-1.35, -0.82, 0.05),
        new THREE.Vector3(-1.55, -0.96, -0.15),
      ],
      [
        new THREE.Vector3(0.45, 1.18, -0.15),
        new THREE.Vector3(0.75, 1.38, -0.05),
        new THREE.Vector3(1.02, 1.48, 0.1),
      ],
      [
        new THREE.Vector3(-0.52, -1.14, 0.1),
        new THREE.Vector3(-0.18, -1.36, 0.2),
        new THREE.Vector3(0.22, -1.42, 0.08),
      ],
    ];
    return curves.map(
      (pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.007, 8, false)
    );
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.08;
      rootRef.current.position.y = Math.sin(t * 0.85) * 0.04;
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        scrollProgress * 0.3,
        0.06
      );
      const s = 1 + scrollProgress * 0.06;
      rootRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootRef.current.scale.x, s, 0.08)
      );
    }
    if (swirlRef.current) {
      swirlRef.current.rotation.z += delta * 0.045;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Central Organic Light-Green & Yellow Pyrenoid / Chloroplast Core */}
      <mesh>
        <sphereGeometry args={[0.46, 48, 48]} />
        <meshPhysicalMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.03}
          color="#C9E854"
          emissive="#8AB82E"
          emissiveIntensity={0.22}
          roughness={0.44}
          clearcoat={0.25}
          transparent
          opacity={0.86}
        />
      </mesh>

      {/* Swirling Textured Green Chloroplasts & Clear Refractive Bubbles */}
      <group ref={swirlRef}>
        {organelles.map((item, idx) =>
          item.isBubble ? (
            <mesh key={idx} position={item.pos}>
              <sphereGeometry args={[item.radius, 24, 24]} />
              <meshPhysicalMaterial
                color="#F2F8EE"
                transmission={0.92}
                transparent
                opacity={1}
                roughness={0.06}
                ior={1.36}
                thickness={0.16}
                clearcoat={0.9}
              />
            </mesh>
          ) : (
            <mesh key={idx} position={item.pos}>
              <sphereGeometry args={[item.radius, 24, 24]} />
              <meshPhysicalMaterial
                map={colorMap}
                bumpMap={bumpMap}
                bumpScale={0.015}
                color={item.tint}
                roughness={0.38}
                clearcoat={0.35}
              />
            </mesh>
          )
        )}
      </group>

      {/* Frosted Micro-Pitted Outer Cell Wall */}
      <mesh>
        <sphereGeometry args={[1.24, 72, 72]} />
        <meshPhysicalMaterial
          color="#EEF5EA"
          transmission={0.88}
          transparent
          opacity={1}
          roughness={0.16}
          ior={1.44}
          thickness={0.4}
          clearcoat={0.75}
          bumpMap={bumpMap}
          bumpScale={0.012}
        />
      </mesh>

      {/* Double-Ring Fresnel Microscopy Rim */}
      <mesh>
        <sphereGeometry args={[1.26, 64, 64]} />
        <shaderMaterial
          vertexShader={FRESNEL_RIM_VERT}
          fragmentShader={FRESNEL_RIM_FRAG}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Wispy Extracellular Filaments */}
      {filamentGeos.map((geo, idx) => (
        <mesh key={idx} geometry={geo}>
          <meshStandardMaterial
            color="#B5CFA8"
            transparent
            opacity={0.55}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ChlorellaCellCanvas({
  scrollProgress = 0,
  className = "",
}: {
  scrollProgress?: number;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-72 w-72 animate-pulse rounded-full bg-[#ECFDF5]" />
          </div>
        }
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.05, 5.15], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 6, 5]} intensity={1.55} color="#FFFFFF" />
          <directionalLight position={[-5, -4, 3]} intensity={0.85} color="#D9F99D" />

          <Environment resolution={128}>
            <Lightformer
              form="circle"
              intensity={2.2}
              position={[4, 4, 4]}
              scale={4}
              color="#FFFFFF"
            />
            <Lightformer
              form="ring"
              intensity={1.3}
              position={[-4, -2, 3]}
              scale={5}
              color="#E5F3DC"
            />
          </Environment>

          <MicroscopicChlorellaModel scrollProgress={scrollProgress} />

          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.18}
            scale={5.2}
            blur={2.6}
            far={2.8}
            color="#498537"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.65}
            dampingFactor={0.05}
            enableDamping
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
