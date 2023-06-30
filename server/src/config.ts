require('dotenv').config()

export const PORT:number = Number(process.env.PORT || 8000);
export const MONGO_URI:string = process.env.MONGO_URI || "";
export const JWT_SECRET_KEY:string = process.env.JWT_SECRET_KEY || "";
export const DEV_BASE_URL:string = `http://localhost:${PORT}`
export const PROD_BASE_URL:string = ''
export const GMAIL_ID:string = process.env.GMAIL_ID || ""
export const GMAIL_PASSWORD:string = process.env.GMAIL_APP_PASSWORD || ''