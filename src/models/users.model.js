const sql = require("../config/db.js");
const bcrypt = require('bcrypt');

const Utilisateur = (utilisateur) => {
    this.nom = utilisateur.nom;
    this.courriel = utilisateur.courriel;
    this.motDePasse = utilisateur.motDePasse;
    this.cleAPI = utilisateur.cleAPI;
}

/**
 * Verifie que le courriel est unique dans la table 'utilisateur'
 * @param {*Le courriel envoyé} courriel 
 * @returns Retourne vrai si le courriel est unique, faux pour l'inverse
 */
Utilisateur.verifierCourrielUnique = (courriel) => {
    return new Promise((resolve, reject) => {
        const requeteCourriel = 'SELECT COUNT(*) AS nbreCourriel FROM utilisateur WHERE courriel ?';
        const parametre = [courriel];

        sql.query(requeteCourriel, parametre, (err, result) => {
            let nbreCourriel = result[0].count;

            if (err) {
                reject(err);
            }
            // Résout avec un booléen indiquant si le courriel est unique ou non
            else {       
                //Le nbre de courriel doit être à 0 exactement pour retourner vrai (que le courriel est unique)         
                resolve(nbreCourriel === 0);
            }
        })
    })
}

/**
 * Vérifie que la clé d'API est unique dans la table 'utilisateur'
 * @param {La clé d'API envoyée} cleAPI 
 * @returns Retourne vrai si la clé est unique, faux pour l'inverse
 */
Utilisateur.verifierCleUnique = (cleAPI) => {
    return new Promise((resolve, reject) => {
        // Requête SQL pour vérifier si la clé API est unique
        const checkQuery = 'SELECT COUNT(*) AS count FROM utilisateur WHERE cle_api = ?';
        db.query(checkQuery, [cleAPI], (err, result) => {
            if (err) {
                reject(err);
            } else {
                // Résout avec un booléen indiquant si la clé est unique ou non
                let nbreCleAPI = result[0].count;
                resolve(nbreCleAPI === 0);
            }
        });
    });
}

/**
 * Créer l'utilisateur en s'assurant de hasher le mot de passe
 * @param {Le nom de l'utilisateur} nom 
 * @param {Le courriel de l'utilisateur} courriel 
 * @param {Le mot de passe de l'utilisateur} motDePasse 
 * @param {La clé d'API générée pour l'utilisateur} cleAPI 
 * @returns Retourne une promesse qui ajoute les informations de l'utilisateur dans la base de donnée, 
 *          ou rejette avec une erreur si une erreur se produit pendant le processus.
 */
Utilisateur.creerUtilisateur = (nom, courriel, motDePasse, cleAPI) => {
    const requeteInsertionUser = 'INSERT INTO utilisateur(nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)';
    const params = [nom, courriel, motDePasse, apiCle];

    return new Promise((resolve, reject) => {
        //On a déjà vérifié si le courriel était unique

        // Hachage du mot de passe avec BCrypt
        bcrypt.hash(motDePasse, 10, (err, hash) => {
            if (err) {
                reject(err);
            } 
            else {
                // Insertion de l'utilisateur avec le mot de passe haché
                values.push(hash);
                db.query(requeteInsertionUser, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });

    });
}













