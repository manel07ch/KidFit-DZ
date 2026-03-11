import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "@gradio/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ── Helper: URL → Blob ─────────────────────────────────────────────────────
async function urlToBlob(imageUrl) {
  console.log("  Fetching:", imageUrl.slice(0, 80));
  const res = await fetch(imageUrl, { headers: { "User-Agent": "KidFitDZ/1.0" } });
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${imageUrl}`);
  const buf = await res.arrayBuffer();
  const mime = res.headers.get("content-type") || "image/jpeg";
  return new Blob([buf], { type: mime });
}

// ── Helper: Base64 → Blob ✅ NEW ───────────────────────────────────────────
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

// ── POST /api/try-on ────────────────────────────────────────────────────────
app.post("/api/try-on", async (req, res) => {
  const { userImageUrl, userImageBase64, clothingImageUrl } = req.body;

  // ✅ يقبل الاثنين: URL أو Base64
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

    // 1. Fetch input images as Blobs
    console.log("Step 1: Fetching images...");

    // ✅ إذا base64 استخدمه، وإلا fetch من URL
    const userBlob = userImageBase64
      ? base64ToBlob(userImageBase64)
      : await urlToBlob(userImageUrl);

    const garmentBlob = await urlToBlob(clothingImageUrl);

    console.log(`  User image: ${userBlob.size} bytes`);
    console.log(`  Garment:    ${garmentBlob.size} bytes`);

    // 2. Connect to IDM-VTON Gradio Space
    console.log("Step 2: Connecting to IDM-VTON Space...");
    const client = await Client.connect("yisol/IDM-VTON", {
      hf_token: HF_KEY,
    });

    // 3. Call the /tryon endpoint
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
    console.log("  Raw result.data:", JSON.stringify(result?.data)?.slice(0, 200));

    const outputRaw = result?.data?.[0];
    const imageUrl = extractImageUrl(outputRaw);

    if (!imageUrl) {
      throw new Error(
        "IDM-VTON returned no image. Raw: " + JSON.stringify(result?.data)?.slice(0, 300)
      );
    }

    // 4. Fetch result image → base64
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
});

// ── GET /api/test-tryon ─────────────────────────────────────────────────────
app.get("/api/test-tryon", async (req, res) => {
  const HF_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_KEY) return res.json({ ok: false, reason: "No HF key" });

  const TEST_PERSON = "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=768&q=90";
  const TEST_GARMENT = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80";

  try {
    console.log("\n=== SMOKE TEST: calling /api/try-on ===");
    const r = await fetch(`http://localhost:${PORT}/api/try-on`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userImageUrl: TEST_PERSON, clothingImageUrl: TEST_GARMENT }),
    });
    const json = await r.json();
    if (json.success) {
      return res.json({ ok: true, imageLength: json.resultImageBase64?.length });
    } else {
      return res.json({ ok: false, error: json.error });
    }
  } catch (e) {
    return res.json({ ok: false, error: e.message });
  }
});

// ── GET /api/health ─────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hf_key: process.env.HUGGINGFACE_API_KEY ? "✅ set" : "❌ missing",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, error: "Not found" }));

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ KidFit VTON backend running on http://localhost:${PORT}`);
  console.log(`   HF Key: ${process.env.HUGGINGFACE_API_KEY ? "✅ loaded" : "❌ MISSING"}`);
  console.log(`   Test:   http://localhost:${PORT}/api/test-tryon`);
});
