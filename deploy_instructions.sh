#!/bin/bash
# Deploy instructions for GitHub Pages

echo "1. สร้าง repo ใหม่บน GitHub แล้วคัดลอก URL ของ repo"
echo "2. รันคำสั่งต่อไปนี้ในโฟลเดอร์ D:/Project web"
echo "   git init"
echo "   git add index.html styles.css script.js README.md"
echo "   git commit -m 'Initial deploy to GitHub Pages'"
echo "   git branch -M main"
echo "   git remote add origin <YOUR_REPOSITORY_URL>"
echo "   git push -u origin main"
echo "3. เปิด repo บน GitHub แล้วไปที่ Settings > Pages"
echo "4. เลือก branch main และ folder / (root), แล้วกด Save"
echo "5. รอ 1-2 นาที แล้วหน้าเว็บจะถูกเผยแพร่"
