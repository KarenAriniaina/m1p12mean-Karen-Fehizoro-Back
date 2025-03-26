const DepotOuRetrait = require('../models/DepotEtRetrait')
const client = require('../models/Client')
const depotEtRetrait = require('../models/DepotEtRetrait');

async function insertionRetraitOuDepotAvecNouveauSolde(objetInfomationDepotOuRetrait) {
    let status = 200;
    let error = '';
    let servamodif = null;
    try {
        if(objetInfomationDepotOuRetrait.depot== null || objetInfomationDepotOuRetrait.depot<0 || objetInfomationDepotOuRetrait.retrait== null || objetInfomationDepotOuRetrait.retrait<0  ){ throw new Error("Erreur sur le montant!")}
        clientAModifier= await client.findById({ _id: objetInfomationDepotOuRetrait.id_client });
        if(clientAModifier == null){ throw new Error("Le client n'existe pas!") }
        if(objetInfomationDepotOuRetrait.depot == null || objetInfomationDepotOuRetrait.depot >0){clientAModifier.solde = clientAModifier.solde+objetInfomationDepotOuRetrait.depot}
        else if (objetInfomationDepotOuRetrait.retrait == null || objetInfomationDepotOuRetrait.retrait >0){
            if(clientAModifier.solde < objetInfomationDepotOuRetrait.retrait){ throw new Error("Solde insuffisant!") }
            clientAModifier.solde = clientAModifier.solde-objetInfomationDepotOuRetrait.retrait
        }
        depotEtRetrait = new DepotOuRetrait(objetInfomationDepotOuRetrait);
        await client.findByIdAndUpdate(objetInfomationDepotOuRetrait._id, clientAModifier, { new: true });
        await depotEtRetrait.save();
    } catch (err) {
        status = 400;
        error = err.message;
    }
    return {
        "status": status,
        "error": error,
        "service": servamodif
    }
}


module.exports = { insertionRetraitOuDepotAvecNouveauSolde}