const mongoose = require('mongoose');
const { request } = require('express');
const Schema = mongoose.Schema;

const Team = new Schema({

    orgId: {
        type: Schema.Types.ObjectId,
        refer: 'orgs',
        required: true
    },

    teamName: {
        type: String,
        required: true
    },

    leaderName: {
        type: String,
        required: true
    },

    logoUrl: {
        type: String,
    },

    division: {
        type: String,
        required: true
    },

    zilla: {
        type: String,
        required: true
    },

    upazilla: {
        type: String,
        required: true
    },

    completed: {
        type: Number,
        required: true
    },

    processing: {
        type: Number,
        required: true
    },

    totalServed: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('teams', Team);