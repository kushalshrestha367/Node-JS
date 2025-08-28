const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage } = require("../controllers/authController");

const router = require("express").Router()


//restful api
router.route('/register').post(handleRegister).get(renderRegisterPage)
router.route('/login').post(handleLogin).get(renderLoginPage)







module.exports = router;