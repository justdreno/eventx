#!/bin/bash
set -e

echo "=== EventX Fresh Start ==="

echo "[1/5] Installing dependencies..."
npm install

echo "[2/5] Generating Prisma client..."
npx prisma generate

echo "[3/5] Pushing fresh schema..."
rm -f prisma/dev.db
npx prisma db push

echo "[4/5] Seeding database..."
npm run db:seed

echo "[5/5] Building and starting..."
npm run build
npm start
