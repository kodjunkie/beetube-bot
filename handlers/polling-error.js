/*
 * Handle polling errors
 */
module.exports = error => {
	if (error.code !== "EFATAL") console.error(error.response.body);
	else console.error(error);
};
