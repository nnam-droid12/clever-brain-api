const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const pg = require('pg');
const knex = require('knex')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '5697',
      database : 'smartbrain'
    }
});

db.select("*").from("users").then(data => {
   console.log(data);
});

const app = express();


const database = {
    users: [
        {
            id: "123",
            name: "john",
            email: "john@gmail.com",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "sally",
            email: "sally@gmail.com",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "987",
            hash: '',
            email: "john@gmail.com"
        }
    ]
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.json(database.users)
})

app.post('/signin', (req,res) =>{
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json('success');
        }else{
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req,res)=>{
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
        hash: hash,
        email:email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
        return trx('users')
            .returning("*")
            .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
        })
    .then(user => {
    res.json(user[0])
      })
     })
     .then(trx.commit)
     .catch(trx.rollback)
  })
   .catch(err => res.status(400).json('user alredy exist.'))
})

app.get('/profile/:id', (req, res)=>{
  const { id } = req.params;
   db.select("*").from("users").where({id})
   .then(user =>{
       if(user.length){
        res.json(user[0])
       } else{
           res.status(400).json('User not found in database.')
       }
   }).catch(err => res.status(400).json('user already exist, try with a new user!'))

})

app.put('/image', (req, res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id )
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
       res.json(entries[0]);
   }).catch(err => res.status(400).json('unable to get entries'))
})



app.listen(5000, ()=>{
    console.log('app is running on Port 5000');
});
