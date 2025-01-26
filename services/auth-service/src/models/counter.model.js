const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    identifier: {
        type:String
    },
    user_counter: {
        type: Number,
        default: 0
    },
});

const Counter = mongoose.model('counter',counterSchema);
module.exports = Counter;