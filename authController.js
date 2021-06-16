const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (email) => {
    const payload = {
        email
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка регистрации", errors})
            }
            const {firstname, lastname, email, password} = req.body
            const candidate = await User.findOne({email})
            if(candidate){
                return status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const basket = []
            const user = new User({firstname,lastname, email, password: hashPassword, roles: [userRole.value]}, basket)
            await user.save()
            return res.json({message: "Регистрация прошла успешно!"})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Ошибка регистрации', error})
        }
    }

    async login (req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message: 'Введен неверный пароль'})
            }
            const token = generateAccessToken(user.email)
            return res.json({token})

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Ошибка входа'})
        }
    }

    async getUser (req, res) {
        try {
            const {token} = req.body
            if(!token){
                return res.status(403).json({message: "Пользователь не авторизован!"})
            }
            const decoderData = jwt.verify(token, secret)
            const user = await User.findOne({email: decoderData.email })
            return res.json({firstname: user.firstname, lastname: user.lastname, email: user.email, roles: user.roles, basket: user.basket})
        } catch (error) {
            return res.status(403).json({message: "Пользователь не авторизован!"})
        }
    }
}




module.exports = new authController()










