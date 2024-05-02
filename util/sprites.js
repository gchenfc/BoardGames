/**
 * Load sprites for use in an HTML canvas.
 */

const sprites = {};

export default function createSprite(url, cb = null) {
  if (sprites[url]) {
    return sprites[url];
  }

  const img = new Image(); // Create new img element
  if (cb) {
    img.onload = cb;
  }
  img.src = url; // Set source path
  sprites[url] = img;
  return img;
}
