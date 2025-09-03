const { users, questions } = require("../model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register rendering page
exports.renderHomePage = async(req,res) =>{
//question sabai find gareko data find gareko questions vanne table cha 
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
res.render('home.ejs',{data})   
}

exports.renderRegisterPage = (req,res) =>{
    res.render('auth/register.ejs') 
}

exports.renderLoginPage = (req,res) => {
    res.render('auth/login.ejs') 
}

exports.handleRegister = async(req,res) =>{
    //destructure   
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.send("please provide detail")
    }
    //method  accept object
    await users.create({
        username    ,
        email,
        password: bcrypt.hashSync(password,10)
        // password: password
    })
res.redirect('/login')
}


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
    res.redirect('/home')
    
    // res.send("Loggin Success")
}
else{
    res.send("Invalid password")
}}
else{
    res.send("No user with that email or password")
}
}