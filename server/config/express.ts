import {Request, Response} from 'express';
import {config} from './index';
import {wrap} from './socket.io';
import {authorize as passSocketIOAuth} from 'passport.socketio';
import {createServer} from 'http';
import express = require('express');
import cookieParser = require('cookie-parser');
import compression = require('compression');
import bodyParser = require('body-parser');
import session = require('express-session');
import connectMongo = require('connect-mongo');
import serveStatic = require('serve-static');
import passport = require('passport');
// import csrf = require('csurf');
import winston = require('winston');
import socket_io = require('socket.io');


let expressApp = express();
export var server = createServer(expressApp);
export var io = socket_io(server);
export var app = wrap(expressApp, io);

let MongoStore = connectMongo(session);
let cookieParserM = cookieParser();

let sessionOptions = {
    secret: 'TODO: handle session secret with a better solution',
    key:    'dilia.session-id',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: config().mongodb,
        collection: 'sessions',
    })
};

// Express configuration
app.use(compression());
app.use(serveStatic('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParserM);
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Socket.io auth
io.use(passSocketIOAuth({
    cookieParser: cookieParser,
    key: sessionOptions.key,
    secret: sessionOptions.secret,
    store: sessionOptions.store,
    success: (data, accept) => {
        winston.info(`Successful connection to socket.io!`);
        accept();
    },
    fail: (data, message, error, accept) => {
        winston.info(`Failed connection to socket.io: ${message}`);
        if (error) {
            accept(new Error(message));
        }
    },
}));

// Error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
    winston.error(err);
    res.status(400);
    res.json({
        error: err.message
    });
});


// adds CSRF support
if (process.env.NODE_ENV !== 'test') {
    // app.use(csrf());
    //
    // app.use((req, res, next) => {
    //     res.locals.csrf_token = req.csrfToken();
    //     next();
    // });
}
