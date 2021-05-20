const mongoose = require('mongoose');

const userGroupSchema = mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    }],
    name: {
        type: String,
        required: true,
        default: '',
    },
})


userGroupSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userGroupSchema.set('toJSON', {
    virtuals: true,
});

exports.UserGroup = mongoose.model('UserGroup', userGroupSchema);
