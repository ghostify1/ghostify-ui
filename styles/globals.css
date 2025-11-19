/* --- KÖK VE GENEL AYARLAR --- */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: radial-gradient(circle at top, #020b16 0, #010308 45%, #000000 100%);
  color: #def8ff;
  overflow: hidden;
}

/* Sayfa kabuğu */

.page-shell {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: transparent;
  color: #def8ff;
}

/* Matrix canvas */

.matrix-bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* Cam panel (invite + login için ortak) */

.glass-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  padding: 40px 32px 32px;
  border-radius: 24px;
  background: radial-gradient(circle at top, rgba(0, 255, 209, 0.16), rgba(0, 12, 40, 0.96));
  box-shadow:
    0 0 40px rgba(0, 255, 209, 0.12),
    0 18px 60px rgba(0, 0, 0, 0.85),
    inset 0 0 0 1px rgba(120, 255, 255, 0.18);
  border: 1px solid rgba(120, 255, 255, 0.35);
  backdrop-filter: blur(18px) saturate(130%);
}

/* Logo halkası */

.logo-ring {
  width: 128px;
  height: 128px;
  border-radius: 999px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.4), transparent 55%),
    radial-gradient(circle at 30% 130%, rgba(0, 255, 178, 0.6), transparent 55%),
    radial-gradient(circle at 65% 50%, rgba(0, 200, 255, 0.7), transparent 55%);
  box-shadow:
    0 0 45px rgba(0, 255, 204, 0.5),
    0 0 90px rgba(0, 255, 204, 0.35);
  position: relative;
}

.logo-ring::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  border: 2px solid rgba(0, 255, 204, 0.5);
  box-shadow: 0 0 26px rgba(0, 255, 204, 0.55);
  opacity: 0.9;
}

.logo-ring-inner {
  width: 84px;
  height: 84px;
  border-radius: inherit;
  background: radial-gradient(circle at 30% 0, rgba(0, 0, 0, 0.2), transparent 55%),
    radial-gradient(circle at 70% 130%, rgba(0, 255, 204, 0.35), transparent 55%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(0, 255, 255, 0.35);
}

.logo-ring img {
  width: 58px;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.85));
}

/* Ghostify yazısı */

.ghostify-wordmark {
  text-align: center;
  font-weight: 800;
  font-size: 32px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  margin-bottom: 6px;
  color: #7ff9ff;
  text-shadow:
    0 0 12px rgba(0, 255, 255, 0.7),
    0 0 24px rgba(0, 255, 209, 0.6);
}

.subheading {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-indent: 0.24em;
  text-transform: uppercase;
  color: rgba(178, 242, 255, 0.86);
  margin-bottom: 20px;
}

/* İnce çizgi + ikon satırı */

.light-divider {
  width: 100%;
  height: 1px;
  margin: 8px 0 14px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 255, 255, 0.45),
    transparent
  );
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
}

.icon-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 18px;
}

/* Başlık & metin */

.primary-title {
  text-align: center;
  font-size: 22px;
  letter-spacing: 0.16em;
  text-indent: 0.16em;
  text-transform: uppercase;
  color: #8dfcff;
  text-shadow: 0 0 14px rgba(0, 255, 255, 0.7);
}

.helper-text {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(205, 243, 255, 0.86);
}

/* Form alanları */

.field {
  width: 100%;
  margin-top: 22px;
}

.field label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
  color: rgba(180, 240, 255, 0.9);
}

.field input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 999px;
  background: radial-gradient(circle at 0 0, rgba(0, 255, 255, 0.12), rgba(3, 15, 32, 0.95));
  border: 1px solid rgba(110, 230, 255, 0.45);
  color: #e6fbff;
  font-size: 14px;
  outline: none;
  box-shadow:
    0 0 20px rgba(0, 255, 255, 0.1),
    inset 0 0 0 0 rgba(0, 255, 255, 0.2);
  transition:
    box-shadow 220ms ease,
    border-color 220ms ease,
    background 220ms ease,
    transform 220ms ease;
}

.field input::placeholder {
  color: rgba(180, 230, 255, 0.7);
}

.field input:focus {
  border-color: rgba(144, 255, 255, 0.9);
  box-shadow:
    0 0 28px rgba(0, 255, 255, 0.4),
    0 0 62px rgba(0, 255, 209, 0.3);
  transform: translateY(-1px);
}

/* Ana buton */

.primary-button {
  margin-top: 26px;
  width: 100%;
  padding: 13px 18px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  background: radial-gradient(circle at 0% 0%, #26f8ff, #00b7ff 40%, #0066ff 100%);
  color: #001322;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-indent: 0.18em;
  text-transform: uppercase;
  font-size: 13px;
  box-shadow:
    0 0 24px rgba(0, 230, 255, 0.8),
    0 8px 40px rgba(0, 0, 0, 0.7);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    filter 160ms ease;
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 32px rgba(0, 255, 255, 0.9),
    0 14px 48px rgba(0, 0, 0, 0.85);
  filter: brightness(1.08);
}

.primary-button:active {
  transform: translateY(0);
  box-shadow:
    0 0 14px rgba(0, 255, 255, 0.7),
    0 6px 20px rgba(0, 0, 0, 0.85);
}

/* Alt linkler */

.secondary-link {
  margin-top: 20px;
  font-size: 12px;
  text-align: center;
  color: rgba(190, 240, 255, 0.78);
}

.secondary-link a {
  color: #79f4ff;
  text-decoration: none;
}

.secondary-link a:hover {
  text-decoration: underline;
}

/* Login sayfası ekleri */

.login-page .glass-panel {
  max-width: 520px;
}

.auth-links {
  margin-top: 18px;
  font-size: 12px;
  text-align: center;
  color: rgba(185, 236, 255, 0.8);
}

.auth-links a {
  color: #8ff9ff;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}

/* Davetiye sayfası ekleri */

.invite-page .glass-panel {
  max-width: 540px;
}

.invite-page .primary-title {
  margin-top: 26px;
}

.invite-page .helper-text {
  margin-bottom: 28px;
}

/* Basit responsive */

@media (max-width: 480px) {
  .glass-panel {
    padding: 28px 18px 24px;
  }

  .ghostify-wordmark {
    font-size: 26px;
  }

  .primary-title {
    font-size: 18px;
  }

  .field input {
    font-size: 13px;
  }
}
