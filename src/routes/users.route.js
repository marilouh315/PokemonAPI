const express = require('express');
const router = express.Router();
// À ajuster selon la structure
const usersController = require('../controllers/users.controller');

// Créer nouveau utilisateur
router.post('/', usersController.creerUtilisateur);

module.exports = router;






