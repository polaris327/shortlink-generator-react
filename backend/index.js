const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SERVE_HOSTNAME, SERVE_PORT } = require('../src/config.json');
const cookieSession = require('cookie-session');
const nanoid = require('nanoid'); // Generating random IDs for shorten Link.
const { v4: uuid } = require('uuid')
require('dotenv-safe').config();

// Mongoose Schema for ShortLinks collection
const ShortLinks = require('./models/ShortLinks');

// Connect to the database "shortener" on MongoDB.
const DB_HOST = process.env.DATABASE || 'mongodb://localhost:27017/shortener';
mongoose.connect(DB_HOST, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

const app = express();
// Bordy Parser for Request Body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}))


app.use(function(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  req.session.id = (req.session.id || uuid());
  res.header('Access-Control-Allow-Origin', '*');
  next(); // pass control to the next handler
});


app.get('/', (req, res) => {
  res.json({
    backend: 'ok',
    session_id: req.session.id
  })
})

app.get(
  '/api/links', 
  async (req, res, next) => {
    try {
      /**
       * Find all shortLinks
       * Furture: we can find all shortLinks using user ID after register or signup.
       * find({ user: req.query.user_id })
       */
      const links = await ShortLinks.find();
      res.status(200).json(links);
      next();
    } catch (error) {
      res.status(403).json(error);
      next();
    }
  }
);

app.post(
  '/api/links', 
  async (req, res, next)=> {
    console.log('Request >>', req.body);
    try {
      // If shortLink already exists, it will be updated with new shortID (shorten Code)
      const link = await ShortLinks.findOneAndUpdate({ originUrl: req.body.url },
        {
          $setOnInsert: {
            originUrl: req.body.url,
            shortId: nanoid(7),
          },
        },
        {
          returnOriginal: false,
          upsert: true,
        }
      );

      // If it doesn't exist, it will be created.
      if (!link) {
        const newLink = new ShortLinks({ originUrl: req.body.url, shortId: nanoid(7) });
        await newLink.save();
        return res.status(200).json(newLink);
      }
      return res.status(200).json(link);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
)

/**
 * Get the shorten link and redirect to origin url.
 * @param: code is shortId. i.e. 'KrGZJGA'
 * Note: I changed :id param to :code
 */
app.get(
  '/:code', 
  async (req, res, next)=> {
    try {
      // Find the shortLink using code of shorten link
      const link = await ShortLinks.findOne({ shortId: req.params.code });
      if (!link) {
        return res.status(404).send({ error: 'Not found!' });
      }
      // If it exists, it will redirect to origin url.
      return res.redirect(link.originUrl);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
)


app.listen(
  SERVE_PORT, 
  SERVE_HOSTNAME,
  ()=> console.log(`Shortlinks backend listening on ${SERVE_HOSTNAME}:${SERVE_PORT}!`)
)