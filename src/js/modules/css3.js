/**
 * CSS3 class
 */
function CSS3() {

	this.eventNames = {
		WebkitTransition : 'webkitTransitionEnd',
		MozTransition    : 'transitionend',
		OTransition      : 'oTransitionEnd otransitionend',
		transition       : 'transitionend'
	};

	this.isSupport = function()
	{
		var el = document.createElement('div');
		for (var name in this.eventNames) {
			if (el.style[name] !== undefined) {
				return this.eventNames[name];
			}
		}
		el = null;
		return false;
	};

	this.transitionEnd = function(el, callback)
	{
		if (this.isSupport())
		{
			if (callback)
			{
				$(el).one(this.isSupport(), callback);
			}
		}
	}
}

module.exports = new CSS3();