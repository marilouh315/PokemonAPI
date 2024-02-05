const sql = require("../config/db.js");

const Pokemons = (pokemons) => {
    this.nom = pokemons.nom;
    this.type_primaire = pokemons.type_primaire;
    this.type_secondaire = pokemons.type_secondaire;
    this.pv = pokemons.pv;
    this.attaque = pokemons.attaque;
    this.defense = pokemons.defense;
}

/**
 * Affiche un Pokemon selon l'id entré
 * @param {id du pokemon} id 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.afficherPokemon = (id) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = ?';
        const params = [id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }

            const successMessage = `Le Pokemon (ID: ${id}) est affiché avec succès!`;

            resolve({ successMessage, resultat });
            

        })
    })
}

/**
 * Créer mon pokemon et l'insère dans la table pokemon de la bd avec les valeurs choisies
 * @param {Nouveau nom de pokemon} nouvNom 
 * @param {Nouveau type primaire du pokemon} nouvTypePrimaire 
 * @param {Nouveau type secondaire du pokemon} nouvTypeSecondaire 
 * @param {Nouveau points de vie du pokemon} nouvPV 
 * @param {Nouvelle valeur d'attaque du pokemon} nouvAttaque 
 * @param {Nouvelle valeur de defense du pokemon} nouvDefense 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.ajouterPokemon = (nouvNom, nouvTypePrimaire, nouvTypeSecondaire, nouvPV, nouvAttaque, nouvDefense) => {
    return new Promise((resolve, reject) => {
        const requete = 'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [nouvNom, nouvTypePrimaire, nouvTypeSecondaire, nouvPV, nouvAttaque, nouvDefense]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }

            const idPokemon = resultat.insertId; // Récupérer l'ID du Pokemon nouvellement ajouté
            const successMessage = `Le Pokemon ${nouvNom} (ID: ${idPokemon}) a été ajouté avec succès!`;

            resolve({ successMessage, resultat });
        })
    })
}

/**
 * Modifier un pokemon déjà existant, selon le id choisi
 * @param {Le nouveau nom modifié} updateNom 
 * @param {Le nouveau type_primaire modifié} updateTypePrimaire 
 * @param {Le nouveau type_secondaire modifié} updateTypeSecondaire 
 * @param {Le nouveau pv modifié} updatePV 
 * @param {La nouvelle valeur d'attaque modifiée} updateAttaque 
 * @param {La nouvelle valeur de defense modifiée} updateDefense 
 * @param {Le id du pokemon à modifier} id 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.modifierPokemon = (updateNom, updateTypePrimaire, updateTypeSecondaire, updatePV, updateAttaque, updateDefense, id) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE pokemon SET nom = ?, type_primaire= ?, type_secondaire= ?, pv= ?, attaque= ?, defense= ? WHERE id = ?';
        const params = [updateNom, updateTypePrimaire, updateTypeSecondaire, updatePV, updateAttaque, updateDefense, id]

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }

            const successMessage = `Le Pokemon ${updateNom} (ID: ${id}) a été modifié avec succès!`;

            resolve({ successMessage, resultat });
        })
    })
}

/**
 * Supprime un pokemon selon son id choisi
 * @param {Le id du pokemon à delete} id 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.deletePokemon = (id) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM pokemon WHERE id = ?'; // Ajout de "FROM" et correction de la clause WHERE
        const params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }

            const successMessage = `Le Pokemon (ID: ${id}) a été supprimé avec succès!`;

            resolve({ successMessage, resultat });
        });
    });
};



/**
 * Affiche tous les Pokemons sur plusieurs pages
 * @param {*} page 
 * @param {*} type 
 * @returns 
 */
Pokemons.paginerPokemon = (page = 1, type = '') => {
    return new Promise((resolve, reject) => {
        const limit = 25;
        const offset = (page - 1) * limit;

        const typeFilter = type ? `WHERE type_primaire = '${type}'` : '';

        const requete = `SELECT * FROM pokemon ${typeFilter} LIMIT ${limit} OFFSET ${offset}`;

        sql.query(requete, (erreur, resultat) => {
            if (erreur) {
                reject({ erreur: "Echec lors de la récupération de la liste des pokemons" });
            }

            const requeteCount = `SELECT COUNT(*) AS total FROM pokemon ${typeFilter}`;
            sql.query(requeteCount, (erreurCount, resultatCount) => {
                if (erreurCount) {
                    reject({ erreur: "Echec lors de la récupération du nombre total de pokemons" });
                }

                const total = resultatCount[0].total;

                const successMessage = `Voici la liste de tous les Pokemons`;
                const totalPage = Math.ceil(total / limit);

                resolve({
                    successMessage,
                    pokemons: resultat,
                    type: type || '',
                    nombrePokemonTotal: total,
                    page: page,
                    totalPage: totalPage
                });
            });
        });
    });
};



module.exports = Pokemons;