const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

express()
  .use(express.static(path.join(__dirname, 'public')))

  .use(express.json())
  .use(express.urlencoded({ extended: false }))

  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/tokidex', async (req, res) => res.render('pages/tokidex', results ))
  .post('/tokidex', async(req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM tokimon');
    const results = { 'results': (result) ? result.rows : null};
  //  res.render('pages/tokidex', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
  .get('/delete', (req, res) => res.render('pages/delete'))
  .post('/delete', async (req, res) => {
  const client = await pool.connect();
  await client.query('DELETE FROM tokimon WHERE name = $1', [req.body.name], function(err, result) {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });
  client.release();
})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
