const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/users', (req,res) => {
    var getTokimonQuery = `SELECT * FROM tokimon`;
    console.log(getTokimonQuery);
    pool.query(getTokimonQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };
      console.log(results);
      res.render('pages/tokimon', results)
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
