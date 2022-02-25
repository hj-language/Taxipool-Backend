const jwt = require('../api/jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authorization = {
  checkToken: async (req, res, next) => {
    var token = req.headers.token;

    if (!token)
      return res.status(400).json('Empty Token');

    const user = await jwt.verify(token);
    if (user === TOKEN_EXPIRED)
      return res.send('token expired');

    if (user === TOKEN_INVALID)
      return res.send('token invalid');
    next();
  }
}

module.exports = authorization;
