require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()
const isProduction = process.env.NODE_ENV === 'production';

const productionOrigins = [
  'https://full-stack-ecommerce-solution-mzxrprjwh-majeduldevs-projects.vercel.app',
  'https://adminpannelclient.vercel.app'
];

const developmentOrigins = [
  'http://localhost:3000',
  'https://3000-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io',
  'https://3000-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io',
  'https://adminpannelclient.vercel.app'
];
  
  const corsOptions = {
    origin: isProduction ? productionOrigins : developmentOrigins,
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
