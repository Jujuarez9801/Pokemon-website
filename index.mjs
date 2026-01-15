import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "justin-juarez.tech",
    user: "justinju_webuser",
    password: "CST-336",
    database: "justinju_quotes",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

//routes
// app.get('/', (req, res) => {
//    res.send('Hello Express app!')
// //    res.render('home.ejs');
// });

// app.get('/', async(req, res) => { // gets a random comic
//     // res.send('Hello Express app!')
//     let sql = `SELECT * 
//     FROM fe_comics
//     ORDER BY RAND() 
//     LIMIT 1`
//     const [rows] = await conn.query(sql);
//     res.render('home.ejs',{rows});
//  });

 app.get('/', async(req, res) => { // gets a random comic
    // res.send('Hello Express app!')
    let sql = `SELECT *
    FROM exam_monsters
    ORDER BY score DESC
    LIMIT 5`;
    const [rows] = await conn.query(sql);
    res.render('home.ejs',{rows});
 });

//  /monsters/new
app.get('/monsters/list', async(req, res) => { // gets a random comic
    // res.send('Hello Express app!')
    let sql = `SELECT *
    FROM exam_elements
    NATURAL JOIN
    exam_monsters`;

    let sql2 = `SELECT name,moveSet,firstCaught,imgName,score,description,elementName,elementId
    FROM exam_monsters
    NATURAL JOIN 
    exam_elements
    ORDER BY name ASC`;
    
    const [rows] = await conn.query(sql);
    const [rows2] = await conn.query(sql2);
    res.render('list.ejs',{rows,rows2});
 });

 app.get('/monsters/quiz', async(req, res) => { // gets a random comic
    // res.send('Hello Express app!')

    let sql = `SELECT * 
    FROM exam_monsters
    ORDER BY RAND() 
    LIMIT 1`;
    
    const [rows] = await conn.query(sql);
    res.render('quiz.ejs',{rows});
 });
 app.post('/monsters/list', async(req, res) => { // gets a random comic
    // res.send('Hello Express app!')
    let name = req.body.name;
    let moveSet = req.body.moveSet;
    let firstCaught = req.body.firstCaught;
    let description = req.body.description;
    let imgName = req.body.imgName;
    let score = req.body.score;
    let element = req.body.element;

    let sql = `INSERT INTO exam_monsters
    (name,moveSet,firstCaught,description,imgName,score,elementId)
    VALUES
    (?,?,?,?,?,?,?)
    `;
    let sqlParams = [name,moveSet,firstCaught,description,imgName,score,element];

    await conn.query(sql,sqlParams);
    res.redirect('/');
 });


app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3051, ()=>{
    console.log("Express server running")
})