const User= require("../Models/userModel");
const bcrypt=require('bcrypt');

const loadLogin=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
};

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userdata=await User.findOne({email:email});
        if (userdata){
           const check=await bcrypt.compare(password,userdata.password);
           if (check) {
            if (userdata.is_admin===0) {
            res.render('login',{message:'Email and password is incorrect'})
            }else{
                req.session.user_id=userdata._id;
                res.redirect('/admin/home')
            }
           }else{
            res.render('login',{message:'Email and password is incorrect'})
           }
        }else{
            res.render('login',{message:'Email and password is incorrect'})
        }
    } catch (error) {
        console.log(error.message)
    }
}
const loadDashboard=async(req,res)=>{
    try {
        const userData= await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message)
    }
}

const logout=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
};
const adminDashboard= async(req,res)=>{
    try {
        const dashboardData= await User.find({is_admin:0});
        res.render('dashboard',{users:dashboardData})
    } catch (error) {
        console.log(error.message)
    }
}

const deleteUser=async(req,res)=>{
    try {
       const id= req.query.id;
       await User.deleteOne({_id:id});
       res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,deleteUser
}