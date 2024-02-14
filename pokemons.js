const express = require('express');
const morgan = require('morgan');

// Importation du module swagger-ui-express
const swaggerUi = require('swagger-ui-express');
// Le fichier de documentation JSON, ajustez selon votre projet
const swaggerDocument = require('./src/config/documentation.json');

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

const pokemonsRoutes = require('./src/routes/pokemons.route'); // Assurez-vous de mettre le chemin correct

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

// Routes
// La route à utiliser pour accéder au rendu visuel de la documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/bienvenuePokemons', (req, res) => {
    res.send("<h1>Exercice formatif sur les PoKEmOnS</h1>");
});

app.use('/api/pokemons', pokemonsRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
