export function buildPrompt(theme: string, setting: string, characterCount: number): string {
  return `Act as a world-class animation director for Pixar or Disney, specializing in non-verbal, 3D animated shorts for kids (aged 3-7). 
Write a highly detailed visual-only script for a 7-8 minute video based on the theme: ${theme} and setting: ${setting}.
The story should feature approximately ${characterCount} main character(s).

CRITICAL CONSTRAINTS:
- ABSOLUTELY NO DIALOGUE OR WORDS ARE SPOKEN BY CHARACTERS. 
- The script must be broken down into clear, chronological scenes (aim for 10-12 scenes to span 7-8 minutes of animation pacing).
- Each scene must heavily focus on:
  1. Visual Scene Description (lighting, colors, 3D environment layout).
  2. Character Actions & Physical Gags (slapstick comedy, expressive movements, body language).
  3. Micro-Expressions (widened eyes, puffing cheeks, joyful smiles) to convey emotion without words.
  4. Editor & Animator Notes (camera angles, pans, cuts, and suggestions for whimsical sound effects/music shifts).
- The tone must be profoundly positive, uplifting, and naturally weave in a core moral lesson that helps kids build good qualities.
- Write entirely in English.
- Make every script unique and creative — avoid generic or repetitive story beats.

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "scenes": [
    {
      "number": 1,
      "title": "Scene title",
      "visualDescription": "Detailed visual description...",
      "actions": "Character actions and physical gags...",
      "microExpressions": "Facial expressions and body language...",
      "editorNotes": "Camera angles, cuts, sound/music notes...",
      "durationHint": "Approx 40 seconds"
    }
  ]
}`;
}
