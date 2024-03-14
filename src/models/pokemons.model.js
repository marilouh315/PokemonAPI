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
        const requete = 'SELECT * FROM pokemon WHERE id = ?';
        const params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve({ resultat });
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
            resolve({ resultat });
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
    const update_requete = 'UPDATE pokemon SET nom = ?, type_primaire= ?, type_secondaire= ?, pv= ?, attaque= ?, defense= ? WHERE id = ?';
    const select_requete = 'SELECT * FROM pokemon WHERE id = ?'; //Pour aller vérifier si le id est présent dans la BD
    return new Promise((resolve, reject) => {
        const params_update = [updateNom, updateTypePrimaire, updateTypeSecondaire, updatePV, updateAttaque, updateDefense, id]
        const params_select = [id]

        sql.query(select_requete, params_select, (erreur, select_resultat) => {
            if (erreur) {
                console.error('Erreur lors de la récupération du id du pokémon :', erreur);
                reject(erreur);
            }
            else {
                sql.query(update_requete, params_update, (erreur, update_resultat) => {
                    if (erreur) {
                        reject(erreur);
                    }
                    else {
                        resolve({ update_resultat });
                    }
                })
            }
        })
    })
}

/**
 * Supprime un pokemon selon son id choisi
 * @param {Le id du pokemon à delete} id 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.deletePokemon = (id) => {
    const delete_requete = 'DELETE FROM pokemon WHERE id = ?';
    const select_requete = 'SELECT * FROM pokemon WHERE id = ?'; //Pour aller vérifier si le id est présent dans la BD
    return new Promise((resolve, reject) => {
        const params = [id];

        sql.query(delete_requete, params, (erreur, delete_resultat) => {
            if (erreur) {
                console.error('Erreur lors de la suppression du pokémon :', err);
                reject(erreur);
            }
            else {
                sql.query(select_requete, params, (erreur, select_resultat) => {
                    if (erreur) {
                        console.error('Erreur lors de la récupération du pokémon :', err);
                        reject(erreur);
                    }
                    else {
                        resolve(select_resultat);
                    }
                });
            }
        });
    });
};



/**
 * Affiche les Pokemons selon une pagination de 10 Pokemons par page maximum
 * @param {Le type du Pokemon} type
 * @param {Offset pour aller chercher à bonds de 10} offset 
 * @returns Si fonctionne, me retourne mon résultat sinon retourne erreur
 */
Pokemons.paginerPokemon = (type, offset) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT id, nom FROM pokemon WHERE type_primaire = ? ORDER BY id LIMIT 10 OFFSET ?';
        const parametre_type = [type, offset];

        sql.query(requete, parametre_type, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        })
    })
}


/**
 * Validation de la clé API dans la base de données
 * @param {string} cleApi - Clé API à valider
 * @returns {Promise<boolean>} - Résultat de la validation (true si la clé API est valide, sinon false)
 */
// Pokemons.static.validationCle = (cleApi) => {
//     return new Promise((resolve, reject) => {
//         const requete = 'SELECT COUNT(*) AS nbUsager FROM usager u WHERE cle_api = ?; ';
//         const parametres = [cleApi];

//         sql.query(requete, parametres, (erreur, resultat) => {
//             if (erreur) {
//                 console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
//                 reject(erreur);
//             }
//             resolve(resultat[0].nbUsager > 0);   
//         });
//     });
// }

module.exports = Pokemons;