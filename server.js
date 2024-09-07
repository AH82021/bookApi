import express from 'express'
import bodyParser  from 'body-parser'
import cors from 'cors'
import connectDB from './config/db.js'

import dotenv from 'dotenv'
import router from './routes/bookRoutes.js'

dotenv.config();

const app = express();

connectDB();

// Middleware 
app.use(bodyParser.json());
app.use(cors())

const PORT = process.env.PORT || 4000

//Routes

app.use('/api/books',router)

app.listen(PORT,()=>{
  console.log(`Server is running on prot ${PORT}`);
  
})


export default app;