/**
 * Remove obsolete database records
 */

const Paginator = require("../models/paginator");

exports.removeObsoleteRecords = async () => {
	// Remove obsolete pagination records
	await Paginator.deleteMany({
		createdAt: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
	});
};
