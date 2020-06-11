//3rd party and built in packages
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
// const session = require('express-session');
const mongoose = require('mongoose');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
const flash = require('connect-flash');

const orgranizationRoutes = require('./routes/organization');
const defaultController = require('./controllers/defaultPage');

const MONGODB_URI = 'mongodb+srv://root:BLEh-1234@cluster0-5tadv.mongodb.net/covid';

const expressFunction = express();
// const sessionStore = new MongoDBStore({

//     uri: MONGODB_URI,
//     collection: 'sessions'
// });
// const csrfFunction = csrf();
expressFunction.set('view engine', 'ejs');
expressFunction.set('views', path.join(__dirname,'views'));

//middlewares
expressFunction.use(bodyParser.urlencoded({extended: false}));
expressFunction.use(express.static(path.join(__dirname, 'public')));
// expressFunction.use(session({

//     secret: 'a large string',
//     resave = false,
//     saveUninitialized: false,
//     store: sessionStore
// }));
// expressFunction.use(csrfFunction);
expressFunction.use(flash());
expressFunction.use((request, response, next)=>{

    console.log('request came!');
    next();
});
expressFunction.use(orgranizationRoutes);
expressFunction.use('/', defaultController.notFound);

mongoose.connect(MONGODB_URI)
        .then(result=>{
            const server = http.createServer(expressFunction);
            server.listen(port=6789, hostname='localhost');
        })
        .catch(err=>{
            console.log(err);
        })