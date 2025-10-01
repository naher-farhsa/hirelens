const mongoose=require("mongoose")

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB Connection Successfull");
    })
    .catch((err)=>{
        console.log("DB Connection Unsuccessful",err);
        process.exit(1);  
    })
}

module.exports=connectDB