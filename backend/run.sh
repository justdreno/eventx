#!/bin/bash
set -e

MODE=${1:-full}

echo "=== EventX Backend ($MODE) ==="

if [ "$MODE" = "full" ]; then
  echo "[1/5] Installing dependencies..."
  npm install

  echo "[2/5] Generating Prisma client..."
  npx prisma generate

  echo "[3/5] Pushing database schema..."
  npx prisma db push

  echo "[4/5] Seeding database..."
  npm run db:seed

  echo "[5/5] Building and starting..."
  npm run build
  npm start

elif [ "$MODE" = "update" ]; then
  echo "[1/3] Generating Prisma client..."
  npx prisma generate

  echo "[2/3] Pushing schema changes..."
  npx prisma db push

  echo "[3/3] Rebuilding and starting..."
  npm run build
  npm start

elif [ "$MODE" = "seed" ]; then
  npm run db:seed

elif [ "$MODE" = "dev" ]; then
  npx prisma generate
  npx prisma db push
  npm run dev

else
  echo "Usage: ./run.sh [full|update|seed|dev]"
  echo "  full   - First-time full setup (install, generate, push, seed, build, start)"
  echo "  update - After pulling code changes (generate, push, build, start)"
  echo "  seed   - Re-seed the database only"
  echo "  dev    - Run in development mode with nodemon"
fi
