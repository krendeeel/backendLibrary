const {Schema, model} = require("mongoose")

const Book = new Schema({
    name: {type: String, unique: true, required: true},
    author: {type: String, required: true},
    picture: {type: String, required: true},
    city: {type: String, required: true},
    genre: {type: String, required: true},
    country: {type: String, required: true},
    description: {type: String, required: true},
    reservation: {type: Boolean, required: true}
})

module.exports = model("Book", Book)