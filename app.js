//express import gareko
const express = require('express')
const { users } = require('./model/index')
//mathi ko call gareko
const app = express()
const bcrypt = require('bcrypt')
const { where } = require('sequelize')

require('./model/index')

//const app = require('express')()

//templating engine  frontend ko UI engine   ejs use vako cha k env chaiyeko sabaiset garde
app.set('view engine', 'ejs')
//parsing data
app.use(express.urlencoded({extended : true})) //ssr
app.use(express.json()) // external like react vuejs

app.get('/', (req,res) =>{
    // res.send("<h1>This is home page</h1>")  
    const name = "kushal"
    const address ="biratnagar"
    //store data be on object
    // res.render('home.ejs', {data: surName, address})
    res.render('home.ejs', { name, address})
})
//anonumous function
 app.get('/about', (req, res) => {
    res.send("<h1>This is about page</h2>")
 })
//rest api
app.get('/register',(req,res) => {
    res.render('auth/register.ejs')
})

app.get('/login', (req,res) => {
    res.render('auth/login.ejs')
})
//api  restful   controller
app.post('/register', async(req,res) =>{
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
res.send("Register successfull")
})

//login api
app.post('/login', async(req,res) => {
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
    res.send("Loggin Success")
}
else{
    res.send("Invalid password")
}}
else{
    res.send("No user with that email or password")
}
})





//giving accesst to css 
// app.use(express.static('public/css/'))
app.use(express.static('public/css/'))



//listen le two ota magcha port no ra call back function
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Project is started at port ${PORT}`)
})


//