const directionLabels = {
  Bold: "Bold",
  Minimal: "Minimal",
  Modern: "Modern",
  Technical: "Technical",
};

const modeCopy = {
  "non-tech": {
    title: "Quick Brand Brief",
    subtitle: "Choose a style and generate a ready-to-edit brand concept.",
    placeholder: "",
    showChecklist: false,
  },
  tech: {
    title: "Creative Prompt",
    subtitle: "Use advanced controls and generate branding quickly.",
    placeholder: "",
    showChecklist: true,
  },
  pro: {
    title: "Prompt Lab",
    subtitle: "Provide positioning, ICP, and tone constraints for tighter outputs.",
    placeholder:
      "Example: B2B observability platform for fintech teams, tone: precise, trustworthy, modern",
    showChecklist: true,
  },
};

export default function IdeaForm({
  userMode,
  idea,
  setIdea,
  direction,
  setDirection,
  onGenerate,
  loading,
}) {
  const copy = modeCopy[userMode] || modeCopy.tech;
  const ideaCount = idea.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="panel">
      <h2>{copy.title}</h2>
      <p className="muted">{copy.subtitle}</p>

      {userMode === "pro" ? (
        <>
          <label htmlFor="idea">Business idea</label>
          <textarea
            id="idea"
            className="field"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder={copy.placeholder}
            rows={5}
          />
          <p className="hint">Idea detail: {ideaCount} words</p>
        </>
      ) : (
        <p className="hint">Business idea input is available in Pro mode only.</p>
      )}

      <label htmlFor="direction">
        {userMode === "non-tech" ? "Visual style (easy mode)" : "Brand direction"}
      </label>
      <select
        id="direction"
        className="field"
        value={direction}
        onChange={(event) => setDirection(event.target.value)}
      >
        <option value="Bold">{directionLabels.Bold}</option>
        <option value="Minimal">{directionLabels.Minimal}</option>
        <option value="Modern">{directionLabels.Modern}</option>
        <option value="Technical">{directionLabels.Technical}</option>
      </select>

      {copy.showChecklist ? (
        <div className="checklist">
          <p className="hint strong">Prompt checklist</p>
          <p className="hint">Include user type, key benefit, and brand tone.</p>
        </div>
      ) : null}

      <button
        type="button"
        className="btn"
        onClick={onGenerate}
        disabled={loading || (userMode === "pro" && !idea.trim())}
      >
        {loading ? "Generating..." : "Generate Branding"}
      </button>
    </section>
  );
}
