const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReliefRequest = new Schema({

    orgId: {
        type: Schema.Types.ObjectId,
        //required: true
    },

    teamId: {
        type: Schema.Types.ObjectId,
        // required: true
    },

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    mobileNumber: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('relief-requests', ReliefRequest);