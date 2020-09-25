const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shopItemSchema = new Schema({
    "Product-name": {
        type: String,
        required: true
    },
    "Company": {
        type: String,
        required: true
    },
    "Price": {
        type: Number,
        required: true
    },
    "Product-picture-Link": {
        type: String,
        required: true
    },
    "Description": {
        type: String,
        required: true
    }
})

const ShopItem = mongoose.model('onlineshopDB', shopItemSchema)

module.exports = ShopItem
