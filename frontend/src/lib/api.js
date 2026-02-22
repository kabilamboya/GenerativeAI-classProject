import { generateMockBranding } from "./mockBranding";

export async function generateBranding({ idea, direction }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return generateMockBranding(idea, direction);
  }

  const response = await fetch(`${baseUrl}/api/branding/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, direction }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to generate branding");
  }

  return response.json();
}

function fallbackPromptImage(prompt) {
  const safe = (prompt || "Brand Logo").slice(0, 44);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#e8f3ff'/><stop offset='100%' stop-color='#f8fff4'/></linearGradient></defs>
    <rect width='1024' height='1024' fill='url(#g)'/>
    <circle cx='512' cy='460' r='230' fill='#1f6f8b' opacity='0.16'/>
    <rect x='322' y='272' width='380' height='380' rx='58' fill='#1f6f8b' opacity='0.25'/>
    <text x='512' y='760' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='46' fill='#173046'>${safe}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function generateBrandImage({ prompt }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { imageDataUrl: fallbackPromptImage(prompt) };
  }

  const response = await fetch(`${baseUrl}/api/branding/generate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to generate brand image");
  }

  return response.json();
}

