const user=require("../Models/userModel");
const bcrypt= require('bcrypt')
const nodemailer= require ('nodemailer');

const securepassword=async(password)=>{
    try {
        const hashPassword= await bcrypt.hash(password,10)
        return hashPassword;
    } catch (error) {
        console.log(error.message);
    }
}

//for sending mail:
const sendVerifyMail=async(name,email,user_id)=>{
 try {
    const transporter= nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:'apurvabangali@gmail.com',
            pass:''
        }
    });
    const mailOptions={
        from:'apurvabangali@gmail.com',
        to:email,
        subject:'For verification of mail',
        html:'<p>Hi'+name+', please click  here to <a href="http://localhost:3000/verify?id='+user_id+'"> verify </a>your email.</p>'
    }
    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error.message)
        }else{
            console.log("Email has been sent:-",info.response);
        }

    })
    
 } catch (error) {
    console.log(error.message)
 }
}


const loadRegister=async(req,res)=>{
    try{
        res.render("reg");
    }
    catch(error){
        console.log(error.message);
    }
}

const insertUser=async(req,res)=>{
    try{
        const covPassword= await securepassword(req.body.password)
        const users= new user({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:covPassword,
            is_admin:0
        });
        const userData= await users.save()
        if(userData){
            sendVerifyMail(req.body.name,req.body.email,userData._id);
           res.render('reg',{message:"Registration Complited."})
        }
        else{
            res.render('reg',{message:"Registration Failed."})
        }
    }
    catch(error){
        console.log(error.message);
    }
}

//verify mail:
const verifyEmail=async(req,res)=>{
    try {
        const updateInfo = await user.updateOne({_id:req.query.id},{$set:{is_varified:1}});
        console.log(updateInfo);
        res.render("email-verified");
    } catch (error) {
        console.log(error.message)
    }

}
//login view load
const Loginload=async(req,res)=>{
    try{
        res.render('login')
    }
    catch(error){
        console.log(error.message);
    }
}
//verify login
const Loginverify=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const UserData=  await user.findOne({email:email});

        if (UserData){
            const passwordMatch= await bcrypt.compare(password,UserData.password);
            if(passwordMatch){
               if(UserData.is_varified===0){
                  res.render('login', {message:'Please verify your mail.'})
               }else{
                  req.session.user_id=UserData._id;
                  res.redirect('/home')
               }
            }else{
              res.render('login',{message:'Login Incorrect'})
            }
        }else{
            res.render('login',{message:'Login Incorrect'})
        }
    }
    catch(error){
        console.log(error.message);
    }
}
//Load HomePage
const LoadHome=async(req,res)=>{
    try{
        const userData= await user.findById({_id:req.session.user_id})
        res.render('home',{User:userData})
    }catch(error){
        console.log(error.message)
    }
}
//For loging out
const userLogout=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
}

//edit user profile
const editProfile=async(req,res)=>{
    try {
        const id= req.query.id;
        const userdata= await user.findById({_id:id});
        if (userdata){
           res.render('edit',{User:userdata})
        }else{
            res.redirect('/home')
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile=async(req,res)=>{
    try {
        if(req.file){
              const updated=await user.findByIdAndUpdate({_id:req.body.user_id},
                {$set:{name:req.body.name,
                       email:req.body.email,
                       mobile:req.body.mno,
                       image:req.file.filename}})
        }else{
              const updated=await user.findByIdAndUpdate({_id:req.body.user_id},
                {$set:{name:req.body.name,
                       email:req.body.email,
                       mobile:req.body.mno}})
        }
        res.redirect('/home')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports= {
    loadRegister,
    insertUser,
    verifyEmail,
    Loginload,
    Loginverify,
    LoadHome,userLogout,editProfile,
    updateProfile
}