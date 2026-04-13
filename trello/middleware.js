const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, "secretkey");
  if (decoded.userId) {
    req.userId = decoded.userId;
    next();
  } else {
    return res.status(404).json({
      message: "invalid token",
    });
  }
}
module.exports = {
  authMiddleware,
};
