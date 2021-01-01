// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//Returns all current Notes
app.get("/api/notes", function(req, res) {
  const allNotes = fs.readFileSync('db/db.json', 
  {encoding:'utf8', flag:'r'});
  return res.json(allNotes)
  });
  
// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var nextnoteID = 1;
  const allNotes = fs.readFileSync('db/db.json', 
  {encoding:'utf8', flag:'r'});

  let curNoteArray = JSON.parse(allNotes);

  if (curNoteArray.length !== 0) {
    nextnoteID = curNoteArray[curNoteArray.length-1].id + 1;
  }
  
  const newNotewithID = {
    id:nextnoteID,
    title:req.body.title,
    text:req.body.text
  }

  curNoteArray.push(newNotewithID);

  fs.writeFileSync("db/db.json", JSON.stringify(curNoteArray));
  res.json(newNotewithID);
});

app.delete("/api/notes/:noteid", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var deletedNoteID = req.params.noteid; 

  const allNotes = fs.readFileSync('db/db.json', 
  {encoding:'utf8', flag:'r'});

  let curNoteArray = JSON.parse(allNotes);

  var result = curNoteArray.find(obj => {
    return obj.id == deletedNoteID
  });

  const index = curNoteArray.indexOf(result);

  if (index > -1) {
    curNoteArray.splice(index, 1);
  }

  fs.writeFileSync("db/db.json", JSON.stringify(curNoteArray));

  res.json(curNoteArray);

});
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
