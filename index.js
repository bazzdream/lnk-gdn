const express = require('express');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const morgan = require('morgan');
const cors = require('cors');

const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))

// app.get('/url/:id', (req, res) => {
//     // TODO: get a short url by id
// })

// app.get('/:id', (req, res) => {
//     // TODO: redirect to url
// })

// app.post('/url', (req, res) => {
//     // TODO: create url
// })

const port = process.env.PORT || 1337

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})