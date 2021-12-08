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
			enum: ["active", "blocked"],
			default: "active",
		},
	},
	{ timestamps: true, _id: false }
);

// Return the user if exists else create a new user
UserSchema.statics.firstOrCreate = async function(tgUser) {
	let user = await this.findById(tgUser.id);
	if (!user && !tgUser.is_bot) {
		user = await new this({
			_id: tgUser.id,
			first_name: tgUser.first_name,
			username: tgUser.username,
			language_code: tgUser.language_code,
		}).save();
	}

	return user;
};

module.exports = mongoose.model("User", UserSchema);
