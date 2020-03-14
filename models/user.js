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
	},
	{ timestamps: { updatedAt: false }, _id: false }
);

module.exports = mongoose.model("User", UserSchema);
