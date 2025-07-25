const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/db_connect');
const initRoutes = require('./routes');
const cookieparser = require('cookie-parser');

const app = express();
app.use(cookieparser());
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();

initRoutes(app);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});