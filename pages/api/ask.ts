// pages/api/ask.ts
// All secret keys live here — never shipped to the browser.

import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit } from "../../lib/rateLimit";

// ─── Types ────────────────────────────────────────────────────────────────────

type SuccessResponse = { response: string };
type ErrorResponse = { error: string; retryAfter?: number };

// ─── Config (set these in Vercel Environment Variables) ───────────────────────

const BIBLE_API_KEY = process.env.BIBLE_API_KEY ?? "";
const BIBLE_API_URL =
  process.env.BIBLE_API_URL ??
  "https://selovapi.onrender.com/api/bibleai";

const MAX_PROMPT_LENGTH = 500;

// ─── Helper: extract a usable string from whatever the upstream API returns ───

function extractBotResponse(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.response === "string") return d.response;
    if (typeof d.message === "string") return d.message;
    if (typeof d.answer === "string") return d.answer;
  }
  return JSON.stringify(data);
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
    req.socket.remoteAddress ??
    "unknown";

  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please wait a moment.", retryAfter });
  }

  // Input validation
  const { prompt } = req.body as { prompt?: unknown };

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const trimmed = prompt.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: "Prompt cannot be empty." });
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({
      error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters.`,
    });
  }

  // Proxy to upstream Bible AI
  try {
    const url = `${BIBLE_API_URL}?prompt=${encodeURIComponent(trimmed)}&apikey=${encodeURIComponent(BIBLE_API_KEY)}`;

    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "BibleGPT/2.0",
      },
    });

    if (!upstream.ok) {
      console.error(`Upstream error: ${upstream.status} ${upstream.statusText}`);
      return res
        .status(upstream.status)
        .json({ error: "Failed to get a response from the Bible AI service." });
    }

    const data: unknown = await upstream.json();
    return res.status(200).json({ response: extractBotResponse(data) });
  } catch (err) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again." });
  }
}
