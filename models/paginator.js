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
			enum: ["movie", "music", "torrent", "anime"],
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

// Remove messages sent past the last 48hours
PaginatorSchema.statics.removeObsoleteRecords = async function() {
	await this.deleteMany({
		createdAt: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
	});
};

module.exports = mongoose.model("Paginator", PaginatorSchema);
