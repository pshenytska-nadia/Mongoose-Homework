import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
	try {
		const { sort } = req.query;

		const query = User.find();
		if (sort == -1 || sort == 1) {
			query.sort({ age: sort });
		}

		query.projection({ fullName: 1, age: 1, _id: 1 });

		const users = await query.exec();

		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};

export const getUserByIdWithArticles = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).populate({
			path: 'articles',
			select: 'title subtitle createdAt',
		});

		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const createUser = async (req, res, next) => {
	try {
		const user = req.body;
		const addedUser = new User(user);

		await addedUser.save();
		res.status(201).json(addedUser);
	} catch (err) {
		next(err);
	}
};

export const updateUserById = async (req, res, next) => {
	try {
		const { firstName, lastName, age } = req.body;
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json({ error: 'User not found' });

		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.age = age || user.age;

		const updatedUser = await user.save();
		res.status(200).json(updatedUser);
	} catch (err) {
		next(err);
	}
};

export const deleteUserById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).lean();
		if (!user) return res.status(404).json({ error: 'User not found' });

		await User.deleteOne({ _id: id });
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};
