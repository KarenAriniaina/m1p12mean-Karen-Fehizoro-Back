require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
 .catch(err => console.log(err));

 // Routes
app.use('/articles', require('./routes/articleRoutes'));
app.use('/clients', require('./routes/clientRoutes'));
app.use('/managers', require('./routes/managerRoutes'));
app.use('/services', require('./routes/serviceRoutes'));
app.use('/packPromoServices', require('./routes/packPromoServiceRoutes'));
app.use('/mecanicien', require('./routes/mecanicienRoutes'));
app.use('/tacheMecanicien', require('./routes/tacheMecanicienRoutes'));
app.use('/depenseExceptionnelle', require('./routes/depenseExceptionnelle'));
app.use('/recetteExceptionnelle', require('./routes/recetteExceptionnelle'));
app.listen(PORT, () => console.log(`Serveur démarré sur le port${PORT}`));
