#!/usr/bin/env bash
echo "========================================================"
echo "  SIMPUS PUSKESMAS JURUMUDI BARU - LOCAL RUNNER"
echo "========================================================"
echo ""

# 1. Cek Node.js
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js belum terinstall di komputer Anda!"
    echo "Silakan install Node.js versi LTS di https://nodejs.org/"
    exit 1
fi

echo "[1/3] Node.js terdeteksi: $(node -v)"

# 2. Cek node_modules
if [ ! -d "node_modules" ]; then
    echo "[2/3] Menginstall dependencies (npm install)..."
    npm install
else
    echo "[2/3] Folder dependencies (node_modules) sudah siap."
fi

echo ""
echo "[3/3] Menjalankan server SIMPUS di http://localhost:3000 ..."
echo "Tekan Ctrl+C untuk menghentikan aplikasi."
echo ""

# Buka browser jika tool open tersedia
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" &
elif command -v open &> /dev/null; then
    open "http://localhost:3000" &
fi

npm run dev
