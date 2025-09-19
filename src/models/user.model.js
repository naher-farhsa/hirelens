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

userSchema.pre("remove", async function (next) {
  const Resumes = require("./resume.model");
  await Resumes.deleteMany({ user: this._id });
  next();
});

const userModel= mongoose.model("User",userSchema)

module.exports=userModel