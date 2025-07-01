const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor } = require('../middle');

// form for note creation
router.get('/create', isLoggedIn, (req, res) => {
  res.render('notes/create');
});

// creating note
router.post('/', isLoggedIn, (req, res) => {
  let note = {
    heading: req.body.heading,
    body: req.body.body,
    authorID: req.user.userid,
    color: req.body.ColorInput,
    style: req.body.style
  };
  const sql = 'INSERT INTO note SET ?';
  db.query(sql, note, (err, rows) => {
    if (err) {
      console.error("❌ Error inserting note:", err);
      return res.status(500).send("Database error");
    }
    req.flash('success', 'Successfully created a new Note!');
    res.redirect('/notes');
  });
});

// show page
router.get('/:id', (req, res) => {
  const noteid = req.params.id;
  const sql = 'SELECT * FROM note WHERE noteid = ?';
  db.query(sql, [noteid], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching note:", err);
      return res.status(500).send("Database error");
    }
    if (!rows.length) {
      req.flash('error', 'Note not found');
      return res.redirect('/notes');
    }
    res.render('notes/show', {
      notes: rows[0]
    });
  });
});

// index page
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM note';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error loading notes:", err);
      return res.status(500).send("Database error");
    }
    res.render('notes/index', {
      notes: rows
    });
  });
});

// edit page
router.get('/:id/edit', isLoggedIn, (req, res) => {
  const sql = 'SELECT * FROM note WHERE noteid = ?';
  db.query(sql, [req.params.id], (err, rows) => {
    if (err || !rows.length) {
      req.flash('error', 'Note not found');
      return res.redirect('/notes');
    }

    if (rows[0].authorID !== req.user.userid) {
      req.flash('error', 'You do not have permission!');
      return res.redirect(`/notes/${req.params.id}`);
    }

    res.render('notes/edit', {
      notes: rows[0]
    });
  });
});

// update note
router.put('/:id', isLoggedIn, isAuthor, (req, res) => {
  let note = {
    heading: req.body.heading,
    body: req.body.body,
    authorID: req.user.userid,
    color: req.body.ColorInput,
    style: req.body.style
  };
  const sql = 'UPDATE note SET ? WHERE noteid = ?';
  db.query(sql, [note, req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error updating note:", err);
      return res.status(500).send("Database error");
    }
    req.flash('success', 'Successfully updated the Note!');
    res.redirect(`/notes/${req.params.id}`);
  });
});

// delete note
router.delete('/:id', isLoggedIn, (req, res) => {
  const sql = 'DELETE FROM note WHERE noteid = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting note:", err);
      return res.status(500).send("Database error");
    }
    req.flash('success', 'Successfully deleted the Note!');
    res.redirect('/notes');
  });
});

module.exports = router;
