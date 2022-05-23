const express = require('express');

const { PORT = 3005 } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log('Server is started at port 3005');
});
