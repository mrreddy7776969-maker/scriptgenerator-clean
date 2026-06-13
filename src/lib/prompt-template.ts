export function buildPrompt(theme: string, setting: string, characterCount: number): string {
  return `Act as a world-class animation director for Pixar or Disney, specializing in non-verbal, 3D animated shorts for kids (aged 3-7). 
Write a highly detailed visual-only script based on the theme: "${theme}" and setting: "${setting}".
The story should feature approximately ${characterCount} main character(s).

CRITICAL CONSTRAINTS:
- ABSOLUTELY NO DIALOGUE OR WORDS ARE SPOKEN BY CHARACTERS. 
- You MUST introduce all characters involved at the very beginning of the script. Provide their names and detailed descriptions (covering their size, colors, appearance, personality, and role in the story).
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

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "characters": [
    {
      "name": "Character Name",
      "description": "Detailed description of their visual appearance, personality traits, and key role in the story."
    }
  ],
  "scenes": [
    {
      "number": 1,
      "title": "Scene title",
      "durationHint": "Approx 45 seconds",
      "visualDescription": "Summary of the general setting, lighting, and scene atmosphere...",
      "actions": "General overview of the physical actions and main plot point in this scene...",
      "microExpressions": "Overall emotional tone and facial expression highlights for this scene...",
      "editorNotes": "General camera direction and audio/music themes for this scene...",
      "subScenes": [
        {
          "number": 1,
          "duration": "6 seconds",
          "visualDescription": "Specific details for this 5-6s beat (e.g. close-up of characters, specific layout changes)...",
          "actions": "Precise character movements, slapstick interactions, or gags occurring in these few seconds...",
          "microExpressions": "Extreme close-up micro-expressions, eye movements, or gasps for this specific beat...",
          "editorNotes": "Precise camera cut/pan, specific sound effect cues (e.g., *squeak*, *whoosh*), or musical beats..."
        }
      ]
    }
  ]
}`;
}
