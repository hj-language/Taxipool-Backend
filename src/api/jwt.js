const jwt = require('jsonwebtoken');
const secretKey = require('../secret.js').secretKey;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  verify: async(token) => {
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
  }
}
