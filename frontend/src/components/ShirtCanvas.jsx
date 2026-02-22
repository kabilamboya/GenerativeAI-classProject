import { useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { ContactShadows, Decal, Environment, OrbitControls, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+6hln6QAAAABJRU5ErkJggg==";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function tintColor(hex, amount) {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return `#${color.getHexString()}`;
}

function configureTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
}

function RealisticTShirtMockup({
  color = "#f2f4f8",
  branding,
  logoImage = "",
  frontImage = "",
  backImage = "",
}) {
  const dark = tintColor(color, -0.12);

  const frontSource = frontImage || logoImage || TRANSPARENT_PIXEL;
  const backSource = backImage || logoImage || TRANSPARENT_PIXEL;
  const sleeveSource =
    branding?.placement === "Left Sleeve" || branding?.placement === "Right Sleeve"
      ? logoImage || TRANSPARENT_PIXEL
      : TRANSPARENT_PIXEL;

  const frontTexture = useLoader(THREE.TextureLoader, frontSource);
  const backTexture = useLoader(THREE.TextureLoader, backSource);
  const sleeveTexture = useLoader(THREE.TextureLoader, sleeveSource);

  configureTexture(frontTexture);
  configureTexture(backTexture);
  configureTexture(sleeveTexture);

  const hasFrontArt = Boolean(frontImage || logoImage);
  const hasBackArt = Boolean(backImage || logoImage);
  const hasLeftSleeveArt = branding?.placement === "Left Sleeve" && Boolean(logoImage);
  const hasRightSleeveArt = branding?.placement === "Right Sleeve" && Boolean(logoImage);

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <capsuleGeometry args={[0.9, 1.65, 8, 18]} />
        <meshStandardMaterial color={color} roughness={0.74} metalness={0.02} />
        {hasFrontArt ? (
          <Decal
            position={[0, 0.1, 0.45]}
            rotation={[0, 0, 0]}
            scale={[0.95, 0.95, 0.95]}
            map={frontTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
          />
        ) : null}
        {hasBackArt ? (
          <Decal
            position={[0, 0.1, -0.45]}
            rotation={[0, Math.PI, 0]}
            scale={[0.95, 0.95, 0.95]}
            map={backTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
          />
        ) : null}
      </mesh>

      <mesh castShadow receiveShadow position={[-1.06, 0.64, 0]} rotation={[0, 0, 0.45]}>
        <capsuleGeometry args={[0.24, 0.72, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.74} metalness={0.02} />
        {hasLeftSleeveArt ? (
          <Decal
            position={[-0.05, 0, 0.26]}
            rotation={[0, 0.2, 0]}
            scale={[0.32, 0.32, 0.32]}
            map={sleeveTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
          />
        ) : null}
      </mesh>

      <mesh castShadow receiveShadow position={[1.06, 0.64, 0]} rotation={[0, 0, -0.45]}>
        <capsuleGeometry args={[0.24, 0.72, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.74} metalness={0.02} />
        {hasRightSleeveArt ? (
          <Decal
            position={[0.05, 0, 0.26]}
            rotation={[0, -0.2, 0]}
            scale={[0.32, 0.32, 0.32]}
            map={sleeveTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
          />
        ) : null}
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.24, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.07, 16, 48]} />
        <meshStandardMaterial color={dark} roughness={0.8} metalness={0.02} />
      </mesh>
    </group>
  );
}

function RealTShirtModel({ modelUrl, color = "#f2f4f8" }) {
  const gltf = useGLTF(modelUrl);
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((node) => {
      if (node.isMesh && node.material) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (Array.isArray(node.material)) {
          node.material = node.material.map((mat) => {
            if (mat?.color) mat.color = new THREE.Color(color);
            return mat;
          });
        } else if (node.material.color) {
          node.material.color = new THREE.Color(color);
        }
      }
    });
    return cloned;
  }, [gltf.scene, color]);

  return (
    <group scale={[2.2, 2.2, 2.2]} position={[0, -0.8, 0]}>
      <primitive object={model} />
    </group>
  );
}

function RealisticMugMockup({ color = "#f2f4f8" }) {
  const rim = tintColor(color, 0.07);
  const inner = tintColor(color, 0.12);
  const base = tintColor(color, -0.1);

  const ceramicProps = {
    roughness: 0.24,
    metalness: 0.01,
    clearcoat: 0.85,
    clearcoatRoughness: 0.2,
  };

  const handleCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.03, 1.02, 0),
        new THREE.Vector3(-1.65, 0.72, 0),
        new THREE.Vector3(-1.88, 0.0, 0),
        new THREE.Vector3(-1.65, -0.72, 0),
        new THREE.Vector3(-1.03, -1.02, 0),
      ]),
    []
  );

  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 0.98, 2.25, 72, 1, true]} />
        <meshPhysicalMaterial color={color} side={THREE.DoubleSide} {...ceramicProps} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.13, 0]}>
        <torusGeometry args={[1.01, 0.07, 20, 96]} />
        <meshPhysicalMaterial color={rim} {...ceramicProps} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.01, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.15, 60]} />
        <meshPhysicalMaterial color={inner} {...ceramicProps} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -1.03, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 0.18, 60]} />
        <meshPhysicalMaterial color={base} {...ceramicProps} />
      </mesh>

      <mesh castShadow receiveShadow>
        <tubeGeometry args={[handleCurve, 72, 0.095, 18, false]} />
        <meshPhysicalMaterial color={color} {...ceramicProps} />
      </mesh>
    </group>
  );
}

function HouseShell({ color, splitInside }) {
  const floorColor = tintColor(color, -0.12);
  const shift = splitInside ? 0.34 : 0;

  return (
    <group position={[0, -0.15, 0]}>
      <mesh receiveShadow position={[0, -1.08, 0]}>
        <boxGeometry args={[3.8, 0.22, 3.8]} />
        <meshStandardMaterial color={floorColor} roughness={0.9} metalness={0} />
      </mesh>

      <group position={[-shift, 0, -shift]}>
        <mesh castShadow receiveShadow position={[0, 0, 1.45]}>
          <boxGeometry args={[3, 2.3, 0.16]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh castShadow receiveShadow position={[-1.45, 0, 0]}>
          <boxGeometry args={[0.16, 2.3, 3]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
      </group>

      <group position={[shift, 0, shift]}>
        <mesh castShadow receiveShadow position={[0, 0, -1.45]}>
          <boxGeometry args={[3, 2.3, 0.16]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh castShadow receiveShadow position={[1.45, 0, 0]}>
          <boxGeometry args={[0.16, 2.3, 3]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
}

function surfaceTransform(mockupType, placement, houseBrandView) {
  if (mockupType === "Mug") {
    switch (placement) {
      case "Back":
        return { position: [0, -0.1, -1.01], rotation: [0, Math.PI, 0], width: 0.95, height: 0.95 };
      case "Left Sleeve":
        return { position: [-1.01, -0.1, 0], rotation: [0, -Math.PI / 2, 0], width: 0.95, height: 0.95 };
      case "Right Sleeve":
        return { position: [1.01, -0.1, 0], rotation: [0, Math.PI / 2, 0], width: 0.95, height: 0.95 };
      case "Front":
      default:
        return { position: [0, -0.1, 1.01], rotation: [0, 0, 0], width: 0.95, height: 0.95 };
    }
  }

  if (mockupType === "4-Walled House") {
    const outside = {
      Front: { position: [0, 0.2, 1.47], rotation: [0, 0, 0], width: 1.2, height: 0.9 },
      Back: { position: [0, 0.2, -1.47], rotation: [0, Math.PI, 0], width: 1.2, height: 0.9 },
      "Left Sleeve": { position: [-1.47, 0.2, 0], rotation: [0, -Math.PI / 2, 0], width: 1.2, height: 0.9 },
      "Right Sleeve": { position: [1.47, 0.2, 0], rotation: [0, Math.PI / 2, 0], width: 1.2, height: 0.9 },
    };

    const inside = {
      Front: { position: [0, 0.2, 1.28], rotation: [0, Math.PI, 0], width: 1.1, height: 0.86 },
      Back: { position: [0, 0.2, -1.28], rotation: [0, 0, 0], width: 1.1, height: 0.86 },
      "Left Sleeve": { position: [-1.28, 0.2, 0], rotation: [0, Math.PI / 2, 0], width: 1.1, height: 0.86 },
      "Right Sleeve": { position: [1.28, 0.2, 0], rotation: [0, -Math.PI / 2, 0], width: 1.1, height: 0.86 },
    };

    const transforms = houseBrandView === "inside" ? inside : outside;
    return transforms[placement] || transforms.Front;
  }

  switch (placement) {
    case "Back":
      return { position: [0, 0.1, -0.43], rotation: [0, Math.PI, 0], width: 1.3, height: 0.8 };
    case "Left Sleeve":
      return { position: [-1.2, 0.62, 0.22], rotation: [0, -Math.PI / 2, 0], width: 0.42, height: 0.42 };
    case "Right Sleeve":
      return { position: [1.2, 0.62, 0.22], rotation: [0, Math.PI / 2, 0], width: 0.42, height: 0.42 };
    case "Front":
    default:
      return { position: [0, 0.1, 0.43], rotation: [0, 0, 0], width: 1.3, height: 0.8 };
  }
}

function BrandingText({ branding, mockupType, houseBrandView }) {
  const transform = surfaceTransform(mockupType, branding.placement, houseBrandView);

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

function BrandingImage({ logoImage, branding, mockupType, houseBrandView, mugSideImage }) {
  const transform = surfaceTransform(mockupType, branding.placement, houseBrandView);
  const textureSource = mockupType === "Mug" && mugSideImage ? mugSideImage : logoImage;
  const texture = useLoader(THREE.TextureLoader, textureSource);
  configureTexture(texture);

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

  if (mockupType === "Mug") {
    const thetaLength = mugSideImage ? Math.PI * 1.45 : Math.PI * 0.62;
    const yRotation = (() => {
      if (mugSideImage) return 0;
      switch (branding.placement) {
        case "Back":
          return -Math.PI / 2;
        case "Left Sleeve":
          return Math.PI;
        case "Right Sleeve":
          return 0;
        case "Front":
        default:
          return Math.PI / 2;
      }
    })();

    return (
      <mesh position={[0, -0.1, 0]} rotation={[0, yRotation, 0]}>
        <cylinderGeometry args={[1.012, 1.012, 0.95, 96, 1, true, -thetaLength / 2, thetaLength]} />
        <meshStandardMaterial map={texture} transparent roughness={0.98} metalness={0} />
      </mesh>
    );
  }

  return (
    <mesh position={transform.position} rotation={transform.rotation}>
      <planeGeometry args={[planeSize.width, planeSize.height]} />
      <meshStandardMaterial map={texture} transparent roughness={0.95} metalness={0} />
    </mesh>
  );
}

function MockupObject({
  mockupType,
  color,
  houseBrandView,
  branding,
  logoImage,
  tshirtFrontImage,
  tshirtBackImage,
}) {
  const tshirtModelUrl = import.meta.env.VITE_TSHIRT_MODEL_URL;
  const useRealTshirt = import.meta.env.VITE_USE_REAL_TSHIRT === "true";

  switch (mockupType) {
    case "Mug":
      return <RealisticMugMockup color={color} />;
    case "4-Walled House":
      return <HouseShell color={color} splitInside={houseBrandView === "inside"} />;
    case "T-Shirt":
    default:
      if (useRealTshirt && tshirtModelUrl) {
        return <RealTShirtModel modelUrl={tshirtModelUrl} color={color} />;
      }
      return (
        <RealisticTShirtMockup
          color={color}
          branding={branding}
          logoImage={logoImage}
          frontImage={tshirtFrontImage}
          backImage={tshirtBackImage}
        />
      );
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

const mockupOptions = ["T-Shirt", "Mug", "4-Walled House"];
const placementOptions = ["Front", "Back", "Left Sleeve", "Right Sleeve"];
const sidePalette = ["#f2f4f8", "#0f172a", "#1f6f8b", "#8b5e3c", "#7f1d1d", "#14532d"];

export default function ShirtCanvas({
  userMode,
  branding,
  mockupType,
  onMockupTypeChange,
  onPlacementChange,
  logoImage,
  onLogoUpload,
  onClearLogo,
  tshirtFrontImage,
  tshirtBackImage,
  onTshirtFrontUpload,
  onTshirtBackUpload,
  onClearTshirtFront,
  onClearTshirtBack,
  mugSideImage,
  onMugSideUpload,
  onClearMugSide,
  itemColor,
  onItemColorChange,
  houseBrandView = "outside",
  onHouseBrandViewChange,
}) {
  const mode = canvasModes[userMode] || canvasModes.tech;
  const hasTshirtArtwork = Boolean(tshirtFrontImage || tshirtBackImage || logoImage);

  return (
    <section className="canvasPanel">
      <div className="canvasHeader">
        <h2>3D Mockup Preview</h2>
        <p className="muted">
          Object: {mockupType}. {mode.interactionText} Rendering: {mode.label}.
          {mockupType === "4-Walled House" ? ` House branding: ${houseBrandView}.` : ""}
        </p>
      </div>

      <div className="canvasWrap">
        <div className="previewLayout">
          <div className="canvasViewport">
            <Canvas
              dpr={mode.dpr}
              shadows={mode.useShadows}
              camera={{ position: [0, 1.15, 5.2], fov: 40 }}
              gl={{ antialias: userMode !== "non-tech", powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.0;
              }}
            >
              <color attach="background" args={["#f4f7fb"]} />
              <ambientLight intensity={0.35} />
              <hemisphereLight intensity={0.35} color="#ffffff" groundColor="#9aa7b8" />
              <directionalLight
                castShadow={mode.useShadows}
                intensity={1.25}
                position={[2.8, 4.2, 3.7]}
                shadow-mapSize-width={mode.useShadows ? 2048 : 1}
                shadow-mapSize-height={mode.useShadows ? 2048 : 1}
              />
              <directionalLight intensity={0.45} position={[-3, 2, -4]} />
              <Environment preset="studio" intensity={0.9} />

              <mesh receiveShadow={mode.useShadows} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, 0]}>
                <planeGeometry args={[18, 18]} />
                <meshStandardMaterial color="#dbe3ef" roughness={0.95} metalness={0} />
              </mesh>

              <group>
                <MockupObject
                  mockupType={mockupType}
                  color={itemColor}
                  houseBrandView={houseBrandView}
                  branding={branding}
                  logoImage={logoImage}
                  tshirtFrontImage={tshirtFrontImage}
                  tshirtBackImage={tshirtBackImage}
                />

                {mockupType === "T-Shirt" ? (
                  hasTshirtArtwork ? null : (
                    <BrandingText branding={branding} mockupType={mockupType} houseBrandView={houseBrandView} />
                  )
                ) : logoImage || mugSideImage ? (
                  <BrandingImage
                    logoImage={logoImage}
                    branding={branding}
                    mockupType={mockupType}
                    houseBrandView={houseBrandView}
                    mugSideImage={mugSideImage}
                  />
                ) : (
                  <BrandingText branding={branding} mockupType={mockupType} houseBrandView={houseBrandView} />
                )}
              </group>

              <ContactShadows position={[0, -1.73, 0]} opacity={0.34} scale={12} blur={2.4} far={6} />

              <OrbitControls
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                minDistance={mode.minDistance}
                maxDistance={mode.maxDistance}
                maxPolarAngle={Math.PI * 0.8}
              />
            </Canvas>
          </div>

          <aside className="panel previewSidePanel">
            <h3>Quick Edit</h3>
            <p className="hint">Switch objects and placements while you rotate the preview.</p>

            <label htmlFor="previewMockObject">Mock object</label>
            <select
              id="previewMockObject"
              className="field"
              value={mockupType}
              onChange={(event) => onMockupTypeChange?.(event.target.value)}
            >
              {mockupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label htmlFor="previewPlacement">Placement</label>
            <select
              id="previewPlacement"
              className="field"
              value={branding.placement}
              onChange={(event) => onPlacementChange?.(event.target.value)}
            >
              {placementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {mockupType === "4-Walled House" ? (
              <>
                <label htmlFor="previewHouseView">House view</label>
                <select
                  id="previewHouseView"
                  className="field"
                  value={houseBrandView}
                  onChange={(event) => onHouseBrandViewChange?.(event.target.value)}
                >
                  <option value="outside">Outside Walls</option>
                  <option value="inside">Inside Walls</option>
                </select>
              </>
            ) : null}

            {mockupType === "T-Shirt" ? (
              <>
                <label htmlFor="previewTshirtFrontUpload">Front image</label>
                <input
                  id="previewTshirtFrontUpload"
                  className="field"
                  type="file"
                  accept="image/*"
                  onChange={onTshirtFrontUpload}
                />
                {tshirtFrontImage ? (
                  <button type="button" className="miniBtn secondaryMini" onClick={onClearTshirtFront}>
                    Remove Front
                  </button>
                ) : null}

                <label htmlFor="previewTshirtBackUpload">Back image</label>
                <input
                  id="previewTshirtBackUpload"
                  className="field"
                  type="file"
                  accept="image/*"
                  onChange={onTshirtBackUpload}
                />
                {tshirtBackImage ? (
                  <button type="button" className="miniBtn secondaryMini" onClick={onClearTshirtBack}>
                    Remove Back
                  </button>
                ) : null}
              </>
            ) : null}

            {mockupType === "Mug" ? (
              <>
                <label htmlFor="previewMugUpload">Mug side image</label>
                <input
                  id="previewMugUpload"
                  className="field"
                  type="file"
                  accept="image/*"
                  onChange={onMugSideUpload}
                />
                {mugSideImage ? (
                  <button type="button" className="miniBtn secondaryMini" onClick={onClearMugSide}>
                    Remove Mug Image
                  </button>
                ) : null}
              </>
            ) : null}

            {mockupType === "4-Walled House" ? (
              <>
                <label htmlFor="previewLogoUpload">Brand image</label>
                <input
                  id="previewLogoUpload"
                  className="field"
                  type="file"
                  accept="image/*"
                  onChange={onLogoUpload}
                />
                {logoImage ? (
                  <button type="button" className="miniBtn secondaryMini" onClick={onClearLogo}>
                    Remove Image
                  </button>
                ) : null}
              </>
            ) : null}

            <label>Color</label>
            <div className="paletteRow">
              {sidePalette.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`swatch ${itemColor === color ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onItemColorChange?.(color)}
                  title={color}
                  aria-label={`Set color ${color}`}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
