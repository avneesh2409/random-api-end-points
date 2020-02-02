const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/api/get', (req, res) => {
  let url = "https://api.randomuser.me/";
  let data = ''
  fetch(url).then(res => res.json())
    .then((json) => {
      let url = "http://localhost:2002/products/post"
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json.results) })
        .then(res => {
          console.log(res)
          data = res
        }).catch(err => {
          console.log(err)
          data = err.message
        })
      res.json({
        message: res
      });

    })
    .catch(err => {
      res.json({
        message: err.message
      })
    })


});
app.post('/api/post', (req, res) => {
  console.log(req.body)
  res.json({
    message: req.headers
  })
})

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}
function requesthandler(json) {

}
function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
