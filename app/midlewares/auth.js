const jwt = require("jsonwebtoken");
const jsonConfig = require("../../config/auth.json");

module.exports = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({
            error: `No token provided`,
        });
    }
    const parts = authHeader.split(" ");
    if(parts.length!==2){
        return res.status(401).send({
            error: `Token ERROR`,
        });
    }
    const [scheme, token] = parts;
        
    if(!(/^Bearer$/i.test(scheme))){
        return res.status(401).send({error: 'Token malformatted'});
    }

    jwt.verify(token, jsonConfig.secret, (error, decoded)=> {
        if(error){
            return res.status(401).send({
                error: `Pessoa não autorizada`,
            })
        }
        req.id = decoded.id;
        return next();
    });

}