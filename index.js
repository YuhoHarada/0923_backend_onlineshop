require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const formidable = require("formidable")
const path = require('path')
const ShopItem = require('./models/shopItem')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(result => {
        console.log('conected to db')
        app.listen(process.env.PORT, () => {
            console.log('server')
        })
    })
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    ShopItem.find()
        .then(result => {
            res.status(200).render('home', { dataList: result })
        })
        .catch(err => console.log(err))
})

app.get('/lte30', (req, res) => {
    ShopItem.find({ Price: { $lte: 30 } })
        .then(result => {
            res.status(200).render('home', { dataList: result })
        })
        .catch(err => console.log(err))
})

app.get('/recomend', (req, res) => {
    ShopItem.find({ $and: [{ Price: { $gte: 130 } },{ Price: { $lte: 200 } }] })
        .then(result => {
            res.status(200).render('home', { dataList: result })
        })
        .catch(err => console.log(err))
})

app.get('/new', (req, res) => {
    ShopItem.find()
        .then(result => {
            let randomList = [], randomnum = []
            for (let i = 0; i < 6; i++) {
                let randomOne
                do {
                    randomOne = Math.floor(Math.random() * result.length)
                } while (randomnum.includes(randomOne))
                randomnum.push(randomOne)
            }
            randomnum.forEach(elt => {
                randomList.push(result[elt])
            })
            res.status(200).render('new', { randomList })
        })
        .catch(err => console.log(err))
})

app.post('/newPost', (req, res) => {
    const form = formidable({
        uploadDir: "./uploads",
        keepExtensions: true
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const newShopItem = new ShopItem({
            "Product-name": fields.name,
            "Product-picture-Link": '/' + path.basename(files.image.path),
            "Company": fields.company,
            "Price": fields.price,
            "Description": fields.description
        })
        newShopItem.save()
            .then(result => {
                res.redirect('/')
            })
            .catch(err => console.log(err))
    })
})

app.get('/detail/:id', (req, res) => {
    ShopItem.findById(req.params.id)
        .then(result => {
            res.status(200).render('detail', { detailData: result })
        })
        .catch(err => console.log(err))
})

app.post('/detail/:id/edit', (req, res) => {
    const form = formidable({
        uploadDir: "./uploads",
        keepExtensions: true
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const editShopItem = {}
        if (fields.name != "") editShopItem["Product-name"] = fields.name
        if (files.image.size != "") editShopItem["Product-picture-Link"] = '/' + path.basename(files.image.path)
        if (fields.company != "") editShopItem["Company"] = fields.company
        if (fields.price != "") editShopItem["Price"] = fields.price
        if (fields.description != "") editShopItem["Description"] = fields.description

        ShopItem.findByIdAndUpdate(req.params.id, editShopItem)
            .then(result => {
                res.redirect(`/detail/${req.params.id}`)
            })
            .catch(err => console.log(err))
    })
})

app.get('/detail/:id/delete', (req, res) => {
    ShopItem.findByIdAndDelete(req.params.id)
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})
