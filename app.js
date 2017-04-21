// require the modules we need
// STOP: what are these modules? Use online documentation to read up on them.

var db = require('./models');
var express = require('express');
var path = require('path');
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan')

// my custom middleware
var separateRequests = function(req, res, next) {
    console.log("------------------");

    // call the next middleware in the stack
    next();
};

var myCrappyLogger = function(req, res, next) {
    console.log("Logged");
    console.log('Request URL: ', req.url);
    console.log('Request Type: ', req.method);
    console.log("");

    next();
};

var app = express();


// print --------
app.use(separateRequests);

// custom middle ware to log requests
// app.use(myCrappyLogger);

// override verb of request having ?_method=<VERB HERE>
app.use(methodOverride('_method'));

// custom middle ware to log requests (again)
// app.use(myCrappyLogger);

// this middleware is a logger, much better than my custom middle ware above.
app.use(morgan('dev'));

// this sets a static directory for the views
app.use(express.static(path.join(__dirname, 'static')));

// using the body parser module
app.use(bodyParser.urlencoded({ extended: false }));

app.use(ejsLayouts);
app.set('view engine', 'ejs');

// your routes here

app.get('/', function(req, res) {
    res.redirect('/games');
});

app.get('/games', function(req, res) {
    db.game.findAll().then(function(games) {
        res.render('games-index', { games: games });
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

app.get('/games/new', function(req, res) {
    res.render('games-new');
});

app.post('/games', function(req, res) {
    var newGame = req.body;

    var value = {
        name: newGame.name,
        description: newGame.description,
        numberOfPlayers: newGame.numberOfPlayers
    };

    // [options.logging=false]  Function
    var options = {
        logging: function() {
            console.log("we got a log!");
        }
    };

    // create(values, [options]) -> Promise.<Instance>
    db.game.create(value, options).then(function(game) {
        res.status(303).redirect('/game/' + game.name); // http://stackoverflow.com/a/4587262
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// show page
app.get('/game/:name', function(req, res) {
    var nameOfTheGame = req.params.name;

    // find one, do not create
    db.game.findOne({
        where: {
            name: nameOfTheGame
        }
    }).then(function(game) {
        if (game) {
            res.render('games-show', { game: game });
        } else {
            res.status(404).send("Doesn't exist :(");
        }
    }).catch(function(error) {
        res.status(404).send(error);
    });

    // findOrCreate(options) -> Promise.<Instance, created>
    // db.game.findOrCreate({
    //     where: {
    //         name: nameOfTheGame
    //     },
    //     defaults: {
    //         description: 'This game doesn\'t exist yet. Would you like to edit it?',
    //         numberOfPlayers: 0
    //     }
    // }).spread(function(game, wasCreated) {
    //     if (game) {
    //         res.render('games-show', { game: game });
    //     } else {
    //         res.status(404).send("Doesn't exist :(");
    //     }
    // }).catch(function(error) {
    //     res.status(404).send(error);
    // });
});

app.get('/game/:name/edit', function(req, res) {
    var nameOfTheGame = req.params.name;

    db.game.findOne({
        where: {
            name: nameOfTheGame
        }
    }).then(function(game) {
        res.render('games-edit', { game: game });
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

app.put('/game/:name', function(req, res) {
    var theNewGameData = req.body;
    var nameOfTheGame = req.params.name;

    var updateClause = {
        name: theNewGameData.name,
        description: theNewGameData.description,
        numberOfPlayers: theNewGameData.numberOfPlayers
    };

    var options = {
        where: { name: nameOfTheGame }
    };

    db.game.update(updateClause, options).spread(function(updatedCount) {
        res.redirect(303, '/game/' + theNewGameData.name);
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

app.delete('/game/:name', function(req, res) {
    var nameOfTheGame = req.params.name;

    db.game.destroy({
        where: { name: nameOfTheGame }
    }).then(function() {
        res.status(204).redirect('/games'); // http://stackoverflow.com/a/17093684
    });
});

// start the server

var port = 3000;
console.log("http://localhost:" + port);
app.listen(port);
