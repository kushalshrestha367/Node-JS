const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage } = require("../controllers/authController");

const router = require("express").Router()


//restful api
router.route('/register').post(handleRegister).get(renderRegisterPage)
router.route('/login').post(handleLogin).get(renderLoginPage)
router.route('/home ').get(renderHomePage)







module.exports = router;