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
  .get('/tokidex', (req,res) => {
    var getTokimonQuery = `SELECT * FROM tokimon`;
    pool.query(getTokimonQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };
      res.render('pages/tokidex', results)
    })
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
