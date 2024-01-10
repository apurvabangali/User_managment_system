const express=require ("express")
const user_route= express();
const session= require('express-session');
const config= require('../Config/config')
user_route.use(session({secret:config.sessionSecret,
   resave: false, 
   saveUninitialized: true}));
const auth=require('../middleware/auth')

user_route.set('view engine','EJS');
user_route.set('views','./View/Users');

const body_parser=require('body-parser');
user_route.use(body_parser.json());
user_route.use(body_parser.urlencoded({extended:true}));

const multer=require('multer');
const path=require('path');

user_route.use(express.static('Public'));


const storage= multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname,"../Public/userimages"))
    },
    filename:function(req,file,cb){
       const name= Date.now()+'-'+file.originalname;
       cb(null,name)
    }
});
const upload= multer({storage:storage});

const userControllers= require("../Controllers/userController")

user_route.get('/register',auth.isLogout,userControllers.loadRegister)
user_route.post('/register',upload.single('image'),userControllers.insertUser)

user_route.get('/verify',userControllers.verifyEmail)

user_route.get('/',auth.isLogout,userControllers.Loginload);
user_route.get('/login',auth.isLogout,userControllers.Loginload);

user_route.post('/login',userControllers.Loginverify);
user_route.get('/home',auth.isLogin,userControllers.LoadHome);

user_route.get('/logout',auth.isLogin,userControllers.userLogout);

user_route.get('/edit',auth.isLogin,userControllers.editProfile);
user_route.post('/edit',upload.single('image'),userControllers.updateProfile);

module.exports= user_route;