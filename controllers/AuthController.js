const pool = require('../config/dbConn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required!'})
    pool.query(`
        SELECT * FROM sql_sdi.users
        WHERE username = '${user}'
    `, async (err, queryRes) => {
        if (err) return console.log(err);
        const foundUser = queryRes[0]
        // if there was no such username in db
        if (!foundUser) return res.sendStatus(401);
        // evaluate password
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            console.log('match!!');
            // set the role
            const role = foundUser.role;
            const accessToken = jwt.sign (
                {
                    'UserInfo': {
                        'username': user,
                        'roles': role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }
            );
            const refreshToken =jwt.sign(
                {"username": user},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );
            pool.query(`
                UPDATE sql_sdi.users
                SET
                    refresh_token = '${refreshToken}'
                WHERE username = '${user}'
            `, (err, queryRes) =>{
                if (err) return console.log(err);
            })
            // prod
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: 'true', maxAge: 24 * 60 * 60 * 1000 });
            // dev
            // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({ role, accessToken });
        } else {
            res.sendStatus(401)
        }
    })
}

module.exports = { handleLogin }