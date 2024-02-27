const express = require("express")
const app = express();
const connectToMongo = require("./db/db");
connectToMongo();
var cors= require('cors')
app.use(cors())
const path  =require('path')
app.use(express.json())
 const port =process.env.PORT || 5000; 
//  static files
app.use(express.static(path.join(__dirname, 'dubby', 'build')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'dubby', 'build', 'index.html'));
})
//  Available Routes
app.use('/api/auth',require("./routes/auth"))
app.use('/api/image',require("./routes/image"))
app.listen(port,()=>{
    try {
        console.log(`app are listen on http://localhost:${port}`)
    } catch (error) {
        console.log(`app not listen on port no ${port} `)
    }
})