import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../../qr_codes')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const items = [
  { file: 'qr-home.png', url: 'https://moodmold-pingnan.vercel.app/' },
  { file: 'qr-host.png', url: 'https://moodmold-pingnan.vercel.app/host' },
]

for (const item of items) {
  await QRCode.toFile(path.join(outDir, item.file), item.url, {
    width: 600,
    margin: 4,
    color: { dark: '#3E3A36', light: '#FFFFFF' },
  })
  console.log('Generated:', item.file)
}

console.log('Done. Output dir:', outDir)
