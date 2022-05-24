const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3005 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.listen(PORT, () => {
  console.log('Server is started at port 3005');
});
