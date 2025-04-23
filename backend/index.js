require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()
const allowedOrigins = [
    'https://3000-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io'
  ];
  
  const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
app.use(cors(corsOptions))
app.options('*', cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)



connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+process.env.PORT)
    })
})
