"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMAIL_PASSWORD = exports.GMAIL_ID = exports.PROD_BASE_URL = exports.DEV_BASE_URL = exports.JWT_SECRET_KEY = exports.MONGO_URI = exports.PORT = void 0;
require('dotenv').config();
exports.PORT = Number(process.env.PORT || 8000);
exports.MONGO_URI = process.env.MONGO_URI || "";
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
exports.DEV_BASE_URL = `http://localhost:${exports.PORT}`;
exports.PROD_BASE_URL = '';
exports.GMAIL_ID = process.env.GMAIL_ID || "";
exports.GMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';
