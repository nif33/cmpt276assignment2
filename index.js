const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');

/*var pool;
if(process.env.DATABASE_URL){
  pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
}
else{
  pool = new Pool({
    user: 'postgres'
    host: 'localhost'
    database: 'tokimon'
    password: 'password'
  });
}*/
const pool = new Pool({
  user: 'postgres'
  host: 'localhost'
  database: 'tokimon'
  password: 'password'
})
//  connectionString: process.env.DATABASE_URL
//});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/index', (req,res) => {
    var getTokimonQuery = `SELECT * FROM tokimon`;
    pool.query(getTokimonQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };
      //obj = {print: result};
      res.render('pages/index', results)
    })
  })
  .get('/db', async(req,res)=>{
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM tokimon')
    const results = {'rows': result.rows };
    res.render('pages/db', results)
    client.release();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
