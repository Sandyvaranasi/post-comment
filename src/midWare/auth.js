const jwt = require('jsonwebtoken');

const authentication = async (req,res,next)=>{
    try{
        let token = req.headers['x-api-key'];
        if(!token) return res.status(401).send({message:"give token please"})

        await jwt.verify(token,'very secret string',(error,decodedToken)=>{
            if(decodedToken){
                req.userId = decodedToken.userId
                next()
            }else return res.status(401).send(error.message)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

module.exports = {authentication}