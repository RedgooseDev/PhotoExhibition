var comps = {};

/**
 * Component - index
 */
comps.Index = React.createClass({

	/**
	 * goose api address
	 * @param string url
	 */
	url : null,

	/**
	 * 추가되는 방식
	 * @param string method (overwrite, add)
	 */
	method : 'overwrite',

	/**
	 * 목록이 로드되어있는지 확인값
	 * @param Boolean
	 */
	ready : false,

	/**
	 * init state
	 * @return object
	 */
	getInitialState : function()
	{
		return {
			items : [],
			page : 1,
			showMoreButton : true
		};
	},

	/**
	 * component did mount
	 * 컴포넌트가 준비가 완료되었을때 실행되는 메서드
	 *
	 * @return void
	 */
	componentDidMount : function()
	{
		this.url = this.props.json;
	},

	/**
	 * load data
	 * goose api에서 데이터를 로드하는 메서드
	 *
	 * @param n 페이지 번호값
	 */
	load : function(n)
	{
		var self = this;
		this.ready = true;
		n = parseInt(n);

		// update page
		this.setState({page : parseInt(n)});

		// load data
		$.get(this.url.replace('{page}', ((n) ? n : 1)), function(res){
			res = JSON.parse(res);
			var result = self.update(res.result);
			self.method = 'overwrite';

			// 다음 데이터가 없으면 더보기 버튼 숨기기
			if (!res.next)
			{
				self.setState({ showMoreButton : false })
			}
			// 돌아가는 more 버튼 멈추기
			self.refs.more.buttonControl(false);
		});
	},

	// update items
	update : function(newItems)
	{
		if (!newItems.length)
		{
			return false;
		}
		var allItems = (this.method == 'add') ? this.state.items.concat(newItems) : newItems;
		this.setState({items : allItems});
		return true;
	},

	// render
	render : function()
	{
		return (
			<div>
				<IndexItems items={this.state.items} />
				<IndexMore ref="more" show={this.state.showMoreButton} dir="next" />
			</div>
		);
	}
});

/**
 * Component - index items
 */
var IndexItems = React.createClass({
	render : function()
	{
		var items = function(item, k)
		{
			return (<IndexItem key={k}>{item}</IndexItem>);
		};
		return (
			<ul ref="list">{this.props.items.map(items)}</ul>
		);
	}
});

/**
 * Component - index item
 */
var IndexItem = React.createClass({
	onClick : function(e)
	{
		return (comp.view.opened) ? false : true;
	},
	render : function()
	{
		var item = this.props.children;
		return (
			<li key={'item-' + item.srl}>
				<a href={'#/view/' + item.srl} onClick={this.onClick}>
					<ImageLoader src={item.img} alt={item.title} />
				</a>
			</li>
		);
	}
});

/**
 * Component - index more data
 */
var IndexMore = React.createClass({
	getInitialState : function()
	{
		return {
			class_button : ''
		};
	},
	moreData : function(e)
	{
		this.buttonControl(true);
		comp.index.method = 'add';
		location.hash = '/page/' + ((this.props.dir == 'prev') ? comp.index.state.page - 1 : comp.index.state.page + 1);
	},
	buttonControl : function(sw)
	{
		if (sw)
		{
			this.setState({ class_button : 'rotate' });
		}
		else
		{
			this.setState({ class_button : '' });
		}
	},
	render : function()
	{
		var button = null;
		if (this.props.show)
		{
			button = (
				<button type="button" className={this.state.class_button} title="more load images" key="more" onClick={this.moreData}>
					<i></i>
				</button>
			);
		}
		return (
			<nav className="more-data">{button}</nav>
		);
	}
});

/**
 * Image loader
 */
var ImageLoader = React.createClass({

	figure : null,
	img : new Image(),

	getInitialState : function()
	{
		return {
			class_loading : 'loading',
			class_image : 'image',
			class_error : 'error'
		};
	},

	componentDidMount : function()
	{
		var self = this;
		var img = new Image();
		// set figure
		this.figure = ReactDOM.findDOMNode(this.refs.figure);

		// set image event
		img.onload = function()
		{
			img = null;
			setTimeout(function(){
				self.setState({
					class_loading : '',
					class_image : 'image show'
				});
			}, 50);

		};
		img.onerror = function()
		{
			img = null;
			self.setState({
				class_loading : '',
				class_error : 'error show'
			});
		};

		// set image source
		img.src = this.props.src;
	},

	render : function()
	{
		var dom = null;
		var styleImage = {
			backgroundImage : (this.props.src) ? 'url(' + this.props.src + ')' : ''
		};
		return (
			<figure ref="figure" title={this.props.title}>
				<span ref="image" className={this.state.class_image} style={styleImage} />
				<span ref="error" className={this.state.class_error} />
				<span ref="loading" className={this.state.class_loading} />
			</figure>
		);
	}

});


/**
 * Component - View
 */
comps.View = React.createClass({

	opened : false,
	scrollTop : 0,

	getInitialState : function()
	{
		return {
			parentClassName : '',
			srl : null,
			slideSwitch : false,
			navDirection : { prev : '', next : '' }
		};
	},

	// component did mount
	componentDidMount : function() {},

	// open view
	open : function(srl, isAnimation)
	{
		var self = this;
		this.opened = true;
		this.scrollTop = document.body.scrollTop;
		if (isAnimation)
		{
			this.setState({ parentClassName: 'show' }, function(){
				setTimeout(function(){
					self.setState({ parentClassName: 'show animate' });
				}, 30);
			});
			css3.transitionEnd(ReactDOM.findDOMNode(this.refs.wrap), function(e){
				self.action(e.target, srl);
			});
		}
		else
		{
			self.setState({ parentClassName: 'show animate' });
			self.action(ReactDOM.findDOMNode(this.refs.wrap), srl);
		}

		// add 'mode-popup' class name
		$('html').addClass('mode-popup');
	},

	action : function(o, srl)
	{
		this.setState({ srl : srl });
		this.refs.slider.open();
		this.keyboardEvent(true);
	},

	// close view
	close : function()
	{
		var self = this;

		this.opened = false;
		this.setState({ parentClassName: 'show' });

		this.keyboardEvent(false);

		// 닫기 애니메이션이 끝난 후
		css3.transitionEnd(ReactDOM.findDOMNode(this.refs.wrap), function(e){
			if (self.refs.slider.swipeEvent)
			{
				self.refs.slider.swipeEvent.kill();
				self.refs.slider.swipeEvent = null;
			}
			self.setState({ parentClassName: '' });
			var $items = $(ReactDOM.findDOMNode(self.refs.slider.refs.swipeWrap));
			$items.find('.show').removeClass('show');

			// close help
			if (self.refs.help.opened)
			{
				self.refs.help.close();
			}

			// restore scroll top
			document.body.scrollTop = self.scrollTop;
		});

		if (comp.index)
		{
			var page = comp.index.state.page;
			var cntItems = ReactDOM.findDOMNode(comp.index).getElementsByTagName('UL')[0].children.length;
			if (cntItems)
			{
				router.oneStop(); // 주소가 변할때 목록이 불러와버리는 현상이 생겨서 한번만 실행되게 실행
			}
			location.hash = (page > 1) ? '#/page/' + page : '#/';
		}

		// remove 'mode-popup' class name
		$('html').removeClass('mode-popup');
	},

	// move item
	move : function(e)
	{
		switch(e.currentTarget.getAttribute('data-dir'))
		{
			case 'prev':
				this.refs.slider.prev();
				break;
			case 'next':
				this.refs.slider.next();
				break;
		}
	},

	// 네비게이션 컨트롤 버튼 on/off 제어
	navigationControl : function(obj)
	{
		this.setState({
			navDirection : {
				prev : (obj.prev) ? 'show' : '',
				next : (obj.next) ? 'show' : ''
			}
		});
	},

	// 키보드 이벤트
	keyboardEvent : function(sw)
	{
		var self = this;
		if (sw)
		{
			$(window).on('keyup.view', function(e){
				if (e.keyCode == 37)
				{
					// left
					self.refs.slider.next();
				}
				else if (e.keyCode == 39)
				{
					// right
					self.refs.slider.prev();
				}
				else if (e.keyCode == 27)
				{
					// esc
					self.close();
				}
			});
		}
		else
		{
			$(window).off('keyup.view');
		}
	},

	// open help
	openHelp : function()
	{
		if (this.refs.help.opened)
		{
			this.refs.help.close();
		}
		else
		{
			this.refs.help.open();
		}
	},

	// render
	render : function()
	{
		var controller;
		if (!util.touch())
		{
			controller = (
				<nav className="control-direction">
					<button type="button" onClick={this.move} data-dir="next" title="next image" className={'prev' + ' ' + this.state.navDirection.next}>
						<i className="sp-ico ico-arrow-left"></i>
					</button>
					<button type="button" onClick={this.move} data-dir="prev" title="prev image" className={'next' + ' ' + this.state.navDirection.prev}>
						<i className="sp-ico ico-arrow-right"></i>
					</button>
				</nav>
			);
		}

		return (
			<article ref="wrap" className={'pop-view ' + this.state.parentClassName}>
				<Slider ref="slider" srl={this.state.srl} json={this.props.json} navControl={this.navigationControl} />
				<nav className="control-top">
					<button type="button" ref="help" title="help" onClick={this.openHelp}>
						<i className="sp-ico ico-help"></i>
					</button>
					<button type="button" onClick={this.close} ref="close" title="close">
						<i className="btn-close"></i>
					</button>
				</nav>
				{controller}
				<KeyboardHelp ref="help" />
			</article>
		);
	}
});

/**
 * Keyboard help
 */
var KeyboardHelp = React.createClass({

	opened : false,

	getInitialState : function()
	{
		return {
			classStr : ''
		};
	},

	open : function()
	{
		var self = this;
		this.opened = true;
		$(ReactDOM.findDOMNode(this)).show();
		setTimeout(function(){
			self.setState({ classStr : 'show' });
		}, 30);
	},

	close : function()
	{
		var self = this;
		this.opened = false;
		this.setState({ classStr : '' });
		setTimeout(function(){
			$(ReactDOM.findDOMNode(self)).hide();
		}, 280);
	},

	render : function()
	{
		return (
			<section className={'help ' + this.state.classStr}>
				<h1>Keyboard guide</h1>
				<div className="bd">
					<dl>
						<dt><span>ESC</span></dt>
						<dd>Close view</dd>
					</dl>
					<dl>
						<dt><span>LEFT</span></dt>
						<dd>Prev Slide</dd>
					</dl>
					<dl>
						<dt><span>RIGHT</span></dt>
						<dd>Next Slide</dd>
					</dl>
				</div>
				<button type="button" className="close" title="close" onClick={this.close}><i>close</i></button>
			</section>
		);
	}
});

/**
 * Slider
 */
var Slider = React.createClass({

	ready : false,
	swipeEvent : null,
	total : 0,

	getInitialState : function()
	{
		return { data: [] };
	},

	componentDidMount : function()
	{
		var self = this;
		$.get(this.props.json, function(res){
			var getData = JSON.parse(res).result;
			self.total = getData.length;
			self.setState({data : getData});
			self.ready = true;

			var item = self.refs['item-' + self.props.srl];
			var $item = $(ReactDOM.findDOMNode(item));

			// view가 열려져 있는 상태라면 swipe 초기화하기
			if (comp.view.opened)
			{
				self.initSwipe($item);
			}
		});
	},

	checkNavigation : function()
	{
		var pos = this.swipeEvent.getPos();
		var param = { prev : true, next : true };

		if (pos == 0)
		{
			param.prev = false;
		}
		else if ((this.total - 1) <= pos)
		{
			param.next = false;
		}

		this.props.navControl(param);
	},

	initSwipe : function($el)
	{
		var self = this;
		this.swipeEvent = Swipe(ReactDOM.findDOMNode(this), {
			startSlide : $el.index(),
			continuous : false,
			callback : function(index, elem)
			{
				var $item = $(elem).children('.img');
				if ($item.css('backgroundImage') == 'none')
				{
					self.imageLoad(elem.childNodes[0]);
				}
				else if (!$item.hasClass('show'))
				{
					$item.addClass('show');
				}
				self.changeUrl(parseInt(elem.getAttribute('data-srl')));

				self.checkNavigation();
			},
			transitionEnd : function(index, elem) {}
		});

		// load image
		var $child = $el.children('.img');
		if ($child.length)
		{
			this.imageLoad($child.get(0));
			self.checkNavigation();
		}
	},

	getItem : function(srl)
	{
		return this.refs['item-' + srl];
	},

	imageLoad : function(img)
	{
		var src = img.getAttribute('data-src');
		var tmp = new Image();

		tmp.onload = function()
		{
			tmp = null;
			var $img = $(img);
			var srl = parseInt($img.parent().attr('data-srl'));
			$img.parent().removeClass('loading');
			$img.css('background-image', 'url(\'' + src + '\')')
				.removeClass('not-animation')
				.addClass('show');
			$.get(phpScript + '?type=updateHit&srl=' + srl, function(res){ });
		};

		tmp.onerror = function()
		{
			tmp = null;
		};

		tmp.src = src;
	},

	open : function()
	{
		if (this.ready)
		{
			var item = this.getItem(this.props.srl);
			var $el = $(ReactDOM.findDOMNode(item));
			$el.children().removeClass('show').addClass('not-animation');
			this.initSwipe($el);
		}
	},

	prev : function()
	{
		this.swipeEvent.prev();
	},

	next : function()
	{
		this.swipeEvent.next();
	},

	changeUrl : function(srl)
	{
		router.oneStop();
		location.hash = '/view/' + srl;
	},

	render : function()
	{
		var items = this.state.data.map(function(o, k){
			return (
				<div ref={'item-' + o.srl} data-srl={o.srl} key={'srl-' + o.srl} className="loading">
					<div data-src={o.img} title={o.title} className="img" />
					<span className="log">{'index:' + k + ', srl:' + o.srl}</span>
				</div>
			);
		});
		return (
			<div ref="slider" className='swipe'>
				<div ref="swipeWrap" className='swipe-wrap'>
					{items}
				</div>
			</div>
		);
	}

});


module.exports = comps;