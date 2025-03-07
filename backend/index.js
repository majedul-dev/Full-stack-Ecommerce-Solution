require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()
const allowedOrigins = [
    'https://3000-mazedul956-*.gitpod.io', // Wildcard for dynamic subdomains
    'https://3000-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io' // Exact origin
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

const PORT = 8080;


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
