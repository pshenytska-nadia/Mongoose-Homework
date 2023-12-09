import Article from '../models/article.model.js';
import User from '../models/user.model.js';

export const getArticles = async (req, res, next) => {
	try {
		const { title, page = 1, limit = 10 } = req.query;
		const articles = await Article.find({
			title: {
				$regex: title || '',
				$options: 'i',
			},
		})
			.skip((page - 1) * limit)
			.limit(parseInt(limit))
			.populate({
				path: 'owner',
				select: 'fullName email age',
			});

		res.status(200).json(articles);
	} catch (err) {
		next(err);
	}
};

export const getArticleById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const article = await Article.findById(id).lean();
		if (!article) return res.status(404).json({ error: 'Article not found' });

		res.status(200).json(article);
	} catch (err) {
		next(err);
	}
};

export const createArticle = async (req, res, next) => {
	try {
		const { owner } = req.body;
		if (!owner) return res.status(400).json({ error: 'Owner is required' });

		const user = await User.findById(owner);
		if (!user) return res.status(400).json({ error: 'Invalid owner id' });

		const article = new Article({
			title: req.body.title,
			subtitle: req.body.subtitle,
			description: req.body.description,
			owner: user._id,
			category: req.body.category,
		});
		await article.save();

		res.status(201).json(article);
	} catch (err) {
		next(err);
	}
};

export const updateArticleById = async (req, res, next) => {
	try {
		const { title, subtitle, description, category } = req.body;
		const articleId = req.params.id;
		const userId = req.user;
		const article = await Article.findById(articleId);

		if (!article)
			return res.status(404).json({ error: 'Article does not exist' });

		if (!article.owner.equals(userId))
			return res.status(403).json({ error: 'Permission denied' });

		article.title = title || article.title;
		article.subtitle = subtitle || article.subtitle;
		article.description = description || article.description;
		article.category = category || article.category;

		const updatedArticle = await article.save();
		res.status(200).json(updatedArticle);
	} catch (err) {
		next(err);
	}
};

export const deleteArticleById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const article = await Article.findById(id).lean();
		if (!article) return res.status(404).json({ error: 'Article not found' });

		await Article.deleteOne({ _id: id });
		res.status(200).json(article);
	} catch (err) {
		next(err);
	}
};
