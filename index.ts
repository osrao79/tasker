import express, {Express,Request,Response} from 'express';
import {PORT} from '../config'
import mongoose from 'mongoose';
import connectDB from '../db';
import router from '../routes/routes';
import cookieParser from 'cookie-parser';
const cors = require('cors')
const app :Express= express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.get('/', (req:Request,res:Response)=>{
  res.send('Connected to Tasker server')
})

connectDB()

app.listen(PORT, ()=>{
  try{
    console.log(`Connected to ${PORT}`)
  }catch (err){
    console.log('Error in connection with server')
  }
})
app.use('/api/', router)