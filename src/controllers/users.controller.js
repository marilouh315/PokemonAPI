const utilisateurs = require("../models/users.model.js");

//CRÉER UTILISATEUR - VÉRIFICATION QUE TOUS LES CHAMPS SONT PRÉSENTS
exports.creerUtilisateur = (req, res) => {

    //tous les champs nécessaires sont présent et que le courriel est unique dans la table.

    const nom_utilisateur = req.body.nom;
    const courriel_utilisateur = req.body.courriel;
    const motDePasse_utilisateur = req.body.mdp;

    //Vérifie si tous les champs nécéssaires ont été donnés
    if (!nom_utilisateur || !courriel_utilisateur || !motDePasse_utilisateur) {
        res.status(400);
        res.send({
            message: 'Les champs "nom", "courriel" et "mot de passe" sont tous obligatoires.'
        });
        return;
    }

    //Vérifie le courriel unique
    utilisateurs.verifierCourrielUnique(courriel_utilisateur)
    .then(courrielEstUnique => {
        if (courrielEstUnique) {
            res.status(201).json({
                message: `Le courriel ${courriel_utilisateur} a été ajouté avec succès`
            });
        }
        else {
            res.status(400);
            res.send({
                message: 'Le courriel n\'est pas unique. Veuillez en choisir un autre.'
            });
            return;
        }
    })
    .catch(error => {
        console.error('Erreur lors de la vérification du courriel :', error);
        res.status(500).json({ error: 'Erreur serveur' });
        return;
    });

    //Appel de la fonction de verification de la clé d'API qui retourne une promesse
    verificationCleAPI(8)
    .then(cleAPI => {// Attendez que la promesse soit résolue
        console.log(cleAPI); // Maintenant cleAPI est résolu et contient la clé API générée

        //Puisqu'on a vérifié si tous les champs ont été ajoutés plus haut, 
        //on peut déjà appeler creerUtilisateur() -> qui va nous retourner une promesse
        
        utilisateurs.creerUtilisateur(nom_utilisateur, courriel_utilisateur, motDePasse_utilisateur, cleAPI)
        .then(resultat_utilisateur => {
            res.status(201).json({
                message: `L'utilisateur ${nom} a été ajouté avec succès`,
                cle_api: cleAPI
            });
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur serveur' });
        });
    })
    .catch(error => {
        console.error('Erreur lors de la génération de la clé API :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    });

};

/**
 * Fonction qui vérifie qu'une clé API est unique ou non
 * @param {*Longueur de la clé d'API générée} length 
 * @returns Retourne une promesse qui résout avec la clé d'API générée une fois qu'une clé unique est trouvée, 
 *          ou rejette avec une erreur si une erreur se produit pendant le processus.
 */
function verificationCleAPI(length) {
    return new Promise((resolve, reject) => {
        let cleAPI = generateApiKey(length); // Génère une nouvelle clé API

        // Demande au modèle de vérifier si la clé API est unique
        utilisateurs.verifierCleUnique(cleAPI)
            .then(cleAPI_estUnique => {
                if (cleAPI_estUnique) {
                    resolve(cleAPI); // Si la clé est unique, résout avec la clé générée
                } else {
                    // Si la clé n'est pas unique, génère une nouvelle clé et vérifie à nouveau
                    verificationCleAPI(length).then(nouvelle_cleAPI => {
                        resolve(nouvelle_cleAPI);
                    }).catch(error => {
                        reject(error);
                    });
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * Fonction qui génère une clé d'API aléatoire composée de chiffres.
 * @param {*la longueur de la clé d'API à générer} length 
 * @returns Retourne la clé d'API générée aléatoirement
 */
function generateApiKey(length) {
    let clé_API_generee = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
        clé_API_generee += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return clé_API_generee;
}