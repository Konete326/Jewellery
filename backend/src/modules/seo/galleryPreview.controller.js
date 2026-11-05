import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPreviewMetadata } from './galleryPreview.service.js';
import { injectOpenGraphMeta, generateFallbackHtml } from './galleryPreview.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../../../public');

let cachedIndexHtml = null;

function loadIndexHtml() {
  if (cachedIndexHtml && process.env.NODE_ENV === 'production') {
    return cachedIndexHtml;
  }
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    cachedIndexHtml = fs.readFileSync(indexPath, 'utf-8');
    return cachedIndexHtml;
  }
  return null;
}

export async function handleGalleryPreview(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') return next();

    const meta = await getPreviewMetadata(id, req);
    if (!meta) return next();

    const rawHtml = loadIndexHtml();
    const finalHtml = rawHtml ? injectOpenGraphMeta(rawHtml, meta) : generateFallbackHtml(meta);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.status(200).send(finalHtml);
  } catch {
    return next();
  }
}
