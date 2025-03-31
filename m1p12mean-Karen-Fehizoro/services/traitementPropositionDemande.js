const Demande = require("../models/Demande")
const HeureDeTravail = require("../models/HeureDeTravail")
const Mecanicien = require("../models/Mecanicien")
const TacheMecanicien = require("../models/TacheMecanicien")


function comparaisonDeuxDates(dateDebut , dateFin){
    if(dateDebut< dateFin){
        return -1
    }else if (dateDebut> dateFin){
        return 1
    }
    return 0
}

function IntersectionDeuxIntervaleDate(intervaleDate1 , intervaleDate2){
    intervalleFinal = null
    if(intervaleDate1.dateDebut <=intervaleDate2.dateDebut && intervaleDate1.dateFin <=intervaleDate2.dateDebut ){
        return null
    }else if(intervaleDate1.dateDebut <= intervaleDate2.dateDebut &&  intervaleDate2.dateDebut<= intervaleDate2.dateFin &&intervaleDate2.dateFin <= intervaleDate1.dateFin ){
        return {dateDebut :  intervaleDate2.dateDebut , dateFin :  intervaleDate2.dateFin}        
    }else if(intervaleDate2.dateDebut <= intervaleDate1.dateDebut &&  intervaleDate1.dateDebut<= intervaleDate1.dateFin &&intervaleDate1.dateFin <= intervaleDate2.dateFin ){
        return {dateDebut :  intervaleDate1.dateDebut , dateFin :  intervaleDate1.dateFin}        
    }else if(intervaleDate1.dateDebut <= intervaleDate2.dateDebut && intervaleDate2.dateDebut <= intervaleDate1.dateFin && intervaleDate1.dateFin <= intervaleDate2.dateFin){
        return {dateDebut :  intervaleDate2.dateDebut , dateFin :  intervaleDate1.dateFin}
    }else if(intervaleDate2.dateDebut <= intervaleDate1.dateDebut && intervaleDate1.dateDebut <= intervaleDate2.dateFin && intervaleDate2.dateFin <= intervaleDate1.dateFin){
        return {dateDebut :  intervaleDate1.dateDebut , dateFin :  intervaleDate2.dateFin}
    }
    return null
}

function EnleverUnIntervalDeDateAUneAutreDate(IntervalDatePrincipale , intervaleDateAEnleve){
    if(IntervalDatePrincipale.dateDebut< intervaleDateAEnleve.dateDebut &&  intervaleDateAEnleve.dateDebut< intervaleDateAEnleve.dateFin &&  intervaleDateAEnleve.dateFin< IntervalDatePrincipale.dateFin ){
        // console.log(1)
        return [   
            {dateDebut :  IntervalDatePrincipale.dateDebut , dateFin :  intervaleDateAEnleve.dateDebut} ,
            {dateDebut :  intervaleDateAEnleve.dateFin , dateFin :  IntervalDatePrincipale.dateFin}
        ]
    }else if(IntervalDatePrincipale.dateDebut <=intervaleDateAEnleve.dateDebut && IntervalDatePrincipale.dateFin <=intervaleDateAEnleve.dateDebut){
        return [IntervalDatePrincipale]
    }else if(intervaleDateAEnleve.dateDebut <=IntervalDatePrincipale.dateDebut && intervaleDateAEnleve.dateFin <=IntervalDatePrincipale.dateDebut){
        return [IntervalDatePrincipale]
    }else if(IntervalDatePrincipale.dateDebut <=intervaleDateAEnleve.dateDebut && intervaleDateAEnleve.dateDebut <=IntervalDatePrincipale.dateFin && IntervalDatePrincipale.dateFin <=intervaleDateAEnleve.dateFin ){
        // console.log(2)
        return [
            {dateDebut :  IntervalDatePrincipale.dateDebut , dateFin :  intervaleDateAEnleve.dateDebut} 
        ]
    }else if(intervaleDateAEnleve.dateDebut <=IntervalDatePrincipale.dateDebut && IntervalDatePrincipale.dateDebut <=intervaleDateAEnleve.dateFin && intervaleDateAEnleve.dateFin <=IntervalDatePrincipale.dateFin ){
        // console.log(3)
        return [
            {dateDebut :  intervaleDateAEnleve.dateFin , dateFin :  IntervalDatePrincipale.dateFin} 
        ]
    }else if (intervaleDateAEnleve.dateDebut <=  IntervalDatePrincipale.dateDebut && IntervalDatePrincipale.dateDebut <=  IntervalDatePrincipale.dateFin && IntervalDatePrincipale.dateDebut <=  intervaleDateAEnleve.dateFin){
        // console.log(4)
        return []
    }
    return []
}

function SuppressionIntervaleDateDansChaqueListeIntervale(intervaleAEnlever , listeIntervaleDate){
    resultat = []
    for(i=0 ; i<listeIntervaleDate.length ; i++){
        nouveauIntervales=EnleverUnIntervalDeDateAUneAutreDate(listeIntervaleDate[i] , intervaleAEnlever)
        resultat.push(...nouveauIntervales);
    }
    return resultat 
}

function SuppressionListeIntervaleDateDansChaqueListeIntervale(listeIntervaleAEnlever , listeIntervaleDate){
    resultat = []
    
    for(let i=0 ; i<listeIntervaleAEnlever.length ; i++){
        listeIntervaleDate= SuppressionIntervaleDateDansChaqueListeIntervale(listeIntervaleAEnlever[i] , listeIntervaleDate)
    }
    return listeIntervaleDate 
}

async function RecuperationTacheParMecanicien(){
    const tacheMecaniciens = await TacheMecanicien.find();
    console.log("aaaa"+tacheMecaniciens.length)
    let map = new Map()
    for( i = 0 ; i<tacheMecaniciens.length ; i++){
        if(map.has(tacheMecaniciens[i].idMeca)){
            tableau =map.get(tacheMecaniciens[i].idMeca)
            tableau.push(
                {   dateDebut :tacheMecaniciens[i].dateDebut , 
                    dateFin :tacheMecaniciens[i].dateFin , 
                }
            )
            map.set(tacheMecaniciens[i].idMeca, tableau);
        }else{
            map.set(tacheMecaniciens[i].idMeca, [
                {   dateDebut :tacheMecaniciens[i].dateDebut , 
                    dateFin :tacheMecaniciens[i].dateFin , 
                }
            ]);
        }
    }
    // console.log(map)
    return map
}
async function DisponibilitePourUtilisateur(){
    let listeIntervale = [
        {
            dateDebut : new Date("2025-03-06T08:00:00Z"),
            dateFin : new Date("2025-03-06T17:00:00Z")
        }
    ]
    tachePersonnel = await RecuperationTacheParMecanicien()
    tachePersonnel.forEach((value, key) => {
        let petiteResultat =SuppressionListeIntervaleDateDansChaqueListeIntervale(value , listeIntervale)
        tachePersonnel.set(key , petiteResultat)
    });
    return tachePersonnel
    // console.log(tachePersonnel)
}
async function RecuperationListeMecanicien(){
    const mecanicien = await Mecanicien.find().lean();
    return mecanicien 
}   
async function RattachementDisponibiliteDansMecanicien(){
    listeToutMecanicien = await RecuperationListeMecanicien()
    mapDisponibiliteParIdMecanicien = await DisponibilitePourUtilisateur()
    
    for(i=0 ; i< listeToutMecanicien.length ; i++){
        if(mapDisponibiliteParIdMecanicien.has(listeToutMecanicien[i]._id)){
            listeToutMecanicien[i].disponibilite = mapDisponibiliteParIdMecanicien.get(listeToutMecanicien[i]._id)
        }
        else{
            listeToutMecanicien[i].disponibilite= [  
                {
                    dateDebut : new Date("2025-03-06T08:00:00Z"),
                    dateFin : new Date("2025-03-06T17:00:00Z")
                }
            ]
        }
      
        console.log( listeToutMecanicien[i])
    }
    // console.log(listeToutMecanicien)
}

// async function RecuperationListeTacheSurIntervalleDateEtService(dateDemandeDebut , dateDemandeFin , idService){
//     listeTache=await TacheMecanicien.find({
//         $or:[
//                 {$and: [
//                     { dateDebut: { $gte: new Date(dateDemandeDebut) }} ,
//                     {dateFin: { $lte: new Date(dateDemandeFin) } },
//                     {idservice: idService }

//                 ]},
//                 {$and: [
//                     { dateDebut: { $lte: new Date(dateDemandeDebut) }} ,
//                      {dateFin: { $gte: new Date(dateDemandeFin) } },
//                      {idservice: idService }
//                 ]},
//                 { $and: [
//                         {dateDebut: { $lte: new Date(dateDemandeDebut) }} ,
//                         {dateFin: { $gte: new Date(dateDemandeDebut) }} ,
//                         {dateFin: { $lte: new Date(dateDemandeFin) }},
//                         {idservice: idService }  
//                     ]
//                 },
//                 {
//                     $and: [
//                         {dateDebut: { $gte: new Date(dateDemandeDebut) } },  
//                         {dateDebut: { $lte: new Date(dateDemandeFin) }} ,
//                         {dateFin: { $gte: new Date(dateDemandeFin) }}
//                     ]
//                 }

            
//         ]
//     });
//     return listeTache
// }

async function RecuperationListeTacheSurIntervalleDateEtService(dateDemandeDebut , dateDemandeFin , idService , idDemande){
    console.log("dateDemandeDebut : "+dateDemandeDebut+" | dateDemandeFin : "+dateDemandeFin)
    listeTache=await TacheMecanicien.find({
        $or:[
                {$and: [
                    { dateDebut: { $gt: (dateDemandeDebut) }} ,
                    {estimation: { $lte: (dateDemandeFin) } },
                    {idservice: idService } 
                    ,
                    { $or: [
                        {idDemande: 0 } , 
                        {idDemande: idDemande } , 
                    ]}

                ]},
                {$and: [
                    { dateDebut: { $lte: (dateDemandeDebut) }} ,
                     {estimation: { $gt: (dateDemandeFin) } },
                     {idservice: idService } ,
                     { $or: [
                        {idDemande: 0 } , 
                        {idDemande: idDemande } , 
                    ]}
                ]},
                { $and: [
                        {dateDebut: { $lte: (dateDemandeDebut) }} ,
                        {estimation: { $gt: (dateDemandeDebut) }} ,
                        {estimation: { $lte: (dateDemandeFin) }},
                        {idservice: idService } ,
                        { $or: [
                            {idDemande: 0 } , 
                            {idDemande: idDemande } , 
                        ]}
                    ]
                },
                {
                    $and: [
                        {dateDebut: { $gt: (dateDemandeDebut) } },  
                        {dateDebut: { $lte: (dateDemandeFin) }} ,
                        {estimation: { $gt: (dateDemandeFin) }},
                        {idservice: idService }   
                        ,
                        { $or: [
                            {idDemande: 0 } , 
                            {idDemande: idDemande } , 
                        ]}
                    ]
                }

            
        ]
    });
    return listeTache
}


async function RegroupeLesTachesParIdMecanicien(listeTache){
    let map = new Map()
    for( i = 0 ; i<listeTache.length ; i++){
        if(map.has(listeTache[i].idMeca)){
            tableau =map.get(listeTache[i].idMeca)
            tableau.push(
                {   dateDebut :listeTache[i].dateDebut , 
                    dateFin :listeTache[i].dateFin , 
                }
            )
            map.set(listeTache[i].idMeca, tableau);
        }else{
            map.set(listeTache[i].idMeca, [
                {   dateDebut :listeTache[i].dateDebut , 
                    dateFin :listeTache[i].dateFin , 
                }
            ]);
        }
    }
    return map
}


async function RechercheMecanicienSelonSpecialite(idSpecialite){
    listeMecanicien=await Mecanicien.find(  {"specialites._id": idSpecialite})
    return listeMecanicien
}

function RecuperationListeMecanicienDisponible(listeMecanicienSelonService , MapMecanicienOccupe){
    resultat = []
    // console.log(listeMecanicienSelonService)
    // console.log(MapMecanicienOccupe)
    for(i=0 ; i<listeMecanicienSelonService.length ; i++){
        if(MapMecanicienOccupe.has(listeMecanicienSelonService[i]._id)==false){
            resultat.push(listeMecanicienSelonService[i])
        }
    }
    return resultat
}

async function RecuperationMecanicienDisponibleAUneIntervalleDeDate(dateDemandeDebut ,dateDemandeFin , idService , idDemande){
    listeTacheMecanicien=await RecuperationListeTacheSurIntervalleDateEtService(dateDemandeDebut ,dateDemandeFin , idService  ,idDemande)
    // console.log(listeTacheMecanicien)
    mapListeTacheMecanicien =await RegroupeLesTachesParIdMecanicien(listeTacheMecanicien)
    // console.log(mapListeTacheMecanicien)
    listeMecanicienSelonService = await RechercheMecanicienSelonSpecialite(idService)
    listeMecanicienDispo = RecuperationListeMecanicienDisponible(listeMecanicienSelonService , mapListeTacheMecanicien)
    return listeMecanicienDispo
}


async function ProposerUnRendezVousSelonService(idService ,heureDeTravailMatinInitial , heureDeTravailSoirInitial , dateDebut ,dureeServiceMinute , nbrMecanicienUtiliser , idDemande){
    heureDeTravailMatin = Object.assign({} , heureDeTravailMatinInitial)
    heureDeTravailSoir =  Object.assign({} ,heureDeTravailSoirInitial)
 
    if(dateDebut == null){  dateDebut = new Date((heureDeTravailMatin.dateDebut).getTime() )}
    resultatDateDebutEtFin=AjoutDateParRapportHeureDeTravail(heureDeTravailMatin , heureDeTravailSoir , dateDebut ,dureeServiceMinute )
    dateDebut= resultatDateDebutEtFin.dateDebut
    dateFin= resultatDateDebutEtFin.dateFin
    nbrMecanicienDispo= 0
    listePersonnelDispo = []
    while(  nbrMecanicienDispo<nbrMecanicienUtiliser ){
        // console.log("dateDebut : "+dateDebut+" --- dateFin : "+dateFin)
        listePersonnelDispo=await RecuperationMecanicienDisponibleAUneIntervalleDeDate(dateDebut ,dateFin , idService , idDemande)
        // console.log(listePersonnelDispo)
        nbrMecanicienDispo= listePersonnelDispo.length
        if( nbrMecanicienDispo>=nbrMecanicienUtiliser ){ break }
        dateDebut= dateFin
        resultatDateDebutEtFin=AjoutDateParRapportHeureDeTravail(heureDeTravailMatin , heureDeTravailSoir , dateDebut ,dureeServiceMinute )
        dateDebut= resultatDateDebutEtFin.dateDebut
        dateFin= resultatDateDebutEtFin.dateFin
        // console.log("dateDebut5 : "+dateDebut+" --- dateFin5 : "+dateFin)
      
    }
    return {
        idDemande : idDemande ,
        nbrMecanicienUtiliser : nbrMecanicienUtiliser,
        idService : idService ,
        dateDebutDisponibiliteMecanicien : dateDebut ,
        dateFinDisponibiliteMecanicien : dateFin ,
        listeMecanicien : listePersonnelDispo 
    }


}

function verificationParRapportHeureDetravailMatin(heureDeTravailMatin , heureDetravailSoir , dateDebut ,dateFin ,dureeServiceMinute){
    if(dateDebut<=heureDeTravailMatin.dateDemandeFin &&heureDeTravailMatin.dateFin< dateFin){
        dateDebut= heureDetravailSoir.dateDebut
        dateFin= dateDebut.setMinutes(dateDebut.getMinutes() + dureeServiceMinute); 
    }
    if(heureDeTravailMatin.dateFin<=dateDebut && dateFin<=heureDetravailSoir.dateDebut){
        dateDebut= heureDetravailSoir.dateDebut
        dateFin= dateDebut.setMinutes(dateDebut.getMinutes() + dureeServiceMinute); 
    }
    if(dateDebut<heureDetravailSoir.dateDebut && heureDetravailSoir.dateDebut<=dateFin){
        dateDebut= heureDetravailSoir.dateDebut
        dateFin= dateDebut.setMinutes(dateDebut.getMinutes() + dureeServiceMinute);
    }
    if((dateDebut<=heureDeTravailSoir.dateDemandeFin &&heureDeTravailSoir.dateFin< dateFin) || heureDeTravailSoir.dateFin< dateDebut ){
        dateDebut= (heureDeTravailMatin.dateDebutdate).setDate(heureDetravailSoir.dateDebutdate.getDate() + 1);
        dateFin= dateDebut.setMinutes(dateDebut.getMinutes() + dureeServiceMinute);
    }
    return dateDebut,dateFin
}

function AjoutDateParRapportHeureDeTravail(heureDeTravailMatin , heureDeTravailSoir , dateDebut ,dureeServiceMinute ){
    dateFin = new Date(dateDebut.getTime())
    dateFin=  new Date(dateFin.setMinutes(dateFin.getMinutes() + dureeServiceMinute)); 
    // console.log("dateDebut3 : "+dateDebut)
   
    if(dateDebut<=heureDeTravailMatin.dateFin &&heureDeTravailMatin.dateFin< dateFin){
        dateDebut= new Date( (heureDeTravailSoir.dateDebut).getTime())
        dateFin = new Date(dateDebut.getTime())
        dateFin=  new Date(dateFin.setMinutes(dateFin.getMinutes() + dureeServiceMinute));  
    }
     
    if(heureDeTravailMatin.dateFin<=dateDebut && dateFin<=heureDeTravailSoir.dateDebut){
        dateDebut= new Date((heureDeTravailSoir.dateDebut).getTime())
        dateFin = new Date(dateDebut.getTime())
        dateFin=  new Date(dateFin.setMinutes(dateFin.getMinutes() + dureeServiceMinute)); 
    }
    
    if(dateDebut<heureDeTravailSoir.dateDebut && heureDeTravailSoir.dateDebut<=dateFin){
        dateDebut= new Date(  (heureDeTravailSoir.dateDebut).getTime())
        dateFin = new Date(dateDebut.getTime())
        dateFin=  new Date(dateFin.setMinutes(dateFin.getMinutes() + dureeServiceMinute));
    }
    
    if((dateDebut<=heureDeTravailSoir.dateFin &&heureDeTravailSoir.dateFin< dateFin) || heureDeTravailSoir.dateFin< dateDebut ){

        dateDebut= new Date((new Date((heureDeTravailMatin.dateDebut).getTime())).setDate(heureDeTravailSoir.dateDebut.getDate() + 1));
        dateFin = new Date(dateDebut.getTime())
        dateFin=  new Date(dateFin.setMinutes(dateFin.getMinutes() + dureeServiceMinute));
        heureDeTravailSoir.dateFin = new Date((new Date((heureDeTravailSoir.dateFin).getTime())).setDate(heureDeTravailSoir.dateFin.getDate() + 1));
        heureDeTravailSoir.dateDebut = new Date((new Date((heureDeTravailSoir.dateDebut).getTime())).setDate(heureDeTravailSoir.dateDebut.getDate() + 1));
        heureDeTravailMatin.dateFin = new Date((new Date((heureDeTravailMatin.dateFin).getTime())).setDate(heureDeTravailMatin.dateFin.getDate() + 1));
        heureDeTravailMatin.dateDebut = new Date((new Date((heureDeTravailMatin.dateDebut).getTime())).setDate(heureDeTravailMatin.dateDebut.getDate() + 1));
    }
    return {
        dateDebut : dateDebut ,
        dateFin : dateFin 
    }
}

function convertirHeureEnMinutes(heure) {
    
    const [h, m] = heure.split(':').map(Number);
    return h * 60 + m;
}

async function RecuperationHeureDeTravail(dateSaisie){

    heureDeTravailMatin = await HeureDeTravail.findOne({_id:1})
    heureDeTravailSoir = await HeureDeTravail.findOne({_id:2})
    
    dateDebutHeureTravailMatin = new Date(dateSaisie)
    dateDebutHeureTravailSoir = new Date(dateSaisie)
    dateFinHeureTravailMatin = new Date(dateSaisie)
    dateFinHeureTravailSoir = new Date(dateSaisie)
    // console.log(heureDeTravailMatin)
    // console.log("dateDebutHeureTravailMatin : "+new Date(dateDebutHeureTravailMatin.setMinutes(dateDebutHeureTravailMatin.getMinutes()  + convertirHeureEnMinutes(heureDeTravailMatin.heureDebut))))
    // console.log("dateFinHeureTravailMatin : "+new Date(dateFinHeureTravailMatin.setMinutes( dateFinHeureTravailMatin.getMinutes() +convertirHeureEnMinutes(heureDeTravailMatin.heureFin))))
    // console.log("dateDebutHeureTravailSoir : "+new Date(dateDebutHeureTravailSoir.setMinutes( dateDebutHeureTravailSoir.getMinutes() + convertirHeureEnMinutes(heureDeTravailSoir.heureDebut))) )
    // console.log("dateFinHeureTravailSoir : "+new Date(dateFinHeureTravailSoir.setMinutes(dateFinHeureTravailSoir.getMinutes() +convertirHeureEnMinutes(heureDeTravailSoir.heureFin))))
  
    heureDeTravailMatinEnMinute ={
        dateDebut : new Date(dateDebutHeureTravailMatin.setMinutes(dateDebutHeureTravailMatin.getMinutes()  + convertirHeureEnMinutes(heureDeTravailMatin.heureDebut))),
        dateFin : new Date(dateFinHeureTravailMatin.setMinutes( dateFinHeureTravailMatin.getMinutes() +convertirHeureEnMinutes(heureDeTravailMatin.heureFin)))
    }
    heureDeTravailSoirEnMinute ={
        dateDebut : new Date(dateDebutHeureTravailSoir.setMinutes( dateDebutHeureTravailSoir.getMinutes() + convertirHeureEnMinutes(heureDeTravailSoir.heureDebut))),
        dateFin : new Date(dateFinHeureTravailSoir.setMinutes(dateFinHeureTravailSoir.getMinutes() +convertirHeureEnMinutes(heureDeTravailSoir.heureFin)))
    }

    return {
        heureDeTravailMatin: heureDeTravailMatinEnMinute ,
        heureDeTravailSoir : heureDeTravailSoirEnMinute
    }
}

async function CreationTacheTemporairePourLeMecanicien(Proposition){
    listeTache =[]
    listeMecanicienRattache = []
    for(let i =0 ; i<Proposition.nbrMecanicienUtiliser ; i++){
        tache = new TacheMecanicien({
            idMeca: Proposition.listeMecanicien[i]._id,
            idservice: Proposition.idService,
            dateDebut: Proposition.dateDebutDisponibiliteMecanicien,
            status: 0,
            estimation: Proposition.dateFinDisponibiliteMecanicien,
            idDemande : Proposition.idDemande,
        })
        await tache.save();
        listeMecanicienRattache.push(Proposition.listeMecanicien[i])
    }
    return listeMecanicienRattache
}

function regroupeLesPacksEtLesServicesEnTableauDeService(listePack , listeService){
    
    let listeToutService = [] 
    let map = new Map()
    for(let i = 0 ; i<listeService.length ; i++){
        listeToutService.push(listeService[i])
    }
    for(let i = 0 ; i<listePack.service.length ; i++){
        listeToutService.push(listePack.service[i])
    }
    for( i = 0 ; i<listeToutService.length ; i++){
        
        if(map.has(listeToutService[i]._id) == false){
            map.set(listeToutService[i]._id, listeToutService[i]);
        }
    }
    const resultat = [...map.values()];
    return resultat 
}

function regrouperLesPropositionParService(listeProposition){
    let map = new Map()
    for( i = 0 ; i<listeProposition.length ; i++){
        if(map.has(listeProposition[i].idService) == false){
            map.set(listeProposition[i].idService, listeProposition[i]);
        }
    }
    return map
}


async function RecuperationToutPropositionAPartirDateSaisie(dateSaisie ,idDemande , listeService){
    heureDeTravail=await RecuperationHeureDeTravail(dateSaisie)
    heureDeTravailMatinInitial = heureDeTravail.heureDeTravailMatin
    heureDeTravailSoirInitial = heureDeTravail.heureDeTravailSoir
    let resultat =[]
    
    dateDebut =( new Date((heureDeTravail.heureDeTravailMatin.dateDebut).getTime()))
    for(let i=0 ; i<listeService.length ; i++){
        console.log(i)
        let propositionFinale = await ProposerUnRendezVousSelonService(listeService[i]._id ,heureDeTravailMatinInitial , heureDeTravailSoirInitial , new Date(dateDebut.getTime()) ,listeService[i].estimation , listeService[i].nbrmeca , idDemande)
        let listeMecaFinal=await CreationTacheTemporairePourLeMecanicien(propositionFinale)
        propositionFinale.listeMecanicien = listeMecaFinal
        resultat.push(propositionFinale)
    }
    return await Promise.all(resultat) 
}

function relierLesPropositionAuInformationDeLaDemande(mapPropositionParService , informationSurLeDemande){
    copieInformationSurLeDemande = Object.assign({} , informationSurLeDemande)
    for(let i = 0 ; i<copieInformationSurLeDemande.listeService.length ; i++){
        let idService = copieInformationSurLeDemande.listeService[i]._id
        let propositionPourLeService = mapPropositionParService.get(idService)
        copieInformationSurLeDemande.listeService[i].proposition = propositionPourLeService
        // console.log(copieInformationSurLeDemande.listeService[i])
    }
    for(let i = 0 ; i<copieInformationSurLeDemande.listePack.service.length ; i++){

        let idService =copieInformationSurLeDemande.listePack.service[i]._id
        let propositionPourLeService = mapPropositionParService.get(idService)
        copieInformationSurLeDemande.listePack.service[i].proposition = propositionPourLeService
        // console.log(copieInformationSurLeDemande.listePack.service[i])

    }
    return copieInformationSurLeDemande

}

async function TraitementPourLaRecuperationProposition( informationSurLeDemande , dateSaisie){
    let resultat = null;
    let status = 201;
    let error = '';
    try{
        demande = await new Demande().save()
        idDemande = demande._id
        listeToutLesServices=regroupeLesPacksEtLesServicesEnTableauDeService(informationSurLeDemande.listePack , informationSurLeDemande.listeService)
        console.log(listeToutLesServices)
        propositionPourChaqueServices=await RecuperationToutPropositionAPartirDateSaisie(dateSaisie ,idDemande , listeToutLesServices)
        mapPropositionParService = regrouperLesPropositionParService(propositionPourChaqueServices)
        resultat = (relierLesPropositionAuInformationDeLaDemande(mapPropositionParService , informationSurLeDemande))
        resultat.idDemande = idDemande
        resultat= resultat
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "informationSurLesProposition": resultat
    }
}

async function ChangerLesStatusDesTaches(idDemande , informationFacture){
    let resultat = null;
    let status = 201;
    let error = '';
    try{
        factureInserer = await new Facture(informationFacture).save()
        await TacheMecanicien.updateMany({ idDemande : idDemande }, { $set: { status: 0  , idDemande: 0  , idfact : factureInserer._id } });
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
    }
}

// function regroupeParIdService


module.exports = { RattachementDisponibiliteDansMecanicien,IntersectionDeuxIntervaleDate ,EnleverUnIntervalDeDateAUneAutreDate ,
     SuppressionIntervaleDateDansChaqueListeIntervale , SuppressionListeIntervaleDateDansChaqueListeIntervale , RecuperationTacheParMecanicien ,
      DisponibilitePourUtilisateur , RecuperationListeMecanicien , RecuperationListeTacheSurIntervalleDateEtService 
    , RechercheMecanicienSelonSpecialite , RegroupeLesTachesParIdMecanicien,AjoutDateParRapportHeureDeTravail ,
    RecuperationListeMecanicienDisponible , RecuperationMecanicienDisponibleAUneIntervalleDeDate , ProposerUnRendezVousSelonService ,
    RecuperationToutPropositionAPartirDateSaisie,TraitementPourLaRecuperationProposition , ChangerLesStatusDesTaches}