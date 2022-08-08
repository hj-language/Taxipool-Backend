const jwt = require('jsonwebtoken');
const decode = require('jwt-decode');
const { jwtSalt } = require('../secret.js');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

exports.verify = async(token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      return TOKEN_EXPIRED;
    } else if (err.message === 'invalid token') {
      return TOKEN_INVALID;
    } else {
      return TOKEN_INVALID;
    }
  }
  return decode;
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

  return jwt.sign(userInfo, jwtSalt, option);;
};