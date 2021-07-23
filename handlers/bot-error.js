/*
 * Handle bot errors
 */
module.exports = error => {
	if (error.code && error.code !== "EFATAL") console.error(error.response.body);
	else console.error(error);
};
