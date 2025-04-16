const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const path = require('path');

//Handle json data from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/sticks', (req, res) => {
  res.render('sticks', {
    title: 'Stick List',
    sticks: sticks
  });
});


let sticks = [ {
    id: 1,
    name: "Elder Stick",
    length: 150,
    category: "magic",
    inStock: true,
    releaseDate: "2022-04-01",
    tags: ["ancient", "powerful"],
    maker: { name: "Sticksmiths Inc", country: "Finland" }
  },
  {
    id: 2,
    name: "Boomstick",
    length: 140,
    category: "throwing",
    inStock: false,
    releaseDate: "2023-08-15",
    tags: ["explosive", "wild"],
    maker: { name: "Nordic Arms", country: "Norway" }
  }
];

//Get by number
app.get('/api/sticks/:id', (req, res) => {
    const id = Number(req.params.id);
    //console.log(id);
    //res.send("testing")
    const stick = sticks.find(s => s.id === id);
    if (stick) {res.json(stick);}
    else {res.status(404).json({ error: 'Not found' });}
  });
  
//Get All
app.get('/api/sticks', (req, res) => {
    //res.json(sticks);
    res.status(200).json({
        status: 'success', results: sticks.length, data: sticks
    })
  });

//Delete
app.delete('/api/sticks/:id', (req, res) => {
    const id = Number(req.params.id);
    const stick = sticks.find(s => s.id === id);
    if (stick) { 
        sticks = sticks.filter(s => s.id != id);
        res.status(200).json({
            status: 'deleted',
            id: id
          });
     }
    else {res.status(404).json({ error: 'Not found' });}
  });

//Add Create
app.post('/api/sticks', (req, res) => {

    const newId = sticks[sticks.length-1].id + 1;

    const newStick = { 
        id: newId,
        name: req.body.name,
        length: req.body.length,
        category: req.body.category,
        inStock: req.body.inStock,
        releaseDate: req.body.releaseDate,
        tags: req.body.tags,
        maker: req.body.maker,
    };
    sticks.push(newStick);
    res.status(201)
    .location(`http://localhost:5000/api/sticks/${newId}`)
    .json(newStick); 

  });

//Update
app.patch('/api/sticks/:id', (req, res) => {
    const idUpdate = Number(req.params.id);

    const stick = sticks.find(s => s.id === idUpdate);

    if (!stick) {
        return res.status(404).json({ error: 'Stick not found' });
    }

    // Update if needed
    if (req.body.name !== undefined) stick.name = req.body.name;
    if (req.body.length !== undefined) stick.length = req.body.length;
    if (req.body.category !== undefined) stick.category = req.body.category;
    if (req.body.inStock !== undefined) stick.inStock = req.body.inStock;
    if (req.body.releaseDate !== undefined) stick.releaseDate = req.body.releaseDate;
    if (req.body.tags !== undefined) stick.tags = req.body.tags;
    if (req.body.maker !== undefined) stick.maker = req.body.maker;

    res.status(200)
    .location(`http://localhost:5000/api/sticks/${idUpdate}`)
    .json({
      status: 'updated',
      stick: stick
    });
 
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
