import mongoose from 'mongoose';
import User from './user.model.js';
import createHttpError from 'http-errors';

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		minLength: 5,
		maxLength: 400,
		required: true,
		trim: true,
	},
	subtitle: {
		type: String,
		minLength: 5,
	},
	description: {
		type: String,
		minLength: 5,
		maxLength: 5000,
		requires: true,
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	category: {
		type: String,
		enum: ['sport', 'games', 'history'],
		required: true,
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

articleSchema.pre('save', async function (next) {
	this.set({ updatedAt: new Date() });

	const ownerId = this.owner;
	const owner = await User.findById(ownerId);

	if (!owner) {
		next(
			createHttpError(404, {
				message: `Conflict: User with id - ${ownerId} NOT FOUND`,
			}),
		);
	}

	owner.articles.push(this._id);
	await owner.save();

	next();
});

articleSchema.pre('deleteOne', async function (next) {
	const id = this.getQuery()['_id'];
	const owner = await User.findOne({ articles: id });

	const index = owner.articles.indexOf(id);
	owner.articles.splice(index, 1);

	await owner.save();

	next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
