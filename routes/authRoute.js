const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, renderForgotPasswordPage, handleForgetPassword, renderVerifyOtpPage, verifyOtp, renderResetPassword, handleResetPassword, logout } = require("../controllers/authController");
const catchError = require("../utils/catchError");

const router = require("express").Router()


//restful api
router.route('/register').post(catchError(handleRegister)).get(renderRegisterPage)
router.route('/login').post(catchError(handleLogin)).get(renderLoginPage)
router.route('/logout').get(logout)
router.route('/home ').get(renderHomePage)
router.route('/forgotPassword').get(renderForgotPasswordPage).post(handleForgetPassword)
router.route('/verifyOtp').get(renderVerifyOtpPage)
router.route('/verifyOtp/:id').post(verifyOtp)
router.route('/resetPassword').get(renderResetPassword)
router.route("/resetPassword/:email/:otp").post(handleResetPassword)



module.exports = router;