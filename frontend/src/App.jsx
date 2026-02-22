import { Suspense, lazy, useMemo, useState } from "react";
import IdeaForm from "./components/IdeaForm";
import BrandingDetails from "./components/BrandingDetails";
import { generateBranding } from "./lib/api";

const ShirtCanvas = lazy(() => import("./components/ShirtCanvas"));

const emptyBranding = {
  name: "",
  slogan: "",
  description: "",
  missionStatement: "",
  placement: "Front",
};

const MODE_CONFIG = {
  "non-tech": {
    label: "Non-tech",
    summary: "Simple flow with guided language and lighter 3D rendering.",
  },
  tech: {
    label: "Tech",
    summary: "Balanced controls with clear prompts and full editing.",
  },
  pro: {
    label: "Pro",
    summary: "Maximum control, deeper prompt guidance, and advanced quality checks.",
  },
};

export default function App() {
  const [userMode, setUserMode] = useState("non-tech");
  const [idea, setIdea] = useState("");
  const [direction, setDirection] = useState("Bold");
  const [mockupType, setMockupType] = useState("T-Shirt");
  const [branding, setBranding] = useState(emptyBranding);
  const [logoImage, setLogoImage] = useState("");
  const [itemColor, setItemColor] = useState("#f2f4f8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modeInfo = MODE_CONFIG[userMode];

  const canEdit = useMemo(
    () =>
      Boolean(
        branding.name || branding.slogan || branding.description || branding.missionStatement
      ),
    [branding]
  );

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await generateBranding({ idea, direction });
      setBranding({
        name: data.name || "",
        slogan: data.slogan || "",
        description: data.description || "",
        missionStatement: data.missionStatement || "",
        placement: data.placement || "Front",
      });
    } catch (err) {
      setError(err.message || "Unable to generate branding.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setError("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="appShell">
      <header className="hero">
        <p className="eyebrow">AI + 3D Studio</p>
        <h1>AI-Powered Apparel Branding Lab</h1>
        <p>
          Generate brand identity and preview it instantly on an interactive 3D apparel model.
        </p>
        <div className="modeSwitch" role="tablist" aria-label="User type">
          {Object.entries(MODE_CONFIG).map(([modeKey, config]) => (
            <button
              key={modeKey}
              type="button"
              role="tab"
              aria-selected={userMode === modeKey}
              className={`modePill ${userMode === modeKey ? "active" : ""}`}
              onClick={() => setUserMode(modeKey)}
            >
              {config.label}
            </button>
          ))}
        </div>
        <p className="modeSummary">{modeInfo.summary}</p>
      </header>

      <section className="grid">
        <IdeaForm
          userMode={userMode}
          idea={idea}
          setIdea={setIdea}
          direction={direction}
          setDirection={setDirection}
          mockupType={mockupType}
          setMockupType={setMockupType}
          onGenerate={handleGenerate}
          loading={loading}
        />

        {canEdit ? (
          <BrandingDetails
            userMode={userMode}
            branding={branding}
            setBranding={setBranding}
            logoImage={logoImage}
            onLogoUpload={handleLogoUpload}
            clearLogo={() => setLogoImage("")}
            itemColor={itemColor}
            setItemColor={setItemColor}
          />
        ) : (
          <section className="panel placeholder">
            <h2>Branding Output</h2>
            <p className="muted">
              Generate once to unlock editable brand fields for {modeInfo.label} mode.
            </p>
          </section>
        )}
      </section>

      {error ? <p className="error">{error}</p> : null}

      <Suspense fallback={<section className="canvasPanel panel">Loading 3D preview...</section>}>
        <ShirtCanvas
          userMode={userMode}
          branding={branding}
          mockupType={mockupType}
          logoImage={logoImage}
          itemColor={itemColor}
        />
      </Suspense>
    </main>
  );
}
