
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be Logged In');
        return res.redirect('/login')
    }
    next()
}


module.exports.isAuthor = async (req, res, next) => {
    const sql = "SELECT * FROM note WHERE noteid = '" + req.params.id + "'"
    db.query(sql, (err, rows) => {
      if (rows[0].authorID !== (req.user.userid)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/notes/${req.params.id}`)
      }
    })
    next();
}

