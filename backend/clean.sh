#!/bin/bash
set -e

echo "=== Cleaning EventX Database ==="

echo "[1/3] Deleting database..."
rm -f prisma/dev.db

echo "[2/3] Generating Prisma client..."
npx prisma generate

echo "[3/3] Pushing fresh schema..."
npx prisma db push

echo "Done. Database is clean."
