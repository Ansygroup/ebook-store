#!/usr/bin/env node
/**
 * sync-books.mjs — ينسخ src/data/books.json إلى public/books.json
 * عشان الـ API function على Vercel يقدر يقرأ بيانات الكتب من dist/books.json
 */
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('public', { recursive: true });
copyFileSync('src/data/books.json', 'public/books.json');
console.log('✅ نسخت src/data/books.json → public/books.json');
