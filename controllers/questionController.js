const { QueryTypes } = require("sequelize");
const { questions, users, answers, sequelize } = require("../model");

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
    res.redirect("/home");
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


exports.renderSingleQuestionPage = async(req,res) => {
    const {id} = req.params
    const data = await questions.findAll({
        //mathi bata aako ho req.params bata id chai
        where:{
            id: id
        },
    include: [{
        model: users,
        attributes: ["username"]
    }]
    })   
    let likes;
    let count = 0;
    try {
         likes = await sequelize.query(`SELECT * FROM likes_${id}`,{
        type: QueryTypes.SELECT
    })
    if(likes.length){
        count = likes.length
    }
    } catch (error) {
        console.log(error);
        
    }
   
    const answersData = await answers.findAll({
        where:{
            questionId : id
        },
        include : [{
            model:users,
            attributes : ['username']
        }]
    })
    res.render('./questions/singleQuestion',{data,answers:answersData,likes: count})
}