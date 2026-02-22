import { useMemo } from "react";

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export default function BrandingDetails({
  userMode,
  branding,
  setBranding,
  idea,
  imagePrompt,
  setImagePrompt,
  onGeneratePromptImage,
  generatingImage,
}) {
  const handleChange = (field, value) => {
    setBranding((previous) => ({ ...previous, [field]: value }));
  };

  const descriptionWords = useMemo(() => wordCount(branding.description), [branding.description]);
  const missionWords = useMemo(() => wordCount(branding.missionStatement), [branding.missionStatement]);

  return (
    <section className="panel">
      <h2>Branding Output</h2>
      <p className="muted">Edit values to update the 3D preview instantly.</p>

      <label htmlFor="brandName">Brand name</label>
      <input
        id="brandName"
        className="field"
        value={branding.name}
        onChange={(event) => handleChange("name", event.target.value)}
      />

      <label htmlFor="slogan">Slogan</label>
      <input
        id="slogan"
        className="field"
        value={branding.slogan}
        onChange={(event) => handleChange("slogan", event.target.value)}
      />

      {userMode !== "non-tech" ? (
        <>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="field"
            rows={4}
            value={branding.description}
            onChange={(event) => handleChange("description", event.target.value)}
          />

          <label htmlFor="missionStatement">Mission statement</label>
          <textarea
            id="missionStatement"
            className="field"
            rows={3}
            value={branding.missionStatement}
            onChange={(event) => handleChange("missionStatement", event.target.value)}
          />
        </>
      ) : (
        <div className="readOnlyPanel">
          <p className="hint strong">Long-form copy</p>
          <p className="hint">{branding.description || "No description generated yet."}</p>
          <p className="hint">{branding.missionStatement || "No mission statement generated yet."}</p>
        </div>
      )}

      <div className="readOnlyPanel">
        <p className="hint strong">3D Quick Edit</p>
        <p className="hint">
          Use the 3D Mockup Preview side panel to switch objects, placement, uploads, and colors.
        </p>
      </div>

      {userMode === "pro" ? (
        <>
          <label htmlFor="ideaContext">Business idea context</label>
          <textarea id="ideaContext" className="field" rows={2} value={idea} readOnly />

          <label htmlFor="imagePrompt">Image prompt (Pro)</label>
          <textarea
            id="imagePrompt"
            className="field"
            rows={3}
            value={imagePrompt}
            onChange={(event) => setImagePrompt(event.target.value)}
            placeholder="Example: Minimal geometric logo mark, navy and white, no text"
          />
          <button
            type="button"
            className="btn"
            onClick={onGeneratePromptImage}
            disabled={generatingImage || (!imagePrompt.trim() && !idea.trim())}
          >
            {generatingImage ? "Generating Image..." : "Generate Image from Prompt"}
          </button>
        </>
      ) : null}

      {userMode === "pro" ? (
        <div className="checklist">
          <p className="hint strong">Quality checks</p>
          <p className={`hint ${descriptionWords > 35 ? "warn" : ""}`}>
            Description words: {descriptionWords} / 35
          </p>
          <p className={`hint ${missionWords > 30 ? "warn" : ""}`}>
            Mission words: {missionWords} / 30
          </p>
        </div>
      ) : null}
    </section>
  );
}
