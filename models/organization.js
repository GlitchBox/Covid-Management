const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const Orgs = Schema({

    name : {
        type: String,
        required: true
    },

    teams: [
        {
            type: Schema.Types.ObjectId,
            refer: 'teams',
            required: true
        }
    ],

    division: [{
        type: String,
        required: true
    }],

    zilla: [{
        type: String, 
        required: true
    }],

    upazilla: [{
        type: String,
        required: true
    }],

    capacity: {
        type: Number,
        required: true
    },

    completed: {
        type: Number,
        required: true
    },

    processing: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('orgs', Orgs);