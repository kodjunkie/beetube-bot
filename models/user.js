const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		_id: Number,
		first_name: {
			type: String,
			required: true,
		},
		username: String,
		language_code: String,
	},
	{ timestamps: true, _id: false }
);

module.exports = mongoose.model("User", userSchema);
