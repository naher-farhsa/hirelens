require("dotenv").config()
const app=require("./src/app")
const connectDB=require("./src/database/db")

connectDB()

app.listen(3222,()=>{
    console.log("Server live on port 3222");  
})