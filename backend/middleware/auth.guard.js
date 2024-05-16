
function isLoggedIn(req, res, next) {
  console.log(req.session, req.sessionID);
  if (req.session.email) {
    return next();
  }
  res.status(401).json({ error: 'Not logged in' });
}

module.exports = isLoggedIn;