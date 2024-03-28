
const express = require('express');
const router = express.Router();
// À ajuster selon la structure
const pokemonsController = require('../controllers/pokemons.controller');

//Route ACCEUIL
router.get('/bienvenuePokemons', (req, res) => {
    res.send("<h1>Exercice formatif sur les PoKEmOnS</h1>");
});

//Paginer tous les Pokemons (Afficher tous les Pokemons)
router.get('/liste', pokemonsController.paginerPokemon);

// Afficher un Pokémon par son ID
router.get('/:id', pokemonsController.afficherPokemon);

// Ajouter un nouveau Pokémon
router.post('/', pokemonsController.ajouterPokemon);

// Supprimer un Pokémon par son ID
router.delete('/:id', pokemonsController.deletePokemon);

// Modifier un Pokémon par son ID
router.put('/', pokemonsController.modifierPokemon);


module.exports = router;
