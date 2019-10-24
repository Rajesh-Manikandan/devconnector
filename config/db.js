const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get('mongoURI');

const connectDB = async () => {
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Connected to Database');
    })
    .catch(({ message }) => {
      console.log(
        'Failed to connect database. Process Exists. Error occured ' + message
      );
      process.exit(1);
    });
};

module.exports = connectDB;
