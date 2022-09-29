const express = require('express');
const path = require('path');
const fs = require('fs');

// Express values
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Pull the notes from the db
var notes = [];
fs.readFile(path.join(__dirname, 'db/db.json'), (err, data) => {
  testNotes = JSON.parse(data);
  if (testNotes.length > 0) {
    notes = testNotes;
  }
});

// Routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Add note function
app.post('/api/notes', (req, res) => {
  var newNote = req.body;
  newNote.id = notes.length +1;
  notes.push(newNote);

  fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), err => { });

  res.json(newNote);
});

// Get Notes function
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Deletion function
app.delete('/api/notes/:id', (req, res) => {
  var deletion = req.params.id
  for(var i = 0; i < notes.length; i++) {
      if(deletion == notes[i].id) {
        notes.splice(i, 1);
        break;
      }
      
  }
  fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), err => { });
  res.redirect('/notes');
});

//Confirm that the server is running 
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});