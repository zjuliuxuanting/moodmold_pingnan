import { svgToDataUrl } from '../data/stickers';

export interface OverlayOptions {
  stickerSize?: number;
  margin?: number;
  opacity?: number;
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url.slice(0, 50)}...`));
    img.src = url;
  });
}

export async function overlayStickerOnPhoto(
  basePhotoUrl: string,
  stickerSvg: string,
  options: OverlayOptions = {}
): Promise<string> {
  const { stickerSize = 100, margin = 16, opacity = 0.92 } = options;

  const [baseImg, stickerImg] = await Promise.all([
    loadImageFromUrl(basePhotoUrl),
    loadImageFromUrl(svgToDataUrl(stickerSvg)),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = baseImg.naturalWidth;
  canvas.height = baseImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(baseImg, 0, 0);

  const stickerW = stickerSize;
  const stickerH = (stickerImg.naturalHeight / stickerImg.naturalWidth) * stickerSize;
  const sx = canvas.width - stickerW - margin;
  const sy = canvas.height - stickerH - margin;

  ctx.globalAlpha = opacity;
  ctx.drawImage(stickerImg, sx, sy, stickerW, stickerH);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/jpeg', 0.92);
}

export async function compositeWithStickers(
  basePhotoUrl: string,
  stickerSvgs: string[],
  options: OverlayOptions = {}
): Promise<string> {
  const { stickerSize = 100, margin = 16, opacity = 0.92 } = options;

  const stickersPerRow = 3;

  const [baseImg, ...stickerImgs] = await Promise.all([
    loadImageFromUrl(basePhotoUrl),
    ...stickerSvgs.map((svg) => loadImageFromUrl(svgToDataUrl(svg))),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = baseImg.naturalWidth;
  canvas.height = baseImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(baseImg, 0, 0);

  ctx.globalAlpha = opacity;

  stickerImgs.forEach((sticker, index) => {
    const row = Math.floor(index / stickersPerRow);
    const col = index % stickersPerRow;
    const sW = stickerSize;
    const sH = (sticker.naturalHeight / sticker.naturalWidth) * stickerSize;
    const gapX = 12;
    const gapY = 12;
    const startX = margin;
    const startY = margin + 10;
    const x = startX + col * (sW + gapX);
    const y = startY + row * (sH + gapY);

    ctx.drawImage(sticker, x, y, sW, sH);
  });

  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/jpeg', 0.92);
}
