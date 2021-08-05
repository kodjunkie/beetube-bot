const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingSchema = new Schema(
	{
		purge_old_pages: {
			type: Boolean,
			default: true,
		},
		chat_music_download: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Number,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: { createdAt: false }, _id: false }
);

module.exports = mongoose.model("Setting", SettingSchema);
