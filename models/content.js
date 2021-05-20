const mongoose = require('mongoose');


const contentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

contentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

contentSchema.set('toJSON', {
    virtuals: true,
});


exports.Content = mongoose.model('Content', contentSchema);

