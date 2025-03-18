const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', todoRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/todoDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.listen(5000, () => console.log('Server running on port 5000'));
