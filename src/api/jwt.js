const jwt = require('jsonwebtoken');
const decode = require('jwt-decode');
const { jwtSalt } = require('../secret.js');

exports.verify = async (req, res, next) => {
  var token = req.headers.authorization.split(' ')[1];
  if (token == 'null')
    return res.status(400).json('Empty Token');

  try {
    jwt.verify(token, jwtSalt);
    next();
  } catch (err) {
    console.log(err)
    if (err.message === 'jwt expired' || err.message === 'invalid token')
      return res.status(401).send("Invalid Token")
    else
      return res.status(500).send("Server Error")
  }
};

exports.GetUserID = (token) => {
  try {
    let id = decode(token).id;
    return id;
  }
  catch (err) {
    console.log(err);
  }
  return "myid";
};

exports.sign = (userInfo) => {
  var option = 
  {
    expiresIn: '1h',
    issuer: 'taxipool_admin',
    subject: 'taxipool_user'
  };

  return jwt.sign(userInfo, jwtSalt, option);
};