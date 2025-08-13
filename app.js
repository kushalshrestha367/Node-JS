//express import gareko
const express = require('express')
//mathi ko call gareko
const app = express()

//const app = require('express')()

//templating engine  frontend ko UI engine   ejs use vako cha k env chaiyeko sabaiset garde
app.set('view engine', 'ejs')


app.get('/', (req,res) =>{
    // res.send("<h1>This is home page</h1>")  
    const name = "kushal"
    const address ="biratnagar"
    //store data be on object
    // res.render('home.ejs', {data: surName, address})
    res.render('home.ejs', { name, address})
})
.get('/about', (req, res) => {
})
 app.get('/about', (req, res) => {
    res.send("<h1>This is about page</h2>")
 })






//listen le two ota magcha port no ra call back function
app.listen(3000, () => {
console.log("Project is started at port 3000")
})