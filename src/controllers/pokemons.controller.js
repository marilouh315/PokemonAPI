const Pokemons = require("../models/pokemons.model.js");

//AFFICHER POKEMON - VÉRIFICATION ID
exports.afficherPokemon = (req, res) => {
    const id_pokemon = parseInt(req.params.id);

    // Teste si le paramètre id est présent et valide
    if(!id_pokemon || parseInt(id_pokemon) <= 0){
        res.status(400);
        res.send({
            message: "Pour retourner un Pokemon, l'id du pokemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    // Appel à la fonction afficherPokemon dans le modèle
    Pokemons.afficherPokemon(id_pokemon)
    // Si c'est un succès
    .then((pokemon_resultat) => {
        // S'il n'y a aucun résultat, on retourne un message d'erreur avec le code 404
        // NOTE : Le modèle devrait retourner un tableau vide si aucun résultat n'est trouvé et non pas null
        if (!pokemon_resultat) {
            res.status(404);
            res.send({
                message: `Pokemon introuvable avec l'id ${id_pokemon}`
            });
            return;
        }
        else {
            res.send(pokemon_resultat);
        }        
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + id_pokemon
        });
    });
};




//SUPPRIMER POKEMON - VÉRIFICATION ID
exports.deletePokemon = (req, res) => {
    // Teste si le paramètre id est présent et valide
    const id_pokemon = parseInt(req.params.id);

    if (!id_pokemon || id_pokemon <= 0) {
        res.status(400).json({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0."
        });
        return;
    }

    // Appel à la fonction deletePokemon dans le modèle
    Pokemons.deletePokemon(id_pokemon)
    .then(resultat_delete => {
        res.send(`Le pokemon avec l'id ${id_pokemon} a été supprimé avec succès.`);
        res.status(200).json(resultat_delete);
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json({
            message: `Erreur lors de la suppression du pokemon avec l'id ${id_pokemon}`
        });
    });
};



// MODIFIER POKEMON - VÉRIFICATION
exports.modifierPokemon = (req, res) => {
    const {
        id,
        nom,
        type_primaire,
        type_secondaire,
        pv,
        attaque,
        defense
    } = req.body;

    if (!id || !nom || !type_primaire || !type_secondaire || pv === undefined || attaque === undefined || defense === undefined) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champ_manquant: ["id", "nom", "type_primaire", "type_secondaire", "pv", "attaque", "defense"]
        });
    }

    // Appel à la fonction pour mettre à jour le Pokémon dans le modèle
    Pokemons.modifierPokemon(
        nom,
        type_primaire,
        type_secondaire,
        pv,
        attaque,
        defense,
        id
    )
    .then((resultat_update) => {
        if (resultat_update) {
            res.status(200).json({
                message: `Le Pokémon avec l'ID ${id} a été mis à jour avec succès`,
                pokemon: {
                    id,
                    nom,
                    type_primaire,
                    type_secondaire,
                    pv,
                    attaque,
                    defense
                }
            });
        } 
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json({
            message: `Erreur lors de la mise à jour du Pokémon avec l'ID ${id}`
        });
    });
};




//CRÉER POKEMON - VÉRIFICATION ID
exports.ajouterPokemon = (req, res) => {
    // Récupère les autres paramètres du corps de la requête ou les initialise à null
    const {
        nom,
        type_primaire,
        type_secondaire,
        pv,
        attaque,
        defense
    } = req.body;

    if (!nom || !type_primaire || !type_secondaire || pv === undefined || attaque === undefined || defense === undefined) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champ_manquant: ["nom", "type_primaire", "type_secondaire", "pv", "attaque", "defense"]
        });
    }

    // Appel à la fonction ajouterPokemon dans le modèle
    Pokemons.ajouterPokemon(
        nom,
        type_primaire,
        type_secondaire,
        pv,
        attaque,
        defense
    )
    // Si c'est un succès
    .then((resultat_ajoute) => {
        if (resultat_ajoute){
            const last_pokemonID = resultat_ajoute.insertId; // Récupérer l'ID du Pokemon nouvellement ajouté
            res.status(201).json({
                message: `Le Pokemon ${nom} (ID: ${last_pokemonID}) a été ajouté avec succès!`,
                pokemon: {
                    nom,
                    type_primaire,
                    type_secondaire,
                    pv,
                    attaque,
                    defense
                }
            });
        }
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

    var page = parseInt(req.query.page);
    //Mettre par défaut la première page 
    if (page <= 0 || page == null || !req.query.page || isNaN(page)){
        page = 1;
    }

    const limit = 10;
    const offset = (page - 1) * limit;

    // const prochain = liste_resultat.length === limit; // Vérifie si la longueur des résultats est égale à la limite (ce qui signifie qu'il y a plus de résultats à afficher)

    // let prochainURL = null;
    // if (prochain) {
    //     prochainURL = "/api/liste/:" + type + "?page=" + (page + 1);
    // }

    // Appel à la fonction d'afficher un film ou série
    Pokemons.paginerPokemon(offset)
    // Si c'est un succès
    .then((liste_resultat) => {
        // S'il n'y a aucun résultat, on retourne un message d'erreur avec le code 400
        if (!liste_resultat) {
            res.status(400);
            res.send({
                "erreur": `Aucun résultat trouvé`
            });
            return;
        }
        res.status(200).json({
            result: liste_resultat,
            filtre: type,
            page: page,
            url_page_suivante: "/api/liste/" + (page + 1)
        });
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération des listes Pokemons"
        });
    });
};
