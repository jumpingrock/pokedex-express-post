/**
 * ===================================
 * Configs
 * ===================================
 */
const express = require('express');
const jsonfile = require('jsonfile');
const pokedex = 'pokedex.json';
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/:id', (request, response) => {
  // get json from specified file
  jsonfile.readFile(pokedex, (err, obj) => {
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = parseInt( request.params.id );
    var pokemon;
    // find pokemon by id from the pokedex json file
    for( let i=0; i<obj.pokemon.length; i++ ){
      let currentPokemon = obj.pokemon[i];
      if( currentPokemon.id === inputId ){
        pokemon = currentPokemon;
      }
    }
    if (pokemon === undefined) {
      // send 404 back
      response.status(404);
      response.send("not found");
    } else {
      let html =
      `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <title>GA Pokedex</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
          <link href="https://fonts.googleapis.com/css?family=Thasadith" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="styles.css">
        </head>
        <body>
            <div class="container">
                    <img src=${pokemon.img}>
                    <ul>
                        <li>Number: #${pokemon.num}</li>
                        <li>Name: ${pokemon.name}</li>
                        <li>Height: ${pokemon.height}</li>
                        <li>Weight: ${pokemon.weight}</li>
                        <li>Type: ${pokemon.type}</li>
                    </ul>
                <form name="type" method="POST" action='/pokemon/${pokemon.id}''>
                    Pokemon Type: <select name='type'>
                             <option value='normal'>Normal</option>
                             <option value='fire'>Fire</option>
                             <option value='water'>Water</option>
                             <option value='electric'>Electric</option>
                             <option value='grass'>Grass</option>
                             <option value='ice'>Ice</option>
                             <option value='fighting'>Fighting</option>
                             <option value='poison'>Poison</option>
                             <option value='ground'>Ground</option>
                             <option value='flying'>Flying</option>
                             <option value='psychic'>Psychic</option>
                             <option value='bug'>Bug</option>
                             <option value='rock'>Rock</option>
                             <option value='ghost'>Ghost</option>
                             <option value='dragon'>Dragon</option>
                             <option value='dark'>Dark</option>
                             <option value='steel'>Steel</option>
                             <option value='fairy'>Fairy</option>
                             </select>
                    <input type='submit'/>
                </form>
            </div>
        </body>
        </html>`
      response.send(html);
    }
  });
});

//add pokemon types
app.post("/pokemon/:id", (request, response) => {
    jsonfile.readFile(pokedex, (err, obj) => {
        let currentPokedex = obj;
        let currentPokemon = obj.pokemon[request.params.id -1];
        currentPokemon["type"] = [];
        currentPokemon["type"].push(request.body.type);
        currentPokedex.pokemon[request.params.id -1] = currentPokemon;
        jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
            console.log(err);
            response.send(currentPokemon);
        });
    });
});

//pokemon/new
app.get("/pokemon/new", (request,response) => {
    let form = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>GA Pokedex</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
      <link href="https://fonts.googleapis.com/css?family=Thasadith" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="http://10.193.240.192:8080/style.css">
    </head>
    <body>
      <form action="/pokemon" method="POST">
          <h2 class="abc">Id</h2>
          <input type="" name="id">
          <h2>Num</h2>
          <input type="" name="num">
          <h2>Name</h2>
          <input type="" name="name">
          <h2>Img</h2>
          <input type="" name="img">
          <h2>Height</h2>
          <input type="" name="height">
          <h2>Weight</h2>
          <input type="" name="weight">
          <br><br>
          <input type="submit" class="btn btn-primary">
      </form>
    </body>
    </html>`;
    response.send(form);
});

//add new pokemon
app.post("/pokemon", (request,response) => {

    jsonfile.readFile(pokedex, (err, obj) => {
        let currentPokedex = obj;
        let newPokemon = {
          "id": currentPokedex.pokemon.length+1,
          "num": (currentPokedex.pokemon.length+1).toString(),
          "name": request.body.name,
          "img": request.body.img,
          "height": request.body.height,
          "weight": request.body.weight,
          "candy": "",
          "candy_count": "",
          "egg": "",
          "avg_spawns": "",
          "spawn_time": ""
        }
        currentPokedex.pokemon.push(newPokemon);
        jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
            console.log(err);
            response.send(newPokemon);
        });
    });
});

//homepage. display all with sort
app.get('/', (request, response) => {
    jsonfile.readFile(pokedex, (err, obj) => {
        let html =
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <title>GA Pokedex</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
          <link href="https://fonts.googleapis.com/css?family=Thasadith" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="http://10.193.240.192:8080/style.css">
        </head>
        <body>
        <div class="container">
            <form name='sortby' method="get" action="/">
            Sort By: <select name='sortby'>
                         <option value='name'>Name</option>
                         <option value='num'>Number</option>
                         <option value='height'>Height</option>
                         <option value='weight'>Weight</option>
                     </select>
            <input type='submit'/>
            </form>
            <div class="row">`;

        let sortDex = obj.pokemon;
        switch (request.query.sortby) {
            case "name":
                sortDex.sort((name1, name2) => {
                    console.log(name1.name,name2.name)
                    if (name1.name > name2.name) return 1;
                    console.log(name1.name,name2.name)
                    if (name1.name < name2.name) return -1;
                });
                break;

            case "num":
                sortDex.sort((num1, num2) => {
                    if (num1.id > num2.id) return 1;
                    if (num1.id < num2.id) return -1;
                });
                break;

            case "height":
                sortDex.sort((height1, height2) => {
                    if (parseFloat(height1.height) > parseFloat(height2.height)) return 1;
                    if (parseFloat(height1.height) < parseFloat(height2.height)) return -1;
                });
                break;

            case "weight":
                sortDex.sort((weight1, weight2) => {
                    if (parseFloat(weight1.weight) > parseFloat(weight2.weight)) return 1;
                    if (parseFloat(weight1.weight) < parseFloat(weight2.weight)) return -1;
                });
                break;
        }

        for (let i = 0; i < obj.pokemon.length; i++) {
            html = html +
                `<div class-"col">
                    <a href="http://localhost:3000/${obj.pokemon[i].id}"><img src=${obj.pokemon[i].img}></a>
                    <h3>#${obj.pokemon[i].num}</h3>
                    <h4>${obj.pokemon[i].name}</h4>
                </div>`;
        };
        html = html + "</div></div></body></html>";
        response.send(html);
    });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));