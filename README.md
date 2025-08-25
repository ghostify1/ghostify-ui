
# Ghostify – Product v1 (DB'li)
- Next.js 14 + Tailwind + Prisma (PostgreSQL)
- 3 ekran (landing → scan → result + PDF)
- Logo tıklanınca ana sayfa
- Build'te `prisma generate` (migration'ı lokal çalıştırın)

## ENV
- `DATABASE_URL` (Postgres)
- `LEAKCHECK_API_KEY` (isteğe bağlı)
- `HIBP_API_KEY` (isteğe bağlı)

## Migration
Lokal makinede:
```
npm i
npx prisma migrate dev --name init
```

Veya şemayı doğrudan DB'ye itmek için (geçici):
```
npx prisma db push
```
