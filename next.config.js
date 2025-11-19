/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Production API güvenliği
  poweredByHeader: false,

  // Import alias desteği (Ghostify yapısı için şart)
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },

  // PDF, Resend, LeakCheck gibi API endpointlerinde body parser sorunlarını engeller
  api: {
    externalResolver: true,
  },

  // Resim optimizasyonu: Ghostify logosu + CDN vs.
  images: {
    domains: ["ghostifyhq.com", "resend.com", "leakcheck.io"],
    formats: ["image/avif", "image/webp"],
  },

  // Strict route handling + güvenlik
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Güvenlik header’ları
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
