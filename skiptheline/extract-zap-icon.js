const fs = require('fs');
const path = require('path');
const os = require('os');

// The Zap icon SVG content from lucide-react
const zapIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
</svg>`;

// Get desktop path
const desktopPath = path.join(os.homedir(), 'Desktop');

// Create the SVG file with the gradient background styling
const styledSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
    </linearGradient>
    <filter id="neon-glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background circle with gradient -->
  <circle cx="12" cy="12" r="10" fill="url(#neon-gradient)" filter="url(#neon-glow)"/>
  
  <!-- Zap icon -->
  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" fill="black" stroke="black" stroke-width="1"/>
</svg>`;

// Save to desktop
const outputPath = path.join(desktopPath, 'skiptheline-zap-icon.svg');

try {
  fs.writeFileSync(outputPath, styledSVG);
  console.log(`✅ Lightning icon saved to: ${outputPath}`);
  console.log('📁 You can find it on your Desktop as "skiptheline-zap-icon.svg"');
} catch (error) {
  console.error('❌ Error saving file:', error.message);
} 