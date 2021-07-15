const _ = require("lodash");
const Paginator = require("../models/paginator");

module.exports = class Provider {
	/**
	 * Constructor
	 * @param  {} bot
	 */
	constructor(bot) {
		this.bot = bot;
	}

	/**
	 * Search items
	 * @param  {} message
	 * @param  {} match
	 */
	search(message, match) {}

	/**
	 * List items
	 * @param  {} message
	 */
	list(message) {}

	/**
	 * Handle pagination
	 * @param  {} message
	 * @param  {} data
	 * @param  {} method
	 */
	async paginate(message, data, method = "list") {
		const chatId = message.chat.id;
		const results = await Paginator.find({
			user: chatId,
			type: this.type,
			createdAt: { $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
		});

		if (results.length > 0) {
			const IDs = [];
			_.map(results, result => {
				IDs.push(result._id);
				this.bot.deleteMessage(chatId, result._id);
			});
			await Paginator.deleteMany({ _id: { $in: IDs } });
		}

		await this[method](message, data);
	}
};
