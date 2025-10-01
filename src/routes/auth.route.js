const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken")
const {registerController,loginController,logoutController}=require("../controllers/auth.controller")



router.post("/register",registerController) 
router.post("/login",loginController)
router.post("/logout", logoutController)

module.exports=router