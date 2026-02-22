import { useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function tintColor(hex, amount) {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return `#${color.getHexString()}`;
}

function TShirtMockup({ color = "#f2f4f8" }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 2.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      <mesh castShadow receiveShadow position={[-1.5, 0.55, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.9, 0.9, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      <mesh castShadow receiveShadow position={[1.5, 0.55, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.9, 0.9, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  );
}

function MugMockup({ color = "#f2f4f8" }) {
  const light = tintColor(color, 0.08);
  const dark = tintColor(color, -0.08);

  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 0.95, 2.2, 48]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.1} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 48]} />
        <meshStandardMaterial color={light} roughness={0.6} metalness={0.1} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.16, 48]} />
        <meshStandardMaterial color={dark} roughness={0.6} metalness={0.1} />
      </mesh>

      <mesh castShadow receiveShadow position={[1.15, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.1, 16, 80]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.1} />
      </mesh>
    </group>
  );
}

function FourWalledHouseMockup({ color = "#efe6da" }) {
  const floorColor = tintColor(color, -0.12);
  const roofColor = tintColor(color, -0.2);

  return (
    <group position={[0, -0.15, 0]}>
      <mesh receiveShadow position={[0, -1.08, 0]}>
        <boxGeometry args={[3.8, 0.22, 3.8]} />
        <meshStandardMaterial color={floorColor} roughness={0.9} metalness={0} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, 1.45]}>
        <boxGeometry args={[3, 2.3, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, -1.45]}>
        <boxGeometry args={[3, 2.3, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[-1.45, 0, 0]}>
        <boxGeometry args={[0.16, 2.3, 3]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[1.45, 0, 0]}>
        <boxGeometry args={[0.16, 2.3, 3]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.34, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.25, 1.15, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.8} metalness={0.02} />
      </mesh>
    </group>
  );
}

function surfaceTransform(mockupType, placement) {
  if (mockupType === "Mug") {
    switch (placement) {
      case "Back":
        return { position: [0, -0.1, -1.01], rotation: [0, Math.PI, 0], width: 0.95, height: 0.95 };
      case "Left Sleeve":
        return {
          position: [-1.01, -0.1, 0],
          rotation: [0, -Math.PI / 2, 0],
          width: 0.95,
          height: 0.95,
        };
      case "Right Sleeve":
        return { position: [1.01, -0.1, 0], rotation: [0, Math.PI / 2, 0], width: 0.95, height: 0.95 };
      case "Front":
      default:
        return { position: [0, -0.1, 1.01], rotation: [0, 0, 0], width: 0.95, height: 0.95 };
    }
  }

  if (mockupType === "4-Walled House") {
    switch (placement) {
      case "Back":
        return { position: [0, 0.2, -1.47], rotation: [0, Math.PI, 0], width: 1.2, height: 0.9 };
      case "Left Sleeve":
        return {
          position: [-1.47, 0.2, 0],
          rotation: [0, -Math.PI / 2, 0],
          width: 1.2,
          height: 0.9,
        };
      case "Right Sleeve":
        return { position: [1.47, 0.2, 0], rotation: [0, Math.PI / 2, 0], width: 1.2, height: 0.9 };
      case "Front":
      default:
        return { position: [0, 0.2, 1.47], rotation: [0, 0, 0], width: 1.2, height: 0.9 };
    }
  }

  switch (placement) {
    case "Back":
      return { position: [0, 0.1, -0.43], rotation: [0, Math.PI, 0], width: 1.2, height: 0.8 };
    case "Left Sleeve":
      return { position: [-1.52, 0.52, 0.43], rotation: [0, -Math.PI / 2, 0], width: 0.45, height: 0.45 };
    case "Right Sleeve":
      return { position: [1.52, 0.52, 0.43], rotation: [0, Math.PI / 2, 0], width: 0.45, height: 0.45 };
    case "Front":
    default:
      return { position: [0, 0.1, 0.43], rotation: [0, 0, 0], width: 1.2, height: 0.8 };
  }
}

function BrandingText({ branding, mockupType }) {
  const transform = surfaceTransform(mockupType, branding.placement);

  return (
    <group position={transform.position} rotation={transform.rotation}>
      <Text
        fontSize={mockupType === "Mug" ? 0.18 : 0.2}
        maxWidth={transform.width}
        lineHeight={1.15}
        anchorX="center"
        anchorY="middle"
        color="#0e1f2f"
      >
        {branding.name || "Brand Name"}
      </Text>
      <Text
        position={[0, -0.28, 0.01]}
        fontSize={0.09}
        maxWidth={transform.width}
        lineHeight={1.15}
        anchorX="center"
        anchorY="middle"
        color="#e0552d"
      >
        {branding.slogan || "Your slogan"}
      </Text>
    </group>
  );
}

function BrandingImage({ logoImage, branding, mockupType }) {
  const transform = surfaceTransform(mockupType, branding.placement);
  const texture = useLoader(THREE.TextureLoader, logoImage);

  const planeSize = useMemo(() => {
    const ratio = texture.image ? texture.image.width / Math.max(texture.image.height, 1) : 1;
    const maxWidth = transform.width;
    const maxHeight = transform.height;

    let width = maxWidth;
    let height = width / ratio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }

    return {
      width: clamp(width, 0.2, maxWidth),
      height: clamp(height, 0.2, maxHeight),
    };
  }, [texture.image, transform.height, transform.width]);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return (
    <mesh position={transform.position} rotation={transform.rotation}>
      <planeGeometry args={[planeSize.width, planeSize.height]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function MockupObject({ mockupType, color }) {
  switch (mockupType) {
    case "Mug":
      return <MugMockup color={color} />;
    case "4-Walled House":
      return <FourWalledHouseMockup color={color} />;
    case "T-Shirt":
    default:
      return <TShirtMockup color={color} />;
  }
}

const canvasModes = {
  "non-tech": {
    label: "Low load mode",
    dpr: [1, 1.25],
    useShadows: false,
    minDistance: 3.5,
    maxDistance: 8,
    interactionText: "Drag to rotate.",
  },
  tech: {
    label: "Balanced mode",
    dpr: [1, 1.6],
    useShadows: true,
    minDistance: 3,
    maxDistance: 9,
    interactionText: "Drag to rotate. Scroll to zoom.",
  },
  pro: {
    label: "High fidelity mode",
    dpr: [1, 2],
    useShadows: true,
    minDistance: 2.4,
    maxDistance: 10,
    interactionText: "Drag to rotate. Scroll to zoom.",
  },
};

export default function ShirtCanvas({ userMode, branding, mockupType, logoImage, itemColor }) {
  const mode = canvasModes[userMode] || canvasModes.tech;

  return (
    <section className="canvasPanel">
      <div className="canvasHeader">
        <h2>3D Mockup Preview</h2>
        <p className="muted">
          Object: {mockupType}. {mode.interactionText} Rendering: {mode.label}.
        </p>
      </div>

      <div className="canvasWrap">
        <Canvas
          dpr={mode.dpr}
          shadows={mode.useShadows}
          camera={{ position: [0, 1.2, 5.6], fov: 40 }}
          gl={{ antialias: userMode !== "non-tech", powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#f4f7fb"]} />
          <ambientLight intensity={0.7} />
          <directionalLight
            castShadow={mode.useShadows}
            intensity={1.1}
            position={[2.6, 4, 3.8]}
            shadow-mapSize-width={mode.useShadows ? 2048 : 1}
            shadow-mapSize-height={mode.useShadows ? 2048 : 1}
          />
          <mesh receiveShadow={mode.useShadows} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, 0]}>
            <planeGeometry args={[18, 18]} />
            <meshStandardMaterial color="#dbe3ef" />
          </mesh>

          <Float speed={1.2} rotationIntensity={0.07} floatIntensity={0.18}>
            <MockupObject mockupType={mockupType} color={itemColor} />
            {logoImage ? (
              <BrandingImage logoImage={logoImage} branding={branding} mockupType={mockupType} />
            ) : (
              <BrandingText branding={branding} mockupType={mockupType} />
            )}
          </Float>

          <OrbitControls enablePan={false} minDistance={mode.minDistance} maxDistance={mode.maxDistance} />
        </Canvas>
      </div>
    </section>
  );
}

