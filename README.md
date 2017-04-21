# Cruddy Board Games Database

This will expand on the [Cruddy Board Games project](https://github.com/WDI-SEA/cruddy-board-games-project). You can copy your solution into this new repository, or you can copy [this completed solution](https://github.com/Hoten/cruddy-board-games-project) and begin from there.

We will be replacing the `games.json` "database" with an actual database. We will use PostgreSQL and Sequelize.

![screenshot](screenshot.png)

## Full RESTful Routing (for reference)

<table>
<thead>
<tr>
<th>Verb</th>
<th>Path</th>
<th>Action</th>
<th>Used for</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/games</td>
<td>index</td>
<td>display a list of all games</td>
</tr>
<tr>
<td>GET</td>
<td>/games/new</td>
<td>new</td>
<td>return an HTML form for creating a new game</td>
</tr>
<tr>
<td>POST</td>
<td>/games</td>
<td>create</td>
<td>create a new game (using form data from /games/new)</td>
</tr>
<tr>
<td>GET</td>
<td>/games/:name</td>
<td>show</td>
<td>display a specific game</td>
</tr>
<tr>
<td>GET</td>
<td>/games/:name/edit</td>
<td>edit</td>
<td>return an HTML form for editing a game</td>
</tr>
<tr>
<td>PUT</td>
<td>/games/:name</td>
<td>update</td>
<td>update a specific game (using form data from /games/:name/edit)</td>
</tr>
<tr>
<td>DELETE</td>
<td>/games/:name</td>
<td>destroy</td>
<td>deletes a specific game</td>
</tr>
</tbody>
</table>

## Task

### Set up sequelize

[Refer to sequelize cheatsheet](https://docs.google.com/document/d/1FzKCeskNwSnU_wWFFXbOUt8sEMPH79mxThMln0wxFfE/)

1. Install the modules we need.

`npm install --save pg pg-hstore sequelize`

2. Create the database.

`createdb cruddy_board_games_db`

3. Initialize.

`sequelize init`

4. Configure your `config.json` file.

### Create table and model

1. Use the `sequelize` command line tool to create a `game` table in our database.

`sequelize model:create --name game --attributes ...`

What columns should be on `game`?

2. Run the migrations.

`sequelize db:migrate`

3. On the top of `app.js` file, require the models

`var db = require("./models");`

4. Delete `games.json`, `getGames()`, and `saveGames()`. Replace calls to those functions with appropriate usages of `db.game`.

Example, for the game indexing route:

```javascript
app.get('/games', function(req, res) {
    var games = getGames();

    res.render('games-index', { games: games });
});
```

turns into

```javascript
app.get('/games', function(req, res) {
    db.game.findAll().then(function(games) {
        res.render('games-index', { games: games });
    }).catch(function(error) {
        res.status(404).send(error);
    });
});
```

### Add a column

Add `numberOfPlayers` to the `game` model.

`sequelize migration:create --name add-number-of-players-to-game`

Refer to [Sequelize migration documentation](http://docs.sequelizejs.com/en/latest/docs/migrations/#functions).

Edit the new migration file `migrations/xxxxxxxxxxx-add-number-of-players-to-game.js`.

1. In the `up` function, use `addColumn`
2. In the `down` function, use `removeColumn`
3. Migrate! `sequelize db:migrate`
4. Update the model file `models/game.js`. Add the property: `numberOfPlayers: DataTypes.INTEGER`

Make sure you also update the show, new game, and edit game pages to use the new `numberOfPlayers` property.

## Licensing
All content is licensed under a CC­BY­NC­SA 4.0 license.
All software code is licensed under GNU GPLv3. For commercial use or alternative licensing, please contact legal@ga.co.
