import { useMemo } from "react";

const placements = ["Front", "Back", "Left Sleeve", "Right Sleeve"];
const colorPalette = ["#f2f4f8", "#0f172a", "#1f6f8b", "#8b5e3c", "#7f1d1d", "#14532d"];

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export default function BrandingDetails({
  userMode,
  branding,
  setBranding,
  logoImage,
  onLogoUpload,
  clearLogo,
  itemColor,
  setItemColor,
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

      <label htmlFor="placement">Placement</label>
      <select
        id="placement"
        className="field"
        value={branding.placement}
        onChange={(event) => handleChange("placement", event.target.value)}
      >
        {placements.map((placement) => (
          <option key={placement} value={placement}>
            {placement}
          </option>
        ))}
      </select>

      <label htmlFor="logoUpload">Upload brand image</label>
      <input id="logoUpload" className="field" type="file" accept="image/*" onChange={onLogoUpload} />
      <p className="hint">Image is placed on side faces only: front, back, left, right.</p>
      {logoImage ? (
        <button type="button" className="btn secondaryBtn" onClick={clearLogo}>
          Remove image
        </button>
      ) : null}

      <label>Color palette</label>
      <div className="paletteRow">
        {colorPalette.map((color) => (
          <button
            key={color}
            type="button"
            className={`swatch ${itemColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Choose ${color}`}
            onClick={() => setItemColor(color)}
          />
        ))}
      </div>

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
