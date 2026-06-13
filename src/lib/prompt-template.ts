export function buildPrompt(theme: string, setting: string, characterCount: number): string {
  return `Act as a world-class animation director for Pixar or Disney, specializing in non-verbal, 3D animated shorts for kids (aged 3-7). 
Write a highly detailed visual-only script based on the theme: "${theme}" and setting: "${setting}".
The story should feature approximately ${characterCount} main character(s).

CRITICAL CONSTRAINTS:
- ABSOLUTELY NO DIALOGUE OR WORDS ARE SPOKEN BY CHARACTERS. 
- You MUST introduce all characters involved at the very beginning of the script. Provide their names and brief descriptions (covering size, colors, appearance, personality, and role in the story).
- The script must be broken down into clear, chronological scenes (aim for 8-10 scenes to span 7-8 minutes of animation pacing).
- Each scene should run for approximately 40-50 seconds.
- Every scene must contain EXACTLY 8 sequential sub-scenes (animation beats) that are 5 to 6 seconds each.
- In both scenes and sub-scenes, focus heavily on:
  1. Visual Scene Description (lighting, colors, camera angles, 3D environment layout).
  2. Character Actions & Physical Gags (slapstick comedy, expressive movements, body language).
  3. Micro-Expressions (widened eyes, puffing cheeks, joyful smiles) to convey emotion without words.
  4. Editor & Animator Notes (camera pans, cuts, and suggestions for whimsical sound effects/music shifts).
- The tone must be profoundly positive, uplifting, and naturally weave in a core moral lesson that helps kids build good qualities.
- Write entirely in English.
- Make every script unique and creative — avoid generic or repetitive story beats.

TOKEN BUDGET & CONCISENESS RULES (CRITICAL TO PREVENT JSON TRUNCATION ERROR):
- To prevent the script from getting cut off mid-generation, keep all descriptions extremely brief and concise.
- Character descriptions: Maximum 15 words per character.
- Scene overview fields (visualDescription, actions, microExpressions, editorNotes): Maximum 15 words per field.
- Sub-scene fields (visualDescription, actions, microExpressions, editorNotes): Maximum 15 words per field. Use single, short sentences.
- Avoid flowery language or long preambles. Focus on clear, raw visual directions.

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "characters": [
    {
      "name": "Character Name",
      "description": "Short visual appearance, personality, and role description (max 15 words)."
    }
  ],
  "scenes": [
    {
      "number": 1,
      "title": "Scene title",
      "durationHint": "Approx 45 seconds",
      "visualDescription": "Summary of setting/lighting (max 15 words)...",
      "actions": "Overview of physical action (max 15 words)...",
      "microExpressions": "Tone and key facial expressions (max 15 words)...",
      "editorNotes": "Camera/audio concept (max 15 words)...",
      "subScenes": [
        {
          "number": 1,
          "duration": "6 seconds",
          "visualDescription": "Camera angle/close-up details (max 15 words)...",
          "actions": "Precise character movement or gag (max 15 words)...",
          "microExpressions": "Micro expression or eye dart (max 15 words)...",
          "editorNotes": "Camera cut/sound effect cue (max 15 words)..."
        }
      ]
    }
  ]
}`;
}
