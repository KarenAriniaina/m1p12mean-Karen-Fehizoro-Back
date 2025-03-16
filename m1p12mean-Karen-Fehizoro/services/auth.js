const Manager = require('../models/Manager');
const Mecanicien = require('../models/Mecanicien');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');


async function login(email, mdp, type) {
    try {
        if (!email || !mdp) throw new Error("Veuillez tout remplir");
        else {
            let pers;
            // Admin
            if (type == 0) {
                pers = await Manager.findOne({ login: email })
            }
            // Meca
            else if (type == 1) {
                pers = await Mecanicien.findOne({ email })
            } else {
                pers = await Client.findOne({ email })
            }
            if (!pers){
                if(type == 0) throw new Error("Aucun manager trouvé avec le login saisi");
                else throw new Error("Aucun utilisateur trouvé avec l'email saisie");
            }
            const isMatch = await bcrypt.compare(mdp, pers.mdp);
            if (!isMatch) {
                throw new Error("Mot de passe faux");
            }
            return {
                "logged": true,
                "detailslog": {
                    "id": pers._id,
                    "prenom": pers.prenom,
                    "role": type
                }
            }
        }
    } catch (error) {
        return {
            "logged": false,
            "error": error.message
        }
    }
}

async function createAdmin(login,pwd,prenom) {
    try {
        const admin = await Manager.create({
            login: login,
            prenom: prenom,
            mdp: await HashMdp(pwd)
        });
        return {
            "created":true,
            "admin": admin
        }
    } catch (error) {
        if (error.code === 11000) {
            return {
                "created":false,
                "error":"Login existant pour un manager"
            }
        } else {
            return {
                "created":false,
                "error":error.message
            }
        }
    }
}

async function HashMdp(mdp) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    return await bcrypt.hash(mdp, salt); // Hash password
}

module.exports = { login,createAdmin };
