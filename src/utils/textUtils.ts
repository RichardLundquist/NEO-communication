/**
 * Split text into subtitle-friendly sentences
 */
export function splitIntoSubtitles(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/) // sentence boundary heuristic
    .map((s) => s.trim())
    .filter(Boolean);
}
