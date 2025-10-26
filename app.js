//express import gareko
const express = require('express')
const { users, answers, sequelize } = require('./model/index')
//mathi ko call gareko
const app = express()
const authRoute = require('./routes/authRoute')
const questionRoute = require('./routes/questionRoute')
const answerRoute = require('./routes/answerRoute')
const cookieparser = require('cookie-parser')
const {promisify} = require('util');
const { where, QueryTypes } = require('sequelize')
const { renderHomePage } = require('./controllers/authController')
const jwt = require("jsonwebtoken")
const session = require('express-session')
const flash = require('connect-flash')
const catchError = require('./utils/catchError')
const socketio = require('socket.io')
//ratelimit for websecurity
const rateLimit = require("express-rate-limit")
 const helmet = require("helmet")
//.env
require("dotenv").config()



// const { renderRegisterPage, renderLoginPage, handleRegister, handldeLogin, handleLogin } = require('./controllers/authController')

require('./model/index')

//const app = require('express')()

//templating engine  frontend ko UI engine   ejs use vako cha k env chaiyeko sabaiset garde
app.set('view engine', 'ejs')

//parsing data
app.use(express.urlencoded({extended : true})) //ssr
app.use(express.json()) // external like react vuejs
app.use(cookieparser())
//session login 
app.use(session({
    secret: "Nothing",
    resave: false,
    saveUninitialized: false
}))

const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit : 3,
    message : "You have reached your Limit try again after 2 min"
})
//flash
app.use(flash())
app.use("/forgotPassword",rateLimiter)
app.use(helmet())
 
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
//catch error ma arguement pathaidine
app.get('/home',catchError(renderHomePage))
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
const server = app.listen(PORT, () => {
console.log(`Project is started at port ${PORT}`)
})


//instance  oop  websocket  socket server
const io = socketio(server,{
    //object jasle ni access garna payo

    cors:{
        origin : "*"
    }
})

//take two argument if someone try to connect what to do  and take function  suniracha yesle  backend on taken incoming listen
io.on('connection',(socket)=>{
    //like singlequestionpage bata pathako
    socket.on('like',async({answerId, cookie}) => {
        //find tyo id ko answer cha nai 
     const answer = await answers.findByPk(answerId)
     if(answer && cookie){
             const decryptedResult = await promisify(jwt.verify)(cookie,'nothing')
        if(decryptedResult){
            const user = await sequelize.query(`SELECT * FROM likes_${answerId} WHERE userId=${decryptedResult.id}`,{
                type: QueryTypes.SELECT
            })
       if(user.length === 0){
         await sequelize.query(`INSERT INTO likes_${answerId} (userId) VALUES(${decryptedResult.id})`,{
            type: QueryTypes.INSERT
        })
       }
     }
        const likes = await sequelize.query(`SELECT * FROM likes_${answerId}`,{
            type: QueryTypes.SELECT
        })
        const likesCount = likes.length
        await answers.update({
            likes: likesCount
        },{
            where:{
                id: answerId
            }
        })

        socket.emit('likeUpdate',{likesCount,answerId})     
    }
    })
})

