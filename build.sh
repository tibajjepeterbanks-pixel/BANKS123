#!/bin/bash
set -e
cd unipast-nextjs
npm ci
npx prisma generate
npm run build
