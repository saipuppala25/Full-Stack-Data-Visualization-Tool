// Import modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Set up the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/src', (req, res) =>
    res.send('<h1>MERN Example 1: Server</h1>') // Home web page
);


// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connection with MongoDB was successful");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the process if unable to connect to MongoDB
});

// Import the model/schema
const tableSchema = require("./model");

// Create routes for database access
const router = express.Router();
app.use('/db', router);

// Route to retrieve all items
router.get('/find', async (req, res) => {
  try {
    const items = await tableSchema.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve a specific item by ID
router.get('/find/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const item = await tableSchema.findById(_id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item.toObject());
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an item by ID
router.post('/update/:id', async (req, res) => {
  const { myTitle, data } = req.body;
  try {
    const item = await tableSchema.findByIdAndUpdate(req.params.id, { title: myTitle, data: data }, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json('Item updated!');
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new item
router.post('/add', async (req, res) => {
  const { fileName, fileContent } = req.body;
  if (!fileName || !fileContent) {
    return res.status(400).json({ error: 'Invalid request. FileName and fileContent are required.' });
  }
  try {
    const newItem = new tableSchema({ title: fileName, data: fileContent });
    await newItem.save();
    res.json('New item added!');
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the app to be used in bin/www.js
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
