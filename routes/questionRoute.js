const { renderHomePage } = require("../controllers/authController")
const { renderAskQuestionPage, askQuestion } = require("../controllers/questionController")
const { isAuthenticated } = require("../middleware/isAuthenticated")

const router = require("express").Router()
//importing multer
const {multer, storage} = require('../middleware/multerConfig')
//variable banko
const upload = multer({storage : storage})
// /askquestion is api
//yo function le hamro question vanne folder ko  askQuestion ejs dekhairacha path deko ho post ma kasaile trigger garo vane yo chalaidey vanera post banako 
router.route("/askquestion").get(isAuthenticated, renderAskQuestionPage).
post(isAuthenticated, upload.single('image'),askQuestion) //yesle store garcha
    



module.exports = router