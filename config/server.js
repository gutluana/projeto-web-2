const express = require('express');
const app = express();
require("dotenv/config");
const port = process.env.PORT || 4000;


app.use(express.urlencoded({extended:true}))
app.use(express.json());

// app.set("view engine", "ejs");
// app.set("views", __dirname + "/app/views");
// app.set("layout", "layouts/layout");

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

module.exports = app;