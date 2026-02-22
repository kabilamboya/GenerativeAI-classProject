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
