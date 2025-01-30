const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/astrology_app');
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    timeOfBirth: { type: String, required: true },
    country: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    preferredDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    additionalNotes: { type: String }
});

module.exports  = mongoose.model('user', userSchema);


