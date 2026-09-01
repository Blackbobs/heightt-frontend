import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateIcons() {
  const inputPath = path.join(__dirname, "..", "public", "logo.png");
  const publicDir = path.join(__dirname, "..", "public");

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
    await sharp(inputPath)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }

  // Apple touch icon
  const applePath = path.join(publicDir, "apple-touch-icon.png");
  await sharp(inputPath)
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(applePath);
  console.log(`Generated ${applePath}`);

  // Favicon
  const faviconPath = path.join(publicDir, "favicon.ico");
  // For favicon, just copy logo as 32x32 and 16x16 in one go using PNG
  // ICO format is tricky without extra libs; use PNG favicon instead
  const faviconPngPath = path.join(publicDir, "favicon.png");
  await sharp(inputPath)
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(faviconPngPath);
  console.log(`Generated ${faviconPngPath}`);

  console.log("All icons generated successfully.");
}

generateIcons().catch((err) => {
  console.error("Failed to generate icons:", err);
  process.exit(1);
});
