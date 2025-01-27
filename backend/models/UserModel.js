const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
require('dotenv').config({ path: './.env' });


// const db_link = "mongodb+srv://satyamstudentmin21:vxDYPEbYTuhOgHNK@cluster0.dvuek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db_link = process.env.DB_LINK;
console.log('DB Link:', db_link);


mongoose.connect(db_link)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error("Error connecting to database:");
    });


// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function (email) {
            return emailValidator.validate(email);
        },
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to hash the password before saving
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password') || this.isNew) {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//     }
//     next();
// });

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;