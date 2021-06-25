var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1801918752:AAG365-3jzR-O7Gdq_PpZ7uDE6vrJlMZvkY'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click  /predict `
    );   
});



state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai x|y|z example 3|4|5`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = s[0]
        v = s[1]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
            ]
        ).then((jres)=>{
            x = parseFloat(jres[0])
            y = parseFloat(jres[1])
            z = parseFloat(jres[2])
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]), x, y, z]). =>{
                bot.sendMessage(
                    msg.chat.id,
                    `nilai x yang diprediksi adalah ${jres[0]} `
                );   
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y yang diprediksi adalah ${jres[1]} `
                );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai y yang diprediksi adalah ${jres[2]} `
                );   
            }) 
        })
    }else{
        state = 0
    }
})

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

// routers
r.get('/classify/:x/:y', function(req, res, next) {
      model.predict(
        [
                parseFloat(req.params.x), //string nofloat
                parseFloat(req.params.y),
        ]
       ).then((jres)=>{
           cls_model.classify(
               [
                parseFloat(req.params.x), //string nofloat
                parseFloat(req.params.y),
                parseFloat(jres[0]),
                parseFloat(jres[1])
               ]
               ).then((jres_)=>{
                res.json(jres_)
           })
      })
});
        
module.exports = r;
