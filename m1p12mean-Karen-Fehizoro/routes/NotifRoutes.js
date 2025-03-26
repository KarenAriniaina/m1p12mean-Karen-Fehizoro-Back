const express = require('express');
const TokenNotif = require('../models/TokenNotif');
const router = express.Router();
// notification firebase
const admin = require("firebase-admin");
const serviceAccount = require("../garazy-4ce07-firebase-adminsdk-fbsvc-115b4a2e32.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

router.post("/subscribe", async (req, res) => {
  const { iduser, typeuser, token } = req.body;
  try {
    const existingToken = await TokenNotif.findOne({ token });
    if (!existingToken) {
      await TokenNotif.create({ token, iduser: iduser || null, typeuser: typeuser || 2 });
    } else {
      if (!existingToken.iduser && iduser) {
        existingToken.iduser = iduser;
        existingToken.typeuser = typeuser;
        await existingToken.save();
      }
    }
    res.status(201).json({ message: "FCM token stored successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue", error });
  }
});


// router.get("/send-notification", async (req, res) => {
//   try {
//     const tokens = await TokenNotif.find().select("token -_id");
//     const tokenList = tokens.map((t) => t.token);
//     console.log(tokenList)
//     if (tokenList.length === 0) {
//       return res.status(400).json({ message: "No tokens found!" });
//     }

//     const message = {
//       notification: {
//         title: "Hello!",
//         body: "This is a test push notification",
//         image: "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png"
//       },
//       webpush: {
//         notification: {
//           icon: "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png", // Small icon (like favicon)
//         },
//       }
//     };

//     const promises = tokenList.map(token => {
//       const messageWithToken = { ...message, token };
//       return admin.messaging().send(messageWithToken);
//     });

//     const response = await Promise.all(promises);
//     res.status(200).json({ success: true, response });
//   } catch (error) {
//     res.status(500).json({ success: false, error });
//   }
// });


// router.get("/send-notification-promo", async (req, res) => {
//   try {
//     const tokens = await TokenNotif.find().select("token -_id");
//     const tokenList = tokens.map((t) => t.token);

//     if (tokenList.length === 0) {
//       return res.status(400).json({ message: "No tokens found!" });
//     }

//     const message = {
//       notification: {
//         title: "Hello!",
//         body: "This is a test push notification",
//         image: "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png"
//       },
//       webpush: {
//         notification: {
//           icon: "https://res.cloudinary.com/dvlzckz8s/image/upload/v1742545652/garazy/mudybfpmxpejlzcet6jx.png", // Small icon (like favicon)
//         },
//       }
//     };

//     const promises = tokenList.map(token => {
//       const messageWithToken = { ...message, token };
//       return admin.messaging().send(messageWithToken);
//     });

//     const response = await Promise.all(promises);
//     res.status(200).json({ success: true, response });
//   } catch (error) {
//     res.status(500).json({ success: false, error });
//   }
// });

module.exports = router;
