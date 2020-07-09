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

const adminRoutes = require('./routes/admin');
const defaultController = require('./controllers/defaultPage');
const Orgs = require('./models/organization');

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
// expressFunction.use((request, response, next)=>{

//     console.log('request came!');
//     next();
// });
// expressFunction.use((request, respose, next)=>{

//     Orgs.findById()
// });
expressFunction.use((request, respnse, next)=>{

    Orgs.findById('5f05d08ebfd52f425b764eae')
        // .select('_id name teams')
        .then(org=>{

            request.org = org;
            // console.log(request.org);
            next();
        })
        .catch(err=>{
            console.log(err);
        });
})

//routes
expressFunction.use('/admin',adminRoutes);
expressFunction.use('/', defaultController.notFound);

mongoose.connect(MONGODB_URI)
        .then(result=>{
            
            return Orgs.findOne()
                .then(org=>{

                    if(!org){
                        const newUser = new Orgs({

                            name: 'Biddyanondo',
                            teams: [],
                            division: [],
                            zilla: [],
                            upazilla: [],
                            capacity: 100,
                            processing: 0,
                            completed: 0
                        });

                        newUser.save()
                                .then(result=>{
                                    console.log('Org has been created!');
                                });
                    }
                    const server = http.createServer(expressFunction);
                    server.listen(port=6789, hostname='localhost');
                })

        })
        .catch(err=>{
            console.log(err);
        });