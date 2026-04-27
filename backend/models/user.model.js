import mongoose from 'mongoose';
import validator from 'validator'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxLength: [30, 'Username cannot exceed 30 characters'],
        minLength: [3, 'Username must be at least 3 characters'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minLength: [8, 'Password must be at least 8 characters '],
    },
    avatar: {
        url: { type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
       }
       
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }


}, {timestamps: true})

export default mongoose.model('User', userSchema);