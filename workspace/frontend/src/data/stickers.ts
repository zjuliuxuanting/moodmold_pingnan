export interface StickerDef {
  id: string;
  label: string;
  svgContent: string;
}

export interface StickerSet {
  id: string;
  name: string;
  description: string;
  stickers: StickerDef[];
}

const traditionalStickers: StickerDef[] = [
  {
    id: 'trad-knot',
    label: '中国结',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,100)">
    <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#C41E3A" stroke-width="4" rx="4"/>
    <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="#C41E3A" stroke-width="3" rx="2" transform="rotate(45)"/>
    <circle cx="0" cy="0" r="12" fill="#C41E3A"/>
    <line x1="-30" y1="0" x2="-50" y2="0" stroke="#C41E3A" stroke-width="4" stroke-linecap="round"/>
    <line x1="30" y1="0" x2="50" y2="0" stroke="#C41E3A" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="-30" x2="0" y2="-50" stroke="#C41E3A" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="30" x2="0" y2="50" stroke="#C41E3A" stroke-width="4" stroke-linecap="round"/>
    <circle cx="-50" cy="0" r="8" fill="none" stroke="#C41E3A" stroke-width="3"/>
    <circle cx="50" cy="0" r="8" fill="none" stroke="#C41E3A" stroke-width="3"/>
    <circle cx="0" cy="-50" r="8" fill="none" stroke="#C41E3A" stroke-width="3"/>
    <circle cx="0" cy="50" r="8" fill="none" stroke="#C41E3A" stroke-width="3"/>
  </g>
</svg>`,
  },
  {
    id: 'trad-cloud',
    label: '祥云',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,100)" fill="#D4A017" opacity="0.85">
    <path d="M-60,20 C-60,-20 -40,-40 -20,-40 C-10,-60 10,-60 20,-40 C30,-60 50,-60 60,-40 C80,-40 90,-20 80,0 C90,10 90,30 70,30 L-50,30 C-70,30 -70,10 -60,20Z"/>
    <path d="M-40,40 C-20,60 0,60 20,40 C30,50 40,40 30,30 L-50,30 C-60,40 -50,50 -40,40Z" opacity="0.6"/>
  </g>
</svg>`,
  },
  {
    id: 'trad-lantern',
    label: '灯笼',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,100)">
    <rect x="-3" y="-85" width="6" height="10" fill="#8B4513" rx="1"/>
    <ellipse cx="0" cy="-40" rx="35" ry="45" fill="#C41E3A" opacity="0.9"/>
    <ellipse cx="0" cy="-40" rx="22" ry="32" fill="#E83929" opacity="0.5"/>
    <rect x="-20" y="-62" width="40" height="4" fill="#D4A017" rx="2"/>
    <rect x="-20" y="-18" width="40" height="4" fill="#D4A017" rx="2"/>
    <rect x="-3" y="5" width="6" height="15" fill="#8B4513" rx="1"/>
    <path d="M-3,20 Q-30,40 -25,55" stroke="#D4A017" stroke-width="2" fill="none"/>
    <path d="M3,20 Q30,40 25,55" stroke="#D4A017" stroke-width="2" fill="none"/>
    <circle cx="-25" cy="55" r="3" fill="#C41E3A"/>
    <circle cx="25" cy="55" r="3" fill="#C41E3A"/>
  </g>
</svg>`,
  },
  {
    id: 'trad-border',
    label: '回纹边框',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g fill="none" stroke="#6B8E7F" stroke-width="3" opacity="0.7">
    <rect x="15" y="15" width="170" height="170" rx="8"/>
    <path d="M20,40 L180,40 M20,60 L180,60 M20,140 L180,140 M20,160 L180,160"/>
    <line x1="35" y1="15" x2="35" y2="25"/>
    <line x1="55" y1="15" x2="55" y2="25"/>
    <line x1="75" y1="15" x2="75" y2="25"/>
    <line x1="125" y1="15" x2="125" y2="25"/>
    <line x1="145" y1="15" x2="145" y2="25"/>
    <line x1="165" y1="15" x2="165" y2="25"/>
    <line x1="35" y1="175" x2="35" y2="185"/>
    <line x1="55" y1="175" x2="55" y2="185"/>
    <line x1="75" y1="175" x2="75" y2="185"/>
    <line x1="125" y1="175" x2="125" y2="185"/>
    <line x1="145" y1="175" x2="145" y2="185"/>
    <line x1="165" y1="175" x2="165" y2="185"/>
  </g>
</svg>`,
  },
];

const modernStickers: StickerDef[] = [
  {
    id: 'mod-flower',
    label: '花朵',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,100)">
    <circle cx="0" cy="-45" r="18" fill="#FF6B8A" opacity="0.8"/>
    <circle cx="43" cy="-14" r="18" fill="#FF6B8A" opacity="0.8"/>
    <circle cx="26" cy="36" r="18" fill="#FF6B8A" opacity="0.8"/>
    <circle cx="-26" cy="36" r="18" fill="#FF6B8A" opacity="0.8"/>
    <circle cx="-43" cy="-14" r="18" fill="#FF6B8A" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#FFD700"/>
    <circle cx="0" cy="0" r="12" fill="#FFA500"/>
  </g>
</svg>`,
  },
  {
    id: 'mod-star',
    label: '星星',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,90)" fill="#FFD700" opacity="0.9">
    <polygon points="0,-65 15,-20 62,-20 24,6 38,52 0,28 -38,52 -24,6 -62,-20 -15,-20"/>
  </g>
  <g transform="translate(40,40) scale(0.5)" fill="#FFD700" opacity="0.5">
    <polygon points="0,-65 15,-20 62,-20 24,6 38,52 0,28 -38,52 -24,6 -62,-20 -15,-20"/>
  </g>
  <g transform="translate(155,40) scale(0.5)" fill="#FFD700" opacity="0.5">
    <polygon points="0,-65 15,-20 62,-20 24,6 38,52 0,28 -38,52 -24,6 -62,-20 -15,-20"/>
  </g>
</svg>`,
  },
  {
    id: 'mod-heart',
    label: '爱心',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g transform="translate(100,90)" fill="#FF4D6D" opacity="0.85">
    <path d="M0,40 C-50,-10 -50,-55 -25,-55 C-10,-55 0,-30 0,-30 C0,-30 10,-55 25,-55 C50,-55 50,-10 0,40Z"/>
  </g>
</svg>`,
  },
  {
    id: 'mod-circle',
    label: '圆点装饰',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="transparent"/>
  <g opacity="0.7">
    <circle cx="40" cy="40" r="12" fill="#6EC6A0"/>
    <circle cx="80" cy="25" r="8" fill="#FFB347"/>
    <circle cx="130" cy="35" r="14" fill="#7EB8DA"/>
    <circle cx="170" cy="60" r="9" fill="#E8917A"/>
    <circle cx="30" cy="90" r="10" fill="#C4915C"/>
    <circle cx="75" cy="100" r="13" fill="#A4C639"/>
    <circle cx="140" cy="80" r="7" fill="#DDA0DD"/>
    <circle cx="55" cy="150" r="9" fill="#FFB347"/>
    <circle cx="120" cy="140" r="11" fill="#6EC6A0"/>
    <circle cx="165" cy="130" r="8" fill="#7EB8DA"/>
  </g>
</svg>`,
  },
];

export const stickerSets: StickerSet[] = [
  {
    id: 'heritage',
    name: '非遗传统风',
    description: '中国结 · 祥云 · 灯笼 · 回纹边框',
    stickers: traditionalStickers,
  },
  {
    id: 'modern',
    name: '清新现代风',
    description: '花朵 · 星星 · 爱心 · 圆点装饰',
    stickers: modernStickers,
  },
];

export function getStickerSet(id: string): StickerSet | undefined {
  return stickerSets.find((s) => s.id === id);
}

export function svgToDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encoded}`;
}

export function loadStickerImage(svgContent: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = svgToDataUrl(svgContent);
  });
}
