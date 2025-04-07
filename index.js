const express = require('express');
const { resolve } = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./schema');
const app = express();
dotenv.config();

const port = process.env.PORT || 3010;

app.use(express.static('static'));
app.use(express.json());

mongoose 
.connect(process.env.MONGO_URI)
.then(()=>  console.log("✔️MongoDB connection Successful!"))
.catch((err)=> console.error("❌ Failed to connect!!",err));


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users',async(req,res)=>{
  try{
    const {name,email,password} = req.body;
    const user = new User({name,email,password})
    await user.validate();
    await user.save();
    return res.status(201).json({message:"User Creation Successful!"})
  }
  catch(error){
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation error: ${error.message}` });
    }
    return res.status(500).json({ error: "Error Creating User!" });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
