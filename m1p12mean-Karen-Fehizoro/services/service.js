const Service = require('../models/Service')
const cloudinary = require('../config/cloudinary');

async function CreationService(nom, tarif, estimation, nbrmeca, description, filesphoto) {
    let serv = null;
    let status = 201;
    let error = '';
    try {
        if (!nom || !tarif || !estimation || !nbrmeca) throw new Error("Veuillez tout remplir");
        let servexistant = await Service.findOne({ nom: nom });
        if (servexistant) throw new Error("Un service existe déjà avec le nom saisi");
        serv = new Service({
            nom: nom,
            tarif: tarif,
            estimation: estimation,
            nbrmeca: nbrmeca,
            description: description
        });
        let imageUrls = [];
        if (filesphoto && filesphoto.length > 0) {
            try {
                for (const file of filesphoto) {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'garazy/services' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }).end(file.buffer);
                    });
                    imageUrls.push(result);
                }
            } catch (error) {
                throw new Error("Erreur lors de l'envoi des photos");
            }
        }
        serv.photo = imageUrls;
        await serv.save();
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "service": serv
    }
}

async function ModificationService(id, nom, tarif, estimation, nbrmeca, description, existingphoto, newphoto) {
    let status = 200;
    let error = '';
    let servamodif = null;
    try {
        if (!nom || !tarif || !estimation || !nbrmeca) throw new Error("Veuillez tout remplir");
        let servexistant = await Service.findOne({ nom: nom });
        if (servexistant && servexistant._id.toString() !== id) throw new Error("Un service existe déjà avec le nom saisi");
        servamodif = await Service.findById({ _id: id });
        if (!servamodif) throw new Error(`Aucune service à modifier avec l'id ${id}`);
        let newimage = [];
        const existingImageUrls = existingphoto ? JSON.parse(existingphoto) : [];
        const deletedImages = servamodif.photo.filter(url => !existingImageUrls.includes(url));

        // on efface ce qui sont effacés
        for (const imageUrl of deletedImages) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`garazy/services/${publicId}`);
        }

        // upload les nouveaux
        if (newphoto && newphoto.length > 0) {
            try {
                for (const file of newphoto) {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'garazy/services' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }).end(file.buffer);
                    });
                    newimage.push(result);
                }
            } catch (error) {
                throw new Error("Erreur lors de l'envoi des photos");
            }
        }
        const updatedImageUrls = [...existingImageUrls, ...newimage];
        servamodif.nom = nom;
        servamodif.tarif = tarif;
        servamodif.estimation = estimation;
        servamodif.nbrmeca = nbrmeca;
        servamodif.description = description;
        servamodif.photo = updatedImageUrls
        await servamodif.save()
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

async function SupprimerService(id) {
    let status = 200;
    let error = '';
    let servasuppr = null;
    try {
        servasuppr = await Service.findById({ _id: id });
        if (!servasuppr) throw new Error(`Aucun service à supprimer avec l'id ${id}`);
        // on efface ces photos de cloud
        // for (const imageUrl of servasuppr.photo) {
        //     const publicId = imageUrl.split('/').pop().split('.')[0];
        //     await cloudinary.uploader.destroy(`garazy/services/${publicId}`);
        // }
        await servasuppr.deleteOne();
    } catch (err) {
        status = 400;
        error = err.message;
    }
    return {
        "status": status,
        "error": error,
        "service": servasuppr
    }
}

async function getOneService(id) {
    let status = 200;
    let error = '';
    let serv = null;
    try {
        serv = await Service.findById({ _id: id });
        if (!serv) throw new Error(`Aucune service trouvé avec l'id ${id}`);
    } catch (err) {
        status = 400;
        error = err.message;
    }
    return {
        "status": status,
        "error": error,
        "service": serv
    }
}

module.exports = { CreationService, ModificationService, SupprimerService, getOneService }