const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const userRouter = require('./routes/user');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
  

app.use('/user', userRouter);



//global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

