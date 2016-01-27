function About()
{
	var self = this;
	var $this = $('#about');
	var url_page = './pages/about.html';

	this.opened = false;

	// open window
	this.open = function(isAnimate)
	{
		function setEvent()
		{
			$this.find('[data-act=close]').on('click', function(){
				self.close();
			});
		}

		this.opened = true;

		// act
		if (isAnimate)
		{
			$this.load(url_page, function(){
				$this.show();
				setTimeout(function(){
					$this.addClass('show');
					css3.transitionEnd($this, function(){
						$('html').addClass('mode-popup');
						setEvent();
					});
				}, 50);
			});
		}
		else
		{
			$('html').addClass('mode-popup');
			$this.show().addClass('show');
			$this.load(url_page, function(){
				setEvent();
			});
		}
	};

	// close window
	this.close = function()
	{
		this.opened = false;

		$('html').removeClass('mode-popup');
		$this.removeClass('show');
		$this.find('[data-act=close]').off('click');

		css3.transitionEnd($this, function(){
			$this.empty().hide();
		});

		if (comp.index)
		{
			var page = comp.index.state.page;
			var $indexItems = $('#itemIndex ul li');
			if ($indexItems.length)
			{
				router.oneStop();
			}
			location.hash = (page > 1) ? '#/page/' + page : '#/';
		}
	}
}

module.exports = About;