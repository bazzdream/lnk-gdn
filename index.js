require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const yup = require('yup');
const {Model} = require('objection')
const knex = require('knex');
const dbconf = require("./knexfile")[process.env.NODE_ENV || "development"]
const db = knex(dbconf)
const morgan = require('morgan');
const cors = require('cors');
const {nanoid} = require('nanoid');

Model.knex(db)

class Url extends Model {
    static get tableName() {
        return "urls"
    }
}

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end()
    }
    next();
}

const app = express()

app.use(ignoreFavicon)
app.use(helmet({
    contentSecurityPolicy: false,
  }))
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('./public'));

app.get('/:id', async (req, res, next) => {
    const {id: slug} = req.params;
    try {
        const url = await Url.query().select('url').where('slug', slug)

        if(url[0]) {
            res.redirect(url[0].url)
        }
        res.redirect(`/?error=slug ${slug} not found`)
    } catch (error) {
        res.redirect(`/?error=Link not found`)
    }
})

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required()
})

app.post('/url', async (req, res, next) => {
    let {slug, url} = req.body;

    try {
        if(!slug) {
            slug = nanoid(5)
        }
        slug = slug.toLowerCase(); 

        await schema.validate({
            slug,
            url
        });

        const newUrl = {
            url,
            slug,
        }
        const created = await Url.query().insert(newUrl);
        res.json(created);
    } catch (error) {
        if(error.message.startsWith('insert into')) {
            error.message = "Slug already in use. Try another one. 🍔"
        }
        next(error);
    }
});

app.use((error, req, res, next) => {
    if(error.status) {
        res.status(error.status)
    } else {
        res.status(500)
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    })
})

const port = process.env.PORT || 1337

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})
