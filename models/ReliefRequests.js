const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReliefRequest = new Schema({

    orgId: {
        type: Schema.Types.ObjectId,
        refer: 'orgs',
        required: true
    },

    teamId: {
        type: Number,
        // required: true
    },

    name: {
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

    division: {
        type: String,
        required: true
    },

    mobileNumber: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('relief-requests', ReliefRequest);