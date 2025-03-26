const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middlewares/AuthMiddleware');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:4200",
    "http://localhost:4201",
    // "http://your-angular-app.com"
];

app.use(cors(
    {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());



// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));

// Routes
app.use('/', require('./routes/auth'));
app.use('/articles', require('./routes/articleRoutes'));
app.use('/clients', require('./routes/clientRoutes'));
app.use('/managers', require('./routes/managerRoutes'));
app.use('/services', authenticateToken, require('./routes/serviceRoutes'));
app.use('/packPromoServices', authenticateToken, require('./routes/packPromoServiceRoutes'));
app.use('/mecanicien', require('./routes/mecanicienRoutes'));
app.use('/tacheMecanicien', require('./routes/tacheMecanicienRoutes'));
app.use('/depenseExceptionnelle', require('./routes/depenseExceptionnelle'));
app.use('/recetteExceptionnelle', require('./routes/recetteExceptionnelle'));
app.use('/notif', require('./routes/NotifRoutes'));
app.use('/depotEtRetrait', require('./routes/DepotEtRetrait'));
app.listen(PORT, () => console.log(`Serveur démarré sur le port${PORT}`));
