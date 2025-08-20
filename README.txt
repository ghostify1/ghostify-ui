GHOSTIFY – MVP v3 (Gerçek veri destekli)

MOD:
- LIVE: Vercel ortam değişkeni HIBP_API_KEY varsa, HIBP API denenir ve GERÇEK sonuç döner.
- DEMO: Anahtar yoksa / API ulaşılamazsa sahte örnek veri döner ve ekranda DEMO yazısı görünür.

KURULUM
1) Bu klasörü GitHub reposuna yükleyin.
2) Vercel > New Project > bu repo'yu import edin.
3) Project Settings > Environment Variables:
   - KEY: HIBP_API_KEY
   - VALUE: (Have I Been Pwned v3 API anahtarınız)
   - TARGET: Production ve Preview
4) Redeploy.

KULLANIM
- E-posta girin, Taramayı Başlat'a tıklayın.
- Sonuç ekranından PDF indirebilir ve silme talebi metnini kopyalayabilirsiniz.

Güvenlik
- API key istemciye asla sızdırılmaz; yalnızca /api/scan sunucu fonksiyonu kullanır.
- Rate limitler için ardışık taramalarda bekleme önerilir.