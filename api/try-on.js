import { Client } from "@gradio/client";

// ── Helper: URL → Blob ─────────────────────────────────────────────────────
async function urlToBlob(imageUrl) {
  console.log("  Fetching:", imageUrl.slice(0, 80));
  const res = await fetch(imageUrl, { headers: { "User-Agent": "KidFitDZ/1.0" } });
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${imageUrl}`);
  const buf = await res.arrayBuffer();
  const mime = res.headers.get("content-type") || "image/jpeg";
  return new Blob([buf], { type: mime });
}

// ── Helper: Base64 → Blob ──────────────────────────────────────────────────
function base64ToBlob(base64String) {
  const [meta, data] = base64String.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binary = Buffer.from(data, "base64");
  return new Blob([binary], { type: mime });
}

// ── Helper: extract image URL from Gradio output ──────────────────────────
function extractImageUrl(output) {
  if (!output) return null;
  if (typeof output === "string") return output;
  if (output.url) return output.url;
  if (output.path) return output.path;
  if (output.data) return extractImageUrl(output.data);
  return null;
}

export default async function handler(req, res) {
  // CORS Headers for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userImageUrl, userImageBase64, clothingImageUrl } = req.body;

  if ((!userImageUrl && !userImageBase64) || !clothingImageUrl) {
    return res.status(400).json({
      success: false,
      error: "userImageUrl or userImageBase64, and clothingImageUrl are required.",
    });
  }

  const HF_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_KEY) {
    return res.status(500).json({
      success: false,
      error: "HUGGINGFACE_API_KEY not set on server.",
    });
  }

  try {
    console.log("\n=== New Try-On Request ===");
    console.log("Step 1: Fetching images...");

    const userBlob = userImageBase64
      ? base64ToBlob(userImageBase64)
      : await urlToBlob(userImageUrl);

    const garmentBlob = await urlToBlob(clothingImageUrl);

    console.log(`  User image: ${userBlob.size} bytes`);
    console.log(`  Garment:    ${garmentBlob.size} bytes`);

    console.log("Step 2: Connecting to IDM-VTON Space...");
    const client = await Client.connect("yisol/IDM-VTON", {
      hf_token: HF_KEY,
    });

    console.log("Step 3: Submitting try-on job (this may take 30–90 seconds)...");
    const result = await client.predict("/tryon", {
      dict: { background: userBlob, layers: [], composite: null },
      garm_img: garmentBlob,
      garment_des: "clothing item",
      is_checked: true,
      is_checked_crop: true,
      denoise_steps: 30,
      seed: 42,
    });

    console.log("Step 4: Got result. Extracting image...");
    const outputRaw = result?.data?.[0];
    const imageUrl = extractImageUrl(outputRaw);

    if (!imageUrl) {
      throw new Error(
        "IDM-VTON returned no image. Raw: " + JSON.stringify(result?.data)?.slice(0, 300)
      );
    }

    console.log("Step 5: Fetching result image from:", imageUrl.slice(0, 80));
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Result image fetch failed: ${imgRes.status}`);
    const imgBuf = await imgRes.arrayBuffer();
    const base64 = Buffer.from(imgBuf).toString("base64");
    const mimeType = imgRes.headers.get("content-type") || "image/png";

    console.log("=== Try-On SUCCESS ===\n");
    return res.status(200).json({
      success: true,
      resultImageBase64: `data:${mimeType};base64,${base64}`,
    });

  } catch (err) {
    console.error("=== Try-On ERROR ===", err.message);
    return res.status(502).json({
      success: false,
      error: "Virtual try-on failed: " + err.message,
    });
  }
}
