var About = require('./modules/about.js');
var Components = require('../jsx/Components.jsx');

window.log = function(o) { console.log(o); };
window.router = require('./modules/router.js');
window.util = require('./modules/util.js');
window.css3 = require('./modules/css3.js');
window.phpScript = './libs/item.php';


// set components
window.comp = {
	index : ReactDOM.render(
		React.createElement(Components.Index, {
			json: './libs/item.php?page={page}'
		}),
		document.getElementById('itemIndex')
	),
	view : ReactDOM.render(
		React.createElement(Components.View, {
			json: './libs/item.php?type=viewIndex'
		}),
		document.getElementById('popup')
	),
	about : new About()
};


/**
 * Go to page
 */
window.goto = {
	index : function(page)
	{
		page = (page) ? parseInt(page) : 1;

		comp.index.load(page);

		if (comp.view.opened)
		{
			comp.view.close();
		}
	},

	view : function(srl)
	{
		comp.view.open(srl, ((comp.index.ready) ? true : false));
	},

	about : function()
	{
		comp.about.open(((comp.index.ready) ? true : false));

	}
};


/**
 * Route map
 */
router.addRoute('', goto.index);
router.addRoute('/', goto.index);
router.addRoute('/page/:page', goto.index);
router.addRoute('/view/:srl', goto.view);
router.addRoute('/About', goto.about);


/**
 * A C T I O N
 */

// set touch mode
if (util.touch())
{
	jQuery('html').addClass('mode-touch');
}

// start
router.start();
