const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    
    password:{
        type:String,
        reqiured:true
    }
})

const userModel= mongoose.model("Users",userSchema)

module.exports=userModel