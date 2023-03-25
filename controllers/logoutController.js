const pool = require('../config/dbConn');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    pool.query(`
        UPDATE sql_sdi.users
        SET
            refresh_token = NULL
        WHERE refresh_token = '${refreshToken}'
    `, (err, queryres) => {
        if ( err ) console.log(err);
    })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure: true - only on https
    res.sendStatus(204);
}

module.exports = { handleLogout }