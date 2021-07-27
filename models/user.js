const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		_id: {
			type: Number,
			required: true,
		},
		first_name: {
			type: String,
			required: true,
		},
		username: String,
		language_code: String,
		status: {
			type: String,
			enum: ["active", "blocked", "deactivated"],
			default: "active",
		},
	},
	{ timestamps: true, _id: false }
);

// First check if the user exists else create a new user
UserSchema.statics.firstOrCreate = async function(from) {
	const user = await this.findById(from.id);
	if (!user && !from.is_bot) {
		return await new this({
			_id: from.id,
			first_name: from.first_name,
			username: from.username,
			language_code: from.language_code,
		}).save();
	}

	return user;
};

module.exports = mongoose.model("User", UserSchema);
