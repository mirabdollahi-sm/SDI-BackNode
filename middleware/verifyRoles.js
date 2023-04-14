const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        result = ( rolesArray.includes(5150) && req.roles === 'admin' ) ||
            ( rolesArray.includes(1984) && (req.roles === 'admin' || req.roles === 'editor') )
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;