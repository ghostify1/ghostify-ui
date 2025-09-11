
# Ghostify V1.2 – PR1–4 Entegre Sistem

## 🚀 Hızlı Başlangıç

1. Dosyayı unzip edip terminalde klasöre girin:
```bash
cd ghostify-v1.2
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini .env.local dosyasına girin:
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_HIBP_ENDPOINT=https://example.com/hibp
```

4. Deploy etmek için:
```bash
vercel --prod
```

veya tarayıcıdan [https://vercel.com/import](https://vercel.com/import) adresine gidip .zip dosyasını yükleyin.

## ✅ Sayfa Rotaları
- `/` – Giriş Ekranı
- `/scan` – Risk Skoru & Analiz
- `/report` – PDF Oluşturucu
- `/erase` – Silme Talebi Sayfası
