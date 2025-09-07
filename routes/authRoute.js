const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, renderForgotPasswordPage, handleForgetPassword, renderVerifyOtpPage, verifyOtp, renderResetPassword, handleResetPassword } = require("../controllers/authController");

const router = require("express").Router()


//restful api
router.route('/register').post(handleRegister).get(renderRegisterPage)
router.route('/login').post(handleLogin).get(renderLoginPage)
router.route('/home ').get(renderHomePage)
router.route('/forgotPassword').get(renderForgotPasswordPage).post(handleForgetPassword)
router.route('/verifyOtp').get(renderVerifyOtpPage)
router.route('/verifyOtp/:id').post(verifyOtp)
router.route('/resetPassword').get(renderResetPassword)
router.route("/resetPassword/:email/:otp").post(handleResetPassword)


module.exports = router;