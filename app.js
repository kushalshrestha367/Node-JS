//express import gareko
const express = require('express')
const { users } = require('./model/index')
//mathi ko call gareko
const app = express()
const authRoute = require('./routes/authRoute')
const questionRoute = require('./routes/questionRoute')
const answerRoute = require('./routes/answerRoute')
const cookieparser = require('cookie-parser')
const {promisify} = require('util');
const { where } = require('sequelize')
const { renderHomePage } = require('./controllers/authController')
const jwt = require("jsonwebtoken")
// const { renderRegisterPage, renderLoginPage, handleRegister, handldeLogin, handleLogin } = require('./controllers/authController')

require('./model/index')

//const app = require('express')()

//templating engine  frontend ko UI engine   ejs use vako cha k env chaiyeko sabaiset garde
app.set('view engine', 'ejs')
//parsing data
app.use(express.urlencoded({extended : true})) //ssr
app.use(express.json()) // external like react vuejs
app.use(cookieparser())
app.use(async(req,res,next) => {
    const token = req.cookies.jwtToken;
// res.locals.token = token 
try {
    const decryptedResult = await promisify(jwt.verify)(token,'nothing')
if(decryptedResult){
    res.locals.isAuthenticated = true
}
else{
    res.locals.isAuthenticated = false
}
} catch (error) {
    res.locals.isAuthenticated = false
}
next()
})

//localhost:3000 / make full api math
app.use("/",authRoute)
app.use("/", questionRoute)
app.use('/answer',answerRoute)
//yo code every request ma trigger hunhcha

// app.get('/',(res,req) => {
//     res.render('renderHomePage')
// })
app.get('/home',renderHomePage)
// app.get('/', (req,res) =>{
//     // res.send("<h1>This is home page</h1>")  
//     // const name = "kushal"
//     // const address ="biratnagar"
//     //store data be on object
//     // res.render('home.ejs', {data: surName, address})
//     res.render('home.ejs')
// })
//anonumous function
//  app.get('/', (req, res) => {
//     res.render('home.ejs')
//  })







//giving accesst to css 
// app.use(express.static('public/css/'))
app.use(express.static('public/css/'))
app.use(express.static('./storage/'))



//listen le two ota magcha port no ra call back function
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Project is started at port ${PORT}`)
})


//