const { questions, users } = require("../model");

exports.renderAskQuestionPage = (req,res) => {
    res.render("questions/askQuestion.ejs")
}

//api
exports.askQuestion = async(req,res) => {
    const {title, description} = req.body;
    console.log(req.body);
    console.log(req.file)
    
    const userId = req.userId;
    // const fileName = req.file;
    const fileName = req.file.filename;

    if(!title || !description){
        return res.send("Please provide tile and description")
    }
    //creating in data yo garepaxi database ma table create huncha
    await questions.create({
        title,
        description,
        image: fileName,
        userId
    })
    // res.redirect("/register")
    res.redirect("/");
}

//question herne controller
exports.getAllQuestion = async(req,res) => {
    //find gareko all question
    const data = await questions.findAll({
        //joining data  user vanne table sanga join garadincha user id laii
        include:[
            {
                model : users
            }
        ]
    })
}