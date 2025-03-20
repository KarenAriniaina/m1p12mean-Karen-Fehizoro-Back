const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');
const auth = require('../services/auth')
const bcrypt = require('bcryptjs');

const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', async (req, res) => {
    try {
        let infoMecanicien = req.body
        console.log(infoMecanicien)
        infoMecanicien.mdp = await HashMdp(infoMecanicien.mdp)
        const mecaniciens = new Mecanicien(infoMecanicien);
        await mecaniciens.save();
        res.status(201).json(mecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const mecaniciens = await Mecanicien.find();
    res.json(mecaniciens);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.get('/:id', async (req, res) => {
    try {
        const mecanicien = await Mecanicien.findById(req.params.id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien non trouvé" });
        }

        res.json(mecanicien);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let infoMecanicien = req.body
        // infoMecanicien.mdp = await HashMdp(infoMecanicien.mdp)
        const mecaniciens = await Mecanicien.findByIdAndUpdate(req.params.id, infoMecanicien, { new: true });
        res.json(mecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await Mecanicien.findByIdAndDelete(req.params.id);
        res.json({ message: "Mecanicien supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/modificationMecanicienAvecUploadPhoto', upload.single('image'), async (req, res) => {
    const {  id,nom,prenom,adresse,email,numtel,login , mdp ,nouveauMdp ,photoActuelle} = req.body;
    const specialites = JSON.parse(req.body.specialites);
    console.log( id,nom,prenom,adresse,email,numtel,login , mdp, specialites ,nouveauMdp,photoActuelle)
    const response = await uploadPhotoEtModificationMecanicien( id,nom,prenom,adresse,email,numtel,login , mdp, specialites , nouveauMdp ,photoActuelle,req.file); // req.file au lieu de req.files
    res.status(response.status).json({
        message: response.error,
        service: response.service
    });
});


async function uploadPhotoEtModificationMecanicien(id,nom,prenom,adresse,email,numtel,login , mdp, specialites, nouveauMdp ,photoActuelle,filesphoto) {
    let mecanicienModif = null;
    let status = 201;
    let error = '';
    try {

        mecanicienModif = new Mecanicien({
            _id:id,
            nom:nom ,
            prenom:prenom ,
            login:login ,
            mdp:mdp ,
            email:email ,
            numtel:numtel ,
            adresse:adresse ,
            specialites:specialites ,
            photo: photoActuelle
        })

        let imageUrls = "";
        if (filesphoto ) {
            try {
                
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'garazy/mecaniciens' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }).end(filesphoto.buffer);
                    });
                    imageUrls=result;
                    mecanicienModif.photo = imageUrls;
            } catch (error) {
                throw new Error("Erreur lors de l'envoi des photos");
            }
        }
        if(nouveauMdp && nouveauMdp!=""){
            mecanicienModif.mdp = await HashMdp(nouveauMdp)
        }
        
        await Mecanicien.findByIdAndUpdate(id, mecanicienModif, { new: true });
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "mecanicien": mecanicienModif
    }
}




async function HashMdp(mdp) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    return await bcrypt.hash(mdp, salt); // Hash password
}


module.exports = router;
