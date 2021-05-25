const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json()) 
app.use('/auth', authRouter)

// mongodb+srv://qaz753:<password>@cluster0.j9yna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const start = async () =>{
    try {
        await mongoose.connect(`mongodb+srv://qwerty:qwerty123@cluster0.jxc2e.mongodb.net/library?retryWrites=true&w=majority`)
        // await mongoose.connect(`mongodb+srv://qaz753:qaz753@cluster0.j9yna.mongodb.net/library?retryWrites=true&w=majority`)

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (error) {
        console.log(error)    

    }
}

start()









