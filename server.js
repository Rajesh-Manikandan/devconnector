const express = require('express');
const app = express();
const connectDB = require('./config/db');

//Connect to Database
connectDB();

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
