const jwt = require("jsonwebtoken");

function setToken(detailslog) {
    const accessToken = generateToken(detailslog, process.env.ACCESS_TOKEN_SECRET, process.env.JWT_ACCESS_EXPIRES);
    const refreshToken = generateToken(detailslog, process.env.REFRESH_TOKEN_SECRET, process.env.JWT_REFRESH_EXPIRES);
    return { accessToken, refreshToken }
}

function regenererTokenAccess(refreshToken) {
    return new Promise((resolve, reject) => {
        try {
            if (!refreshToken) throw new Error("Veuillez vous reconnecter");
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) throw new Error("Veuillez vous reconnecter");

                const newaccesstoken = generateToken({
                    "id": decoded.id,
                    "prenom": decoded.prenom,
                    "role": decoded.role
                }, process.env.ACCESS_TOKEN_SECRET, process.env.JWT_ACCESS_EXPIRES);
                resolve({
                    "accesstoken": newaccesstoken,
                    "settoken": true
                });
            });
        } catch (error) {
            reject({
                "settoken": false,
                "error": error.message
            });
        }
    });
}


function generateToken(details, token, expires) {
    return jwt.sign(details, token, { expiresIn: expires })
}

module.exports = { generateToken,regenererTokenAccess,setToken };