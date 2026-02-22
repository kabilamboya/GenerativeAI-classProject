const pick = (items) => items[Math.floor(Math.random() * items.length)];

const adjectives = ["Nova", "Urban", "Bright", "Bold", "Fresh", "Prime", "Aero", "Echo"];
const nouns = ["Thread", "Wear", "Lab", "Pulse", "Edge", "Collective", "Craft", "Route"];
const sloganTemplates = [
  "Built for {idea}",
  "Style that moves {idea}",
  "Wear your {idea}",
  "Designing the future of {idea}",
  "Where {idea} meets motion"
];

export function generateMockBranding(idea, direction) {
  const safeIdea = idea?.trim() || "your vision";
  const name = `${pick(adjectives)} ${pick(nouns)}`;
  const slogan = pick(sloganTemplates).replace("{idea}", safeIdea.toLowerCase());

  return {
    name,
    slogan,
    description: `A ${direction.toLowerCase()} brand focused on ${safeIdea.toLowerCase()}, combining visual identity with practical apparel storytelling.`,
    missionStatement: `Our mission is to make ${safeIdea.toLowerCase()} more accessible through expressive apparel identity and clear communication.`,
    placement: ["Front", "Back", "Left Sleeve", "Right Sleeve"][Math.floor(Math.random() * 4)],
  };
}
