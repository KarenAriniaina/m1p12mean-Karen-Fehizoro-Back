
const Demande = require("../models/Demande")
const HeureDeTravail = require("../models/HeureDeTravail")
const Mecanicien = require("../models/Mecanicien")
const TacheMecanicien = require("../models/TacheMecanicien")
const Service = require("../models/Service")
const PackPromoService = require("../models/PackPromoService")

async function rechercheService(text){
    resultat = await Service.find({
        $or: [
            { nom: { $regex: text, $options: "i" } },
            { description: { $regex: text, $options: "i" } },
        ]
    })
    return resultat 
}

async function rechercherPackPromo(text){
    resultat = await PackPromoService.find({
        $or: [
            { nom: { $regex: text, $options: "i" } },
            { description: { $regex: text, $options: "i" } },
        ]
    })
}

async function rechercheGlobal(text) {
    // type=0 si promo 1 si pack
    console.log(text)
    let status = 200;
    let error = '';
    let tableauService =[]
    let tableauPack =[]
    try {
        tableauService = await rechercheService(text)
        tableauPack = await rechercherPackPromo(text)
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "resultatRecherche" : {
            "tableauService": tableauService , 
            "tableauPack": tableauPack , 
        }, 
        // "tableauService": tableauService
        
    }
}

module.exports = { rechercheGlobal }