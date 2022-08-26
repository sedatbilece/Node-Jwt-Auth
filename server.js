require('dotenv').config();
const express = require('express');
const app = express();

app.listen(3000);

const jwt  = require('jsonwebtoken');

app.use (express.json());    

const posts =[
    {
        id: 1,
        title: 'Post 1',
        username:'sedat',
        body: 'This is post 1'
    },
    {
        id: 2,
        title: 'Post 2',
        username:'sedat2',
        body: 'This is post 2'
    },
    {
        id: 3,
        title: 'Post 3',
        username:'sedat3',
        body: 'This is post 3'
    }
]

app.get('/posts',authenticateToken,(req,res) => {
     
    res.json(posts.filter(post => post.username==req.user.name))
})

app.post('/login',(req,res) => {
    const username = req.body.username;

    const user = { name:username };

    const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
     res.json({token});
  
})

//its a middleware function
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);  //unauthorized

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err) return res.sendStatus(403); //forbidden
        req.user = user;
        next();
    } )

}