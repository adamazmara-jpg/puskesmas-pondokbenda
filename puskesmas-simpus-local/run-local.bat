@echo off
title SIMPUS Puskesmas Jurumudi Baru - Local Runner
echo ========================================================
echo   SIMPUS PUSKESMAS JURUMUDI BARU - LOCAL RUNNER
echo ========================================================
echo.

:: 1. Cek Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terinstall di komputer Anda!
    echo Silakan unduh dan install Node.js versi LTS di: https://nodejs.org/
    echo Setelah install Node.js, buka kembali file ini.
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js terdeteksi. Memeriksa dependencies...
if not exist node_modules (
    echo [2/3] Menginstall dependencies (npm install)... Harap tunggu sebentar...
    call npm install
) else (
    echo [2/3] Folder dependencies sudah ada.
)

echo.
echo [3/3] Menjalankan server aplikasi SIMPUS di http://localhost:3000 ...
echo Tekan Ctrl+C di jendela ini jika ingin menghentikan server.
echo.

:: Buka browser otomatis
start "" http://localhost:3000

:: Jalankan server aplikasi
call npm run dev
pause
