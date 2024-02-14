const express = require('express');
const morgan = require('morgan');
const pokemonsRoutes = require('./src/routes/pokemons.route'); // Assurez-vous de mettre le chemin correct

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.get('/bienvenuePokemons', (req, res) => {
    res.send("<h1>Exercice formatif sur les PoKEmOnS</h1>");
});

app.use('/api/pokemons', pokemonsRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
