const User = require("../models/user");

/**
 * Create a new user if not exists
 * @param  {} from
 */
exports.firstOrCreate = async from => {
	const user = await User.findById(from.id);
	if (!user && !from.is_bot) {
		return await new User({
			_id: from.id,
			first_name: from.first_name,
			username: from.username,
			language_code: from.language_code,
		}).save();
	}

	return user;
};
