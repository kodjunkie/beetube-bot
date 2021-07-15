const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaginatorSchema = new Schema(
	{
		_id: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ["movie", "music", "torrent"],
			default: "movie",
		},
		user: {
			type: Number,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: { updatedAt: false }, _id: false }
);

module.exports = mongoose.model("Paginator", PaginatorSchema);
