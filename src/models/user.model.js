import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		minLength: 4,
		maxLength: 50,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		minLength: 3,
		maxLength: 60,
		required: true,
		trim: true,
	},
	fullName: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
	},
	role: {
		type: String,
		enum: ['admin', 'writer', 'guest'],
	},
	age: {
		type: Number,
		min: 1,
		max: 99,
	},
	numberOfArticles: {
		type: Number,
		default: 0,
		min: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre('save', function (next) {
	this.set({
		updatedAt: new Date(),
	});

	this.fullName = `${this.firstName} ${this.lastName}`;
	next();
});

userSchema.pre('validate', function (next) {
	if (this.age < 0) {
		this.age = 1;
	}
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
