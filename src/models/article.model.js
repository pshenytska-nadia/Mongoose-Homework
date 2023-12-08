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
	const ownerId = this.owner;
	const owner = await User.findById({ _id: ownerId });

	if (!owner) {
		next(
			createHttpError(404, {
				message: `Conflict: User with id - ${ownerId} NOT FOUND`,
			}),
		);
	}

	owner.numberOfArticles += 1;
	await owner.save();

	next();
});

articleSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function (next) {
		const ownerId = this.owner;
		const owner = await User.findById({ _id: ownerId });

		owner.numberOfArticles -= 1;
		await owner.save();

		next();
	},
);

articleSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
