const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor } = require('../middle')



// form for note creation
router.get('/create', isLoggedIn, (req, res) => {
  res.render('notes/create')
})

// creating note
router.post('/',isLoggedIn, async (req, res) => {
  let note = { heading: req.body.heading, body: req.body.body, authorID: req.user.userid, color : req.body.ColorInput, style: req.body.style};
  const sql = 'INSERT INTO note SET ?';
  await db.query(sql, note, (err, rows) => {
    if (err)
      res.send(err);
    else
      req.flash('success', 'Successfully created a new Note!');
    res.redirect(`/notes`)
  });
})

// show page

router.get('/:id', async (req, res) => {
  let noteid = req.params.id
  const sql = 'SELECT * FROM note WHERE noteid = ?'
  await db.query(sql, noteid, (err, rows) => {
    if (!err) {
      res.render('notes/show', {
        notes: rows[0],
      })
    }
    else
      console.log(err);
  })
})

// index page
router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM note'
  await db.query(sql, (err, rows) => {
    if (!err) {
      res.render('notes/index', {
        notes: rows
      })
    }
    else
      console.log(err);
  })
})


router.get('/:id/edit', isLoggedIn, (req, res) => {
  const sql = "SELECT * FROM note WHERE noteid = '" + req.params.id + "'"
  db.query(sql, (err, rows) => {
    if (rows[0].authorID !== (req.user.userid)) {
      req.flash('error', 'You do not have permission!');
      return res.redirect(`/notes/${req.params.id}`)
    }
    else
      res.render('notes/edit', {
        notes: rows[0]
      })
  })
})

router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
  JSON.stringify(req.body.heading , req.body.body, req.body.style)
  let note = { heading: req.body.heading, body: req.body.body, authorID: req.user.userid, color : req.body.ColorInput, style:req.body.style};
  const sql = "UPDATE note SET ?  WHERE noteid = '" + req.params.id + "'"
  await db.query(sql,note, (err, rows) => {
    if (!err) {
      req.flash('success', 'Successfully update the Note!');
      res.redirect(`/notes/${req.params.id}`)
    }
    else
      console.log(err);
  });
})

router.delete('/:id', isLoggedIn, async (req, res) => {
  const sql = "DELETE FROM note WHERE noteid ='" + req.params.id + "'"
  await db.query(sql, (err, rows) => {
    if (!err) {
      req.flash('success', 'Successfully deleted the Note!');
      res.redirect('/notes')
    }
    else
      res.send(err);
  });
})


module.exports = router;