require("dotenv").config()
const app=require("./src/app")
const connectDB=require("./src/database/db")

connectDB()

app.listen(process.env.PORT,()=>{
    console.log("Server live on port "+process.env.PORT);  
})