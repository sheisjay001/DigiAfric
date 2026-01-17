/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : ""}`.trim(),
      `connect-src 'self' ${isDev ? "http://localhost:3000" : "https:"}`,
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"])
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          ...(isDev
            ? []
            : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }])
        ]
      }
    ];
  }
};

module.exports = nextConfig;
