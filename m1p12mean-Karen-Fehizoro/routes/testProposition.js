const express = require('express');
const router = express.Router();
const { RattachementDisponibiliteDansMecanicien, RecuperationListeMecanicien,IntersectionDeuxIntervaleDate ,
    EnleverUnIntervalDeDateAUneAutreDate , SuppressionIntervaleDateDansChaqueListeIntervale ,
     SuppressionListeIntervaleDateDansChaqueListeIntervale, RecuperationTacheParMecanicien, DisponibilitePourUtilisateur, 
     RecuperationListeTacheSurIntervalleDateEtService, RechercheMecanicienSelonSpecialite ,RegroupeLesTachesParIdMecanicien ,
     AjoutDateParRapportHeureDeTravail , RecuperationListeMecanicienDisponible , RecuperationMecanicienDisponibleAUneIntervalleDeDate,
     ProposerUnRendezVousSelonService,
     RecuperationToutPropositionAPartirDateSaisie ,TraitementPourLaRecuperationProposition,
     ChangerLesStatusDesTaches} = require('../services/traitementPropositionDemande');

router.get('/', async (req, res) => {
    
    // const intervaleDate1={
    //     dateDebut : new Date("2025-03-25T17:00:00Z"),
    //     dateFin : new Date("2025-03-25T18:00:00Z")
    // }
    // const intervaleDate2={
    //     dateDebut : new Date("2025-03-25T18:00:00Z"),
    //     dateFin : new Date("2025-03-25T19:00:00Z")
    // }

    // const listeTache = [ intervaleDate1 ,intervaleDate2]


    // const listeIntervaleDate = [
    //     { dateDebut : new Date("2025-03-25T08:00:00Z"),
    //         dateFin : new Date("2025-03-25T12:00:00Z")},
    //     { dateDebut : new Date("2025-03-25T17:00:00Z"),
    //         dateFin : new Date("2025-03-25T20:00:00Z")},
    // ]
    // const listeIntervaleDate = [
    //     { dateDebut : new Date("2025-03-25T08:00:00Z"),
    //         dateFin : new Date("2025-03-25T20:00:00Z")},
    //     ]

    // console.log(IntersectionDeuxIntervaleDate(intervaleDate1 , intervaleDate2))
    // console.log(EnleverUnIntervalDeDateAUneAutreDate(intervaleDate1 , intervaleDate2))
    // console.log(SuppressionIntervaleDateDansChaqueListeIntervale(intervaleDate1 , listeIntervaleDate))
    // console.log(SuppressionListeIntervaleDateDansChaqueListeIntervale(listeTache , listeIntervaleDate))
    // dateDemandeDebut = new Date("2025-03-06T09:02:00Z")
    // dateDemandeFin = new Date("2025-03-06T11:00:00Z")
    // console.log(await RecuperationListeTacheSurIntervalleDateEtService(dateDemandeDebut ,dateDemandeFin , 3001 ))
    // listeTacheMeca555=await RecuperationListeTacheSurIntervalleDateEtService(dateDemandeDebut ,dateDemandeFin , 3 )
    // mapListeTacheMeca555 =await RegroupeLesTachesParIdMecanicien(listeTacheMeca555)
    // // console.log(await RegroupeLesTachesParIdMecanicien(listeTacheMeca555))
    // // console.log((await RechercheMecanicienSelonSpecialite(3)).length)
    // listeMecanicienSelonService = await RechercheMecanicienSelonSpecialite(3)
    // listeMecanicienDispo = RecuperationListeMecanicienDisponible(listeMecanicienSelonService , mapListeTacheMeca555)
    // console.log(listeMecanicienDispo)
    // console.log(await RecuperationMecanicienDisponibleAUneIntervalleDeDate(dateDemandeDebut ,dateDemandeFin , 3))

    // heureDeTravailMatin = {
    //     dateDebut : new Date("2025-03-08T08:00:00Z"),
    //     dateFin : new Date("2025-03-08T12:00:00Z"),
    // }
    // heureDeTravailSoir = {
    //     dateDebut : new Date("2025-03-08T14:00:00Z"),
    //     dateFin : new Date("2025-03-08T17:00:00Z"),
    // }
    // dateDebut = new Date("2025-03-08T09:00:00Z");
    // dureeServiceMinute = 15
    // resultat = AjoutDateParRapportHeureDeTravail(heureDeTravailMatin , heureDeTravailSoir , dateDebut ,dureeServiceMinute )
    // console.log(await RechercheMecanicienSelonSpecialite(3))
    // console.log("dateDebut : "+resultat.dateDebut )
    // console.log("dateFin : "+resultat.dateFin )



    // resultatFinitionServiceDemande=await ProposerUnRendezVousSelonService(3 ,heureDeTravailMatin , heureDeTravailSoir , dateDebut ,dureeServiceMinute ,2)
    // listeService =[
    //     { _id : 3 , estimation:30 , nbrmeca :2} ,
    //     { _id : 3 , estimation:15 , nbrmeca :1} ,
    //     { _id : 3 , estimation:10 , nbrmeca :1} ,
    //     { _id : 3 , estimation:10 , nbrmeca :2} ,
    // ]
    // resultatFinitionServiceDemande =await RecuperationToutPropositionAPartirDateSaisie("2025-03-08" , 3 ,listeService)
    // console.log(resultatFinitionServiceDemande)
    let informationSurLeDemande ={
        listePack:[{
            service : [
                { _id : 3 , estimation:30 , nbrmeca :2} ,
                { _id : 3 , estimation:15 , nbrmeca :1} ,
                { _id : 3 , estimation:10 , nbrmeca :1} ,
                { _id : 3 , estimation:10 , nbrmeca :2} ,
            ] ,
        } ,
        {
            service : [
                { _id : 3 , estimation:30 , nbrmeca :2} ,
                { _id : 3 , estimation:15 , nbrmeca :1} ,
                { _id : 3 , estimation:10 , nbrmeca :1} ,
                { _id : 3 , estimation:10 , nbrmeca :2} ,
            ] ,
        }  
        ],
        listeService: [
            { _id : 3 , estimation:30 , nbrmeca :2} ,
            { _id : 3 , estimation:15 , nbrmeca :1} ,
            { _id : 3 , estimation:10 , nbrmeca :1} ,
            { _id : 3 , estimation:10 , nbrmeca :2} ,
        ]
    }
    // console.log(informationSurLeDemande.listePack)
    // console.log(informationSurLeDemande.listeService)
    

    await TraitementPourLaRecuperationProposition( informationSurLeDemande , "2025-03-08")

    // await ChangerLesStatusDesTaches(90)
    // console.log("Dd : "+resultatFinitionServiceDemande.dateDebutDisponibiliteMecanicien+"  ----- Df: "+resultatFinitionServiceDemande.dateFinDisponibiliteMecanicien)
    // console.log(resultatFinitionServiceDemande.listeMecanicien)

    
});


module.exports = router;
