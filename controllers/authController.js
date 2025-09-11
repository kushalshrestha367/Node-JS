const { users, questions } = require("../model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");

//register rendering page
exports.renderHomePage = async(req,res) =>{
//question sabai find gareko data find gareko questions vanne table cha 
//flash show gareko login garera
const [success] = req.flash('success')
const data = await questions.findAll(
    {
        //joint gareko users vanne table   jaba question vanne table users sanga joint vako huncha foreign key
        include:[{
           model: users,
           attributes: ["username"]
                }
        ]
    }
); //findAll gives array
//additional data pass data vanne key ma mathi ko key pass gareko object pass garnu parcha
//yeti garepaxi home.ejs ma loop garna paye
//success vane mathi ko array ya haleko  pass gareko home mah
res.render('home.ejs',{data,success})   
}

exports.renderRegisterPage = (req,res) =>{
    res.render('auth/register.ejs') 
}
//flash redirect here from handlelogin
exports.renderLoginPage = (req,res) => {
    //message show here
    const [error]  = req.flash('error')
    const [success] = req.flash('success')
    res.render('auth/login.ejs',{error,success}) 
}

exports.handleRegister = async(req,res) =>{
    //destructure   
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.send("please provide detail")
    }
    //method  accept object
     await sendEmail({
        email: email,
        subject: "Welcome to project",
        text: "Thank You For Registering"
    })
    await users.create({
        username    ,
        email,
        password: bcrypt.hashSync(password,10)
        // password: password
    })
    
res.redirect('/login')
}

//handle login
exports.handleLogin = async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.send("please provide your login")    
    }
//check email
const [data]= await users.findAll({
    where:{
        email: email,
    }
})
if(data){
const isMatched = bcrypt.compareSync(password, data.password)
if(isMatched){
    //hiding user ko id k cha tyo lukako id vanne key ma email ko id user ko
    //token create gareko
    const token = jwt.sign({id: data.id},"nothing",{
        expiresIn: '30d'
    })
    console.log(token);
    //to store on cookies take 2 argument first name second value
    res.cookie('jwtToken',token)
     req.flash('success',"Login Successfully")
    res.redirect('/home')
    
    // res.send("Loggin Success")
}
else{
    req.flash('error', "Invalid Password")
    res.redirect('/login')
}}
else{
    req.flash('error',"No user with that email")
    res.redirect('/login')
}
}

//forget password  ui
exports.renderForgotPasswordPage = (req,res) => {
    res.render('./auth/forgetPassword.ejs')
}
//handling above Ui
exports.handleForgetPassword = async(req,res) => {
    const {email} = req.body
//finding user
    const data = await users.findAll({
        where:{
            email : email
        }
    })
    if(data.length === 0) return res.send("No user register with that email")
    const otp = Math.floor(Math.random() * 1000) + 9999

    //sending opt to above incoming email   sendmail my data pathako
    await sendEmail({
        email: email,
        subject: "Your reset password OTP",
        text: `Your OTP is ${otp}`
    })
    //otp pathako
    data[0].otp = otp;
    data[0].otpGeneratedTime = Date.now()
    //storing otp
    await data[0].save()

    res.redirect("/verifyOtp?email=" + email)
}
//watch opt page
exports.renderVerifyOtpPage = (req,res) => {
    //for query email
    const email = req.query.email
    res.render("./auth/verifyOtp",{email: email})
}

//verify otp
exports.verifyOtp = async(req,res) => {
    const {otp} = req.body
    const email = req.params.id     
    const data = await users.findAll({
        where: {
            otp: otp,
            email: email
        }
    })
    if(data.length === 0){
        return res.send("Invalid otp")
    }
    const currentTime = Date.now();
    const otpGeneratedTime = data[0].otpGeneratedTime;
    if(currentTime - otpGeneratedTime <= 120000){
        res.redirect(`/resetPassword?email=${email}&otp=${otp}`)
    }
    else{
        res.send('OTP expired')
    }
}

exports.renderResetPassword = async(req,res) => {
    //line 142 bata ya yeko  key name
    const {email, otp} = req.query
    if(!email || !otp){
        return res.send("Please provide email and otp in query")
    }
    res.render('./auth/resetPassword.ejs',{email,otp})
}

//reseetpasswrod
exports.handleResetPassword = async(req,res) => {
const {email, otp} = req.params
const {newPassword, confirmPassword} = req.body
if(!email || !otp || !newPassword || !confirmPassword){
    return res.send("Please provide email, otp, newPassword and Confirm password")
}
if(newPassword !== confirmPassword){
    return res.send("New Password must match confirm password")
}
//after matching above find data
const userData = await users.findAll({
    where:{
        email,
        otp
    }
})
//checking
const currentTime = Date.now()
const otpGeneratedTime = userData[0].otpGeneratedTime
if(currentTime - otpGeneratedTime <= 120000){
    //k update garne
    await users.update({
        password: bcrypt.hashSync(newPassword,10)
    },
    //kasko update garne 
    {
        where:{
            email : email
        }
    })
    res.redirect("/login")
}else{
    res.send("otp expire!!")
}}

exports.logout = (req,res) =>{
    res.clearCookie('jwtToken')
    req.flash('success',"Logout Successfully")
    res.redirect('/login')
}