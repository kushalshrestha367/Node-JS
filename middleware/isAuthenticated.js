const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const { users } = require('../model');

//login cha ki xaina check garcha    aru ko ni garna milcha   
exports.isAuthenticated = async(req,res,next) => {
  const token = req.cookies.jwtToken
  console.log(token)
  if(!token || token === null || token === undefined){
    return res.redirect('/login')
  }
  //verify gareko
  const decryptedResult = await promisify(jwt.verify)(token,'nothing')
  console.log(decryptedResult)
  //primary key id sanga match vayo vane
  const data = await users.findByPk(decryptedResult.id)
  if(!data){
    return res.send("No user belong to that id")
  }  
  //req  object   naya id haleko req mah  controller mani huncha
  // req vnne obj ma naya key userId
  req.userId = decryptedResult.id
  next()
}       