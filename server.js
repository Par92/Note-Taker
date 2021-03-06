const express = require('express');
const path = require('path');
const data = require('./db/db.json');
const fs = require('fs');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//routes html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });


//routes json
app.get('/api/notes', (req, res) => {

  res.sendFile(path.join(__dirname, "/db/db.json"));
  
  console.info(`${req.method} request received to get notes`);
});


  app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} note received`);
  
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      let data = fs.readFileSync('./db/db.json', 'utf-8')
      let parsedData = JSON.parse(data);
      parsedData.push(newNote)

      fs.writeFileSync('./db/db.json', JSON.stringify(parsedData), (err) =>
        err
        ? console.error(err)
        : console.log(
            `note has been written to JSON file`
      )
          
      );
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });


  app.delete('/api/notes/:id', (req, res) => { 
    let data = fs.readFileSync('./db/db.json', 'utf-8')
    let parsedData = JSON.parse(data);
    let id = (req.params.id).toString();

    parsedData = parsedData.filter(selected =>{
      return selected.id !=id;
    })
    
    fs.writeFileSync('./db/db.json', JSON.stringify(parsedData), (err) =>
        err
        ? console.error(err)
        : console.log(
            `note has been written to JSON file`
      ),
       res.json(parsedData)   
      );
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `));
