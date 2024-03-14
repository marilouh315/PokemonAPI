const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// Importation du module swagger-ui-express
const swaggerUi = require('swagger-ui-express');
// Le fichier de documentation JSON, ajustez selon votre projet
const swaggerDocument = require('./src/config/documentation.json');

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};



app.use(morgan('dev'));
app.use(express.json());

// Routes DOCUMENTATION : La route à utiliser pour accéder au rendu visuel de la documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

//Route ACCEUIL
app.get('api/bienvenuePokemons', (req, res) => {
    res.send("<h1>Exercice formatif sur les PoKEmOnS</h1>");
});

//Routes POKEMONS
const pokemonsRoutes = require('./src/routes/pokemons.route'); // Assurez-vous de mettre le chemin correct
app.use('/api/pokemons', pokemonsRoutes);

//Routes UTILISATEURS
const usersRoutes = require('./src/routes/users.route');
app.use('/api/users', usersRoutes);



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
