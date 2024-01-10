const express= require('express');
const admin_route= express();

const session=require('express-session');
const config= require("../Config/config");
admin_route.use(session({secret:config.sessionSecret}));

const body_parser=require('body-parser');
admin_route.use(body_parser.json());
admin_route.use(body_parser.urlencoded({extended:true,resave: false, 
    saveUninitialized: true}));

const adminController= require("../Controllers/adminController")

admin_route.set('view engine','EJS');
admin_route.set('views','./View/admin');

const auth= require('../middleware/adminauth')

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin);
admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports=admin_route;
