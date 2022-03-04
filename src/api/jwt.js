const jwt = require('jsonwebtoken');
const decode = require('jwt-decode');
const secretKey = require('../secret.js').secretKey;
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
  return decode(token).id;
};