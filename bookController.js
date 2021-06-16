
const Book = require('./models/Book')
const User = require('./models/User')

class bookController {
    async search (req, res) {
        try {
            const {name} = req.query
            const books = await Book.find({name: {$regex: name}}).limit(5)
            const items = books.map(item => {return {name: item.name}})
            return res.json({items})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Ошибка', error})
        }
    }
    async add (req, res) {
        try {
            const {name, author, picture, city, genre, country, description, reservation } = req.body
            const book = await Book.findOne({name})
            if(book){
                return status(400).json({message: 'Книга с таким именем уже существует'})
            }
            const newBook = new Book({name, author, picture, city, genre, country, description, reservation})
            await newBook.save()
            return res.json({message: "Регистрация прошла успешно!"})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Ошибка регистрации', error})
        }
    }

    async remove (req, res) {
        try {
            const {name} = req.body
            await Book.findOneAndDelete({name})
            return res.json({message: "Удаление прошло успешно!"})

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Ошибка входа'})
        }
    }

    async info (req, res) {
        try {
            const {name} = req.query;
            if(!name){
                return res.status(403).json({message: "Книга не найдена"})
            }
            const book = await Book.findOne({name})
            return res.json({book})
        } catch (error) {
            return res.status(403).json({message: "Книга не найдена"})
        }
    }
    async all (req, res) {
        try {
            let {page, part, genre, author, city} = req.query;
            if(!page) page = 1;
            if(!part) part = 12;
            if(genre && author && city) {
                const books = await Book.find({genre, author, city})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(genre && author && !city) {
                const books = await Book.find({genre, author})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(genre && !author && !city) {
                const books = await Book.find({genre})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(genre && !author && city) {
                const books = await Book.find({genre, city})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(!genre && author && city) {
                const books = await Book.find({city, author})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(!genre && author && !city) {
                const books = await Book.find({author})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            if(!genre && !author && city) {
                const books = await Book.find({city})
                return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
            }
            const books = await Book.find()
            return res.json({total: books.length, books: books.slice((part*page - part), (part*page))})
        } catch (error) {
            return res.status(403).json({message: "Ошибка запроса"})
        }
    }

    async reservation (req, res) {
        try { 
            let {name, email, reserv} = req.query;
            const newUser = await User.findOne({email})
            const newBook = await Book.findOne({name})
            const newBasket = [...newUser.basket]
            let reservation
            if(newUser && newBook){
                if(reserv === "1"){
                    reservation = true
                    if(!newBasket.includes(name) && !newBook.reservation){
                        newBasket.push(name)
                    }
                    else{
                        return res.status(400).json({message: 'Операция невозможна!'})
                    }
                }
                else if (reserv === "0") {
                    reservation = false
                    if(newBasket.includes(name) && newBook.reservation){
                        
                        newBasket.splice(newBasket.indexOf(name), 1)
                    }
                    else{
                        return res.status(400).json({message: 'Операция невозможна!'})
                    }

                }

                else {
                    return res.status(400).json({message: 'Операция невозможна!'})
                }
            }
            await Book.findOneAndUpdate({name}, 
                {
                    _id: newBook._id,
                    name: newBook.name,
                    author: newBook.author,
                    picture: newBook.picture,
                    city: newBook.city,
                    genre: newBook.genre,
                    country: newBook.country,
                    description: newBook.description,
                    reservation: reservation
                },
            (error, book) => {
                if(error){
                    return res.status(400).json({error})
                }
            })
            await User.findOneAndUpdate({email}, 
                {
                    _id: newUser._id,
                    email: newUser.email,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    password: newUser.password,
                    roles: newUser.roles,
                    basket: newBasket
                },
            (error, user) => {
                if(error){
                    return res.status(400).json({error})
                }
            })
            return res.json({message: 'success', name})
        } catch (error) {
            return res.status(403).json({message: "Ошибка запроса", error})
        }
    }
}




module.exports = new bookController()