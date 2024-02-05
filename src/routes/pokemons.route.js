const express = require('express');
const router = express.Router();
// À ajuster selon la structure
const pokemonsController = require('../controllers/pokemons.controller');

// Afficher un Pokémon par son ID
router.get('/afficher/:id', pokemonsController.afficherPokemon);

// Ajouter un nouveau Pokémon
router.post('/ajouter/', pokemonsController.ajouterPokemon);

// Supprimer un Pokémon par son ID
router.delete('/delete/:id', pokemonsController.deletePokemon);

// Modifier un Pokémon par son ID
router.put('/update/:id', pokemonsController.modifierPokemon);

//Paginer tous les Pokemons (Afficher tous les Pokemons)
router.get('/liste', pokemonsController.paginerPokemon);


module.exports = router;
