
# Ghostify Tarama (Vercel + Render)

- **Serverless endpoint**: `/api/scan-email` (POST { "email": "..." })
- **Basit UI**: `/`

## Ortam Değişkenleri
- `HIBP_API_KEY`
- `LEAKCHECK_API_KEY`

## Vercel Kurulum
1) Bu repo/klasörü GitHub'a at.
2) Vercel > New Project > Import from GitHub.
3) **Environment Variables** sekmesine anahtarlarını ekle.
4) Deploy.

## Render (opsiyonel, tek Node servisi)
1) Render.com > New > Web Service > bu repo.
2) Build Command: `npm install`
3) Start Command: `npm start`
4) Env vars: yukarıdaki iki anahtar.
5) Açılan URL'de formdan test edebilirsin.

---
Hazırlandı: 2025-08-13T20:17:37.927950Z
