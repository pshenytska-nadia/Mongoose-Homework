export const checkAuth = (req, res, next) => {
	try {
		const token = req.header('Authorization');

		if (!token) {
			return res
				.status(401)
				.json({ error: 'Unauthorized. Token not provided.' });
		}

		req.user = token;
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ error: 'Unauthorized. Invalid token.' });
	}
};
