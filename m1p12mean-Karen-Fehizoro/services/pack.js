const cloudinary = require('../config/cloudinary');
const PackPromoService = require('../models/PackPromoService');

async function envoiePhotoCloud(deletedImages, newphoto) {
    // on efface ce qui sont effacés
    for (const imageUrl of deletedImages) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`garazy/packs/${publicId}`);
    }
    let newimage = [];
    // upload les nouveaux
    if (newphoto && newphoto.length > 0) {
        try {
            for (const file of newphoto) {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'garazy/packs' }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }).end(file.buffer);
                });
                newimage.push(result);
            }
        } catch (error) {
            console.log(error.message);
            throw new Error("Erreur lors de l'envoi des photos");
        }
    }
    return newimage;
}

async function creerPackService(nom, services, dd, df, tarif, photos) {
    let pack = null;
    let status = 201;
    let error = '';
    try {
        services=JSON.parse(services)
        if (!nom || !services || !dd || !df || !tarif) throw new Error("Veuillez tout remplir");
        let idservice = 0;
        if (services.length == 1) idservice = services[0]._id
        pack = new PackPromoService({
            nom: nom,
            service: services,
            dateDebut: dd,
            dateFin: df,
            idservice: idservice,
            tarif: tarif
        })
        let imageUrls = await envoiePhotoCloud([], photos);
        pack.photo = imageUrls;
        await pack.save();
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "pack": pack
    }
}

async function ModifierPackService(id, type, nom, services, dd, df, tarif, existingphoto, newphoto) {
    let pack = null;
    let status = 200;
    let error = '';
    try {
        if (!id) throw new Error(`Aucun ${type} à modifier`);
        if (!nom || !services || !dd || !df || !tarif) throw new Error("Veuillez tout remplir");
        pack = await PackPromoService.findById({ _id: id });
        if (!pack) throw new Error(`Aucun ${type} à modifier avec l'id ${id}`);
        const existingImageUrls = existingphoto ? JSON.parse(existingphoto) : [];
        const deletedImages = servamodif.photo.filter(url => !existingImageUrls.includes(url));
        const newimages = await envoiePhotoCloud(deletedImages, newphoto);
        const updatedImages = [...existingImageUrls, ...newimages];
        pack.nom = nom;
        pack.service = services;
        pack.dateDebut = dd;
        pack.dateFin = df;
        pack.tarif = tarif;
        pack.photo = updatedImages;
        await pack.save();
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "pack": pack
    }
}

async function ArreterPack(id, type) {
    let pack = null;
    let status = 200;
    let error = '';
    try {
        if (!id) throw new Error(`Aucun ${type} à arrêter`);
        pack = await PackPromoService.findById({ _id: id });
        if (!pack) throw new Error(`Aucun ${type} à arrêter avec l'id ${id}`);
        pack.statut = 20; //20 status arret
        await pack.save();
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "pack": pack
    }
}

async function SupprimerPack(id, type) {
    let pack = null;
    let status = 200;
    let error = '';
    try {
        if (!id) throw new Error(`Aucun ${type} à supprimer`);
        pack = await PackPromoService.findById({ _id: id });
        if (!pack) throw new Error(`Aucun ${type} à supprimer avec l'id ${id}`);
        await pack.deleteOne();
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "pack": pack
    }
}

async function ListePack(type, dd, df, nom, statut) {
    // type=0 si promo 1 si pack
    let pack = [];
    let status = 200;
    let error = '';
    try {
        let query = {};

        if (type == 0) query.idservice = { $ne: 0 }
        if (dd) query.dateDebut = { $gte: dd };
        if (df) query.dateFin = { $lte: df };
        if (nom) query.nom = { $regex: nom, $options: 'i' };
        if (statut) query.statut = statut;
        pack = await PackPromoService.find(query);
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "pack": pack
    }
}

module.exports = { ListePack, ArreterPack, ModifierPackService, SupprimerPack, creerPackService }