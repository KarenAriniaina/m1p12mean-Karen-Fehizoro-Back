const DepotEtRetrait = require('../models/DepotEtRetrait')
const client = require('../models/Client')

async function insertionRetraitOuDepotAvecNouveauSolde(objetInfomationDepotOuRetrait,user) {
	let status = 200;
	let error = '';
	let clientsolde = null;
	try {
        objetInfomationDepotOuRetrait.depot=Number(objetInfomationDepotOuRetrait.depot)
        objetInfomationDepotOuRetrait.retrait=Number(objetInfomationDepotOuRetrait.retrait)
		if(objetInfomationDepotOuRetrait.depot<=0 && objetInfomationDepotOuRetrait.retrait<=0 ){ throw new Error("Erreur sur le montant!")}
		clientsolde= await client.findById({ _id: user.id });
		if(clientsolde == null){ throw new Error("Le client n'existe pas!") }
		if(objetInfomationDepotOuRetrait.depot >0){clientsolde.solde +=objetInfomationDepotOuRetrait.depot}
		else if (objetInfomationDepotOuRetrait.retrait >0){
			if(clientsolde.solde < objetInfomationDepotOuRetrait.retrait){ throw new Error("Solde insuffisant!") }
			clientsolde.solde = clientsolde.solde-objetInfomationDepotOuRetrait.retrait
		}
		let dep = new DepotEtRetrait(objetInfomationDepotOuRetrait);
        dep.id_client=user.id;
		await clientsolde.save();
		await dep.save();
	} catch (err) {
		status = 400;
		error = err.message;
	}
	return {
		"status": status,
		"error": error,
		"clientsolde":clientsolde
	}
}

async function ListeDepotEtRetrait(user){
	let statut=200;
	let error='';
	let ldr=[];
	try {
		ldr=await DepotEtRetrait.find({id_client: user.id})
			.sort({ _id: -1 }) 
			.exec()
	} catch (err) {
		statut=400;
		error= err.message;
	}
	return {
		"status": statut,
		"error": error,
		"ldr": ldr
	}
}

module.exports = { insertionRetraitOuDepotAvecNouveauSolde,ListeDepotEtRetrait}
