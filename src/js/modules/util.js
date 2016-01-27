/**
 * Util class
 */
function Util() {
	this.touch = function()
	{
		return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	};
}

module.exports = new Util();