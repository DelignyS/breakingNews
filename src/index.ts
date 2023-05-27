import express from "express";

const app = express();

app.get('/news', (req, res, next) => {
  console.log('voici les news');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});