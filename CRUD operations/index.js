const mongoose= require("mongoose")
mongoose.connect("mongodb+srv://apurvabangali:B%40ngo0301@cluster0.cxkngxo.mongodb.net/")

const express= require("express")
const app= express();

//for user route
const userRoute= require("./Routes/userRoutes");
app.use('/',userRoute);

//for admin route
const adminRoute= require("./Routes/adminRoute");
app.use('/admin',adminRoute);

app.listen(3000,function(){
 console.log("Server is running");
});