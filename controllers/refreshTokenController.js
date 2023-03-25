const pool = require('../config/dbConn');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    pool.query(`
        SELECT * FROM sql_sdi.users
        WHERE refresh_token = '${refreshToken}'
    `,(err, queryRes) => {
        if ( err ) console.log();
        const foundUser = queryRes[0];
        if (!foundUser) return res.sendStatus(403); //Forbidden
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if ( err || foundUser.username.toLowerCase() !== decoded.username.toLowerCase() ) {
                    return res.sendStatus(403);
                }
                const role = foundUser.role
                const accessToken = jwt.sign(
                    { 
                        "UserInfo": {
                            "username": decoded.username,
                            role 
                        } 
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '300s' }
                );
                res.json({ accessToken });
            }
        )
    })   
}

module.exports = { handleRefreshToken }