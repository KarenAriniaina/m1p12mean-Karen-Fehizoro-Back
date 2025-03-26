const TokenNotif = require('../models/TokenNotif');
const admin = require("firebase-admin");
const serviceAccount = require("../garazy-4ce07-firebase-adminsdk-fbsvc-115b4a2e32.json");
const PackPromoService = require('../models/PackPromoService');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function envoiNotifPromo(promo) {
    try {
        const tokens = await TokenNotif.find().select("token -_id");
        const tokenList = tokens.map((t) => t.token);

        if (tokenList.length > 0) {
            const message = {
                notification: {
                    title: (promo.idservice==0)? "Pack!":"Promotion!",
                    body: (promo.idservice==0)? `Profitez de notre pack ${promo.nom}`:`Ne ratez pas notre promotion ${promo.nom}`,
                    image: promo.photo ? promo.photo[0] : "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png"
                },
                webpush: {
                    notification: {
                        icon: "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png",
                    },
                }
            };

            const promises = tokenList.map(token => {
                const messageWithToken = { ...message, token };
                return admin.messaging().send(messageWithToken);
            });
            await Promise.all(promises);
        }
        console.log("Envoyé")
    } catch (error) {
        console.log(error)
        console.log("Erreur envoi notif")
    }
};

module.exports = { envoiNotifPromo }
