'use strict';
// Dependecies (express, cors, dotenv)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

/********************** routes *************************/






/********************** Error *************************/
app.use('/', (request, response) => {
  response.status(200).send('server working');
});
app.use((error,request,response) => {
  response.status(500).send(error);
});

app.listen(PORT, () => console.log(`server up on PORT ${PORT}`));
