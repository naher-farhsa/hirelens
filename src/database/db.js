const mongoose=require("mongoose")

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB Connection Successfull");
    })
    .catch(()=>{
        console.log("DB Connection Unsuccessful");  
    })
}

module.exports=connectDB