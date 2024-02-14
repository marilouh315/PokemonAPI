const Pokemons = require("../models/pokemons.model.js");

//AFFICHER POKEMON - VÉRIFICATION ID
exports.afficherPokemon = (req, res) => {
    // Teste si le paramètre id est présent et valide
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0 (afficher)"
        });
        return;
    }

    // Appel à la fonction afficherPokemon dans le modèle
    Pokemons.afficherPokemon(req.params.id)
    // Si c'est un succès
    .then((pokemons) => {
        // S'il n'y a aucun résultat, on retourne un message d'erreur avec le code 404
        // NOTE : Le modèle devrait retourner un tableau vide si aucun résultat n'est trouvé et non pas null
        if (!pokemons) {
            res.status(404);
            res.send({
                message: `Pokemon introuvable avec l'id ${req.params.id} (afficher)`
            });
            return;
        }
        // Sinon on retourne le premier objet du tableau de résultat car on ne devrait avoir qu'un pokemon par id
        res.send(pokemons);
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + req.params.id + "(afficher)"
        });
    });
};




//SUPPRIMER POKEMON - VÉRIFICATION ID
exports.deletePokemon = (req, res) => {
    // Teste si le paramètre id est présent et valide
    const pokemonId = parseInt(req.params.id);
    if (!pokemonId || pokemonId <= 0) {
        res.status(400).json({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0 (delete)"
        });
        return;
    }
    // NOTE : Tu devais retourner un message d'erreur si l'ID est inexistant
    // Appel à la fonction deletePokemon dans le modèle
    Pokemons.deletePokemon(pokemonId)
        .then((resultat) => {
            // Vérifie si la suppression a réussi (au moins une ligne affectée)
            if (resultat.affectedRows > 0) {
                res.status(200).json({
                    message: `Le pokemon avec l'id ${pokemonId} a été supprimé avec succès.`
                });
            } else {
                // Aucune ligne affectée, le Pokémon avec l'ID n'existe probablement pas
                // NOTE : Donc pourquoi retourner un code 200 si le Pokémon n'a pas été supprimé?
                res.status(200).json({
                    message: `Le pokemon avec l'id ${pokemonId} n'est pas dans la base de donnée.`
                });
            }
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).json({
                message: `Erreur lors de la suppression du pokemon avec l'id ${pokemonId} (delete)`
            });
        });
};



// MODIFIER POKEMON - VÉRIFICATION
exports.modifierPokemon = (req, res) => {
    // Teste si les paramètres sont présents et valides
    if (!req.params.id) {
        res.status(400).json({
            message: "L'ID du Pokémon est requis pour effectuer une modification. (modifier)"
        });
        return;
    }
    // NOTE : Tu devais retourner les champs obligatoires manquants dans une réponse
    // Appel à la fonction pour mettre à jour le Pokémon dans le modèle
    // NOTE : Tu dois vérifier si le Pokémon existe avant de le modifier
    Pokemons.modifierPokemon(
        req.query.nom || null,
        req.query.type_primaire || null,
        req.query.type_secondaire || null,
        req.query.pv || null,
        req.query.attaque || null,
        req.query.defense || null,
        req.params.id
    )
        .then((resultat) => {
            if (resultat.successMessage) {
                res.status(200).json({
                    message: resultat.successMessage,
                    pokemon: {
                        id: req.params.id,
                        nom: req.query.nom || null,
                        type_primaire: req.query.type_primaire || null,
                        type_secondaire: req.query.type_secondaire || null,
                        pv: req.query.pv || null,
                        attaque: req.query.attaque || null,
                        defense: req.query.defense || null
                    }
                });
            } else {
                res.status(404).json({
                    message: `Le Pokémon avec l'ID ${req.params.id} n'existe pas dans la base de données. Aucune mise à jour effectuée. (midifier2)`
                });
            }
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).json({
                message: "Erreur lors de la mise à jour du Pokémon avec l'ID " + req.params.id + "(modifier)"
            });
        });
};




//CRÉER POKEMON - VÉRIFICATION ID
exports.ajouterPokemon = (req, res) => {
    // Vérifie si le nom du pokemon a été donné
    if (!req.body.nom) {
        res.status(400);
        res.send({
            message: "Le nom du pokemon doit être donné."
        });
        return;
    }

    // Récupère les autres paramètres du corps de la requête ou les initialise à null
    const {
        type_primaire = null,
        type_secondaire = null,
        pv = null,
        attaque = null,
        defense = null
    } = req.body;
    // NOTE : Tu devais retourner les champs obligatoires manquants dans une réponse

    // Appel à la fonction ajouterPokemon dans le modèle
    Pokemons.ajouterPokemon(
        req.body.nom,
        type_primaire,
        type_secondaire,
        pv,
        attaque,
        defense
    )
    // Si c'est un succès
    .then((resultat) => {
        const idPokemon = resultat.insertId; // Récupérer l'ID du Pokemon nouvellement ajouté
        const successMessage = `Le Pokemon ${req.body.nom} (ID: ${idPokemon}) a été ajouté avec succès!`;
        // NOTE : Le format de la réponse n'est pas conforme à ce qui était demandé
        res.send({ success: true, message: successMessage, resultat });
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne une erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({
            message: "Erreur lors de l'ajout du pokemon."
        });
    });
};


//PAGINER POKEMON - VERIFICATION
exports.paginerPokemon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const type = req.query.type || '';
        // NOTE : Dans le modèle tu devrais seulement récupérer les données brutes et les formater ici
        const resultat = await Pokemons.paginerPokemon(page, type);
        res.status(200).json(resultat);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json(erreur);
    }
};
