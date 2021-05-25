const jwt = require('jsonwebtoken')
const {secret} = require('../config')


module.exports = function (req, res, next) {
    if(req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.Authorization.split(' ')[1]
        if(!token){
            return res.status(403).json({message: "Пользователkjhkjhkjь не авторизован!"})
        }
        const decoderData = jwt.verify(token, secret)
        req.user = decoderData
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({message: "Пользователljlijь не авторизован!"})
    }
}