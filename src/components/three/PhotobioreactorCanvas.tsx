import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { ReactorComponent } from "@/data/algoraData";

interface PhotobioreactorProps {
  exploded?: boolean;
  selectedId?: ReactorComponent["id"] | null;
  onSelectComponent?: (id: ReactorComponent["id"]) => void;
}

function createAlgaeLiquidTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Rich vibrant chlorophyll green Chlorella culture gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, "#6D28D9");
  grad.addColorStop(0.1, "#16A34A");
  grad.addColorStop(0.45, "#22C55E");
  grad.addColorStop(0.82, "#15803D");
  grad.addColorStop(1.0, "#4ADE80");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle suspended micro-bubbles & cellular texture
  for (let i = 0; i < 600; i++) {
    const x = (Math.sin(i * 19.31) * 0.5 + 0.5) * 256;
    const y = (Math.cos(i * 43.17) * 0.5 + 0.5) * 512;
    const r = 1 + (i % 4);
    ctx.fillStyle =
      i % 2 === 0 ? "rgba(240, 255, 190, 0.25)" : "rgba(40, 130, 0, 0.15)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function createOledDisplayTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#060908";
  ctx.fillRect(0, 0, 512, 256);

  const tiles = [
    { x: 16, y: 16, w: 232, h: 104, color: "#EF4444", label: "24.5", unit: "°C", icon: "T" },
    { x: 264, y: 16, w: 232, h: 104, color: "#38BDF8", label: "58", unit: "% RH", icon: "H" },
    { x: 16, y: 136, w: 232, h: 104, color: "#4ADE80", label: "488", unit: "ppm", icon: "CO₂" },
    { x: 264, y: 136, w: 232, h: 104, color: "#22D3EE", label: "21.8", unit: "%", icon: "O₂" },
  ];

  for (const t of tiles) {
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(t.x, t.y, t.w, t.h, 10);
    ctx.stroke();

    // Mini icon badge
    ctx.strokeStyle = t.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(t.x + 42, t.y + 52, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = t.color;
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.icon, t.x + 42, t.y + 52);

    // Value
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 34px monospace";
    ctx.textAlign = "left";
    ctx.fillText(t.label, t.x + 82, t.y + 50);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "500 16px sans-serif";
    ctx.fillText(t.unit, t.x + 170, t.y + 54);
  }

  return new THREE.CanvasTexture(canvas);
}

function ReactorAssembly({
  exploded = false,
  selectedId = null,
  onSelectComponent,
}: PhotobioreactorProps) {
  const rootRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);
  const chamberRef = useRef<THREE.Group>(null);
  const displayRef = useRef<THREE.Group>(null);
  const filterRef = useRef<THREE.Group>(null);
  const pumpRef = useRef<THREE.Group>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);

  const liquidTex = useMemo(() => createAlgaeLiquidTexture(), []);
  const oledTex = useMemo(() => createOledDisplayTexture(), []);

  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        angle: (i / 64) * Math.PI * 14,
        radius: 0.05 + ((i * 17) % 100) / 340,
        yOffset: (i % 18) / 18,
        speed: 0.25 + ((i * 7) % 10) / 30,
        scale: 0.008 + ((i * 3) % 4) * 0.003,
      })),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.12;
      const targetScale = exploded ? 0.82 : 0.96;
      rootRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootRef.current.scale.x, targetScale, 0.08)
      );
    }

    const lerp = (ref: React.RefObject<THREE.Group | null>, targetY: number) => {
      if (!ref.current) return;
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        targetY,
        0.08
      );
    };

    lerp(crownRef, exploded ? 1.68 : 1.38);
    lerp(chamberRef, exploded ? 0.78 : 0.66);
    lerp(displayRef, exploded ? -0.04 : -0.14);
    lerp(filterRef, exploded ? -0.78 : -0.82);
    lerp(pumpRef, exploded ? -1.48 : -1.21);

    if (bubblesRef.current) {
      const t = clock.getElapsedTime();
      bubbleSeeds.forEach((b, i) => {
        const y = ((b.yOffset + t * b.speed) % 1) * 0.86 - 0.56;
        dummy.position.set(
          Math.cos(b.angle + t * 0.45) * b.radius,
          y,
          Math.sin(b.angle + t * 0.45) * b.radius
        );
        dummy.scale.setScalar(b.scale);
        dummy.updateMatrix();
        bubblesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      bubblesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const highlight = (id: ReactorComponent["id"]) => selectedId === id;

  return (
    <group ref={rootRef} scale={0.96}>
      {/* 1. Double-Tiered Architectural White Top Cap & Violet Grow-Light Crown */}
      <group
        ref={crownRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent?.("crown");
        }}
      >
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.56, 0.57, 0.16, 64]} />
          <meshPhysicalMaterial
            color={highlight("crown") ? "#176B43" : "#F4F6F5"}
            metalness={0.08}
            roughness={0.22}
            clearcoat={0.6}
            clearcoatRoughness={0.18}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.57, 0.57, 0.08, 64]} />
          <meshPhysicalMaterial
            color="#E8ECEA"
            metalness={0.1}
            roughness={0.24}
            clearcoat={0.5}
          />
        </mesh>
        {/* Bright Violet/Magenta LED Puck */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.03, 36]} />
          <meshStandardMaterial
            color="#FCE7F3"
            emissive="#D946EF"
            emissiveIntensity={2.8}
          />
        </mesh>
      </group>

      {/* 2. Recessed Borosilicate Glass Chamber + Luminous Lime-Green Culture + Side Pillars */}
      <group
        ref={chamberRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent?.("chamber");
        }}
      >
        {/* Outer clear borosilicate glass */}
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 1.24, 64, 1, true]} />
          <meshPhysicalMaterial
            color="#F5FAFF"
            transmission={0.88}
            transparent
            opacity={1}
            roughness={0.05}
            ior={1.47}
            thickness={0.12}
            clearcoat={1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Upper violet-lit headspace glow */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.38, 48]} />
          <meshPhysicalMaterial
            color="#A855F7"
            emissive="#7C3AED"
            emissiveIntensity={0.85}
            transparent
            opacity={0.35}
            roughness={0.2}
          />
        </mesh>

        {/* Vibrant emerald-green Chlorella liquid column */}
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.88, 48]} />
          <meshStandardMaterial
            map={liquidTex}
            color="#22C55E"
            emissive="#15803D"
            emissiveIntensity={0.75}
            roughness={0.2}
          />
        </mesh>

        {/* Rising O2 micro-bubbles */}
        <instancedMesh ref={bubblesRef} args={[undefined, undefined, bubbleSeeds.length]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#F7FFE0"
            emissive="#D9FF66"
            emissiveIntensity={0.7}
            transparent
            opacity={0.85}
          />
        </instancedMesh>

        {/* Two sculpted architectural white side frame pillars */}
        {[-0.51, 0.51].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0, 0]}>
            <boxGeometry args={[0.11, 1.28, 0.24]} />
            <meshPhysicalMaterial
              color="#F2F4F3"
              metalness={0.08}
              roughness={0.22}
              clearcoat={0.55}
            />
          </mesh>
        ))}

        {/* Curved architectural white backside shell covering the rear of the tank */}
        <mesh rotation={[0, Math.PI * 0.5, 0]}>
          <cylinderGeometry args={[0.555, 0.555, 1.28, 48, 1, false, 0, Math.PI]} />
          <meshPhysicalMaterial
            color="#F4F6F5"
            metalness={0.08}
            roughness={0.22}
            clearcoat={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 3. Architectural White Mid-Collar & 4-Tile OLED Telemetry Screen */}
      <group
        ref={displayRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent?.("display");
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.56, 0.56, 0.34, 64]} />
          <meshPhysicalMaterial
            color={highlight("display") ? "#176B43" : "#F4F6F5"}
            metalness={0.08}
            roughness={0.22}
            clearcoat={0.55}
          />
        </mesh>
        {/* Touch power ring */}
        <mesh position={[0, 0.11, 0.555]}>
          <torusGeometry args={[0.025, 0.004, 12, 24]} />
          <meshStandardMaterial color="#176B43" emissive="#10B981" emissiveIntensity={0.4} />
        </mesh>
        {/* Crisp 4-Tile OLED Screen */}
        <mesh position={[0, -0.02, 0.545]}>
          <boxGeometry args={[0.5, 0.22, 0.03]} />
          <meshStandardMaterial
            map={oledTex}
            emissiveMap={oledTex}
            emissive="#FFFFFF"
            emissiveIntensity={0.9}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* 4. Internal HEPA + Activated Carbon Filter Stage (revealed on explode) */}
      <group
        ref={filterRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent?.("filter");
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.76, 48]} />
          <meshStandardMaterial
            color={highlight("filter") ? "#35A66A" : "#37413C"}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* 5. Lower Architectural White Slatted Air-Intake Louver Housing & Base */}
      <group
        ref={pumpRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent?.("pump");
        }}
      >
        {/* Inner satin white core */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.51, 0.51, 0.96, 64]} />
          <meshPhysicalMaterial
            color={highlight("pump") ? "#176B43" : "#DDE2DF"}
            metalness={0.08}
            roughness={0.28}
            clearcoat={0.4}
          />
        </mesh>

        {/* Horizontal air-intake louver ribs */}
        {Array.from({ length: 18 }, (_, i) => (
          <mesh
            key={i}
            position={[0, 0.02 + i * 0.048, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.53, 0.012, 10, 64]} />
            <meshPhysicalMaterial
              color="#F4F6F5"
              metalness={0.08}
              roughness={0.2}
              clearcoat={0.55}
            />
          </mesh>
        ))}

        {/* Vertical center spine */}
        <mesh position={[0, 0.42, 0.51]}>
          <boxGeometry args={[0.12, 0.96, 0.08]} />
          <meshPhysicalMaterial
            color="#F4F6F5"
            metalness={0.08}
            roughness={0.2}
            clearcoat={0.55}
          />
        </mesh>

        {/* Stepped base ring */}
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.55, 0.56, 0.14, 64]} />
          <meshPhysicalMaterial
            color="#EAEFEE"
            metalness={0.08}
            roughness={0.22}
            clearcoat={0.55}
          />
        </mesh>
      </group>
    </group>
  );
}

export function PhotobioreactorCanvas({
  exploded = false,
  selectedId = null,
  onSelectComponent,
}: PhotobioreactorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-72 w-40 animate-pulse rounded-3xl bg-neutral-200" />
        </div>
      }
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.05, 5.8], fov: 35 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[5, 7, 5]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-5, 3, 4]} intensity={1.1} color="#E2E8F0" />
        <pointLight position={[0, 1.1, 0.5]} intensity={2.2} color="#D946EF" />
        <pointLight position={[0, 0.45, 0.6]} intensity={1.8} color="#22C55E" />

        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={3.5}
            position={[4, 4, 4]}
            scale={[3, 8, 1]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[-4, 2, 3]}
            scale={[2, 7, 1]}
            color="#F8FAFC"
          />
        </Environment>

        <ReactorAssembly
          exploded={exploded}
          selectedId={selectedId}
          onSelectComponent={onSelectComponent}
        />

        <ContactShadows
          position={[0, -1.65, 0]}
          opacity={0.32}
          scale={5}
          blur={2.2}
          far={2.6}
          color="#111827"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.7}
          dampingFactor={0.07}
          enableDamping
        />
      </Canvas>
    </Suspense>
  );
}
