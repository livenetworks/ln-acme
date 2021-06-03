// Usage:
(function () {
	const DOM_SELECTOR = '[ln-resizer]';
	const DOM_ATTRIBUTE = 'lnResizer';
	const ALLOWED_NOTE_TYPES = new Set([1, 2, 9, 10, 11]);

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
		return;
	}

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(domRoot) {
		let items = domRoot.querySelectorAll(DOM_SELECTOR) || [];


		if (domRoot.hasAttribute(DOM_SELECTOR)) {
			items.push(domRoot);
		}

		items.forEach(function (item) {
			if (!item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			}
		})
	}

	function _constructor(dom) {
		this.dom = dom;
		_init.call(this);
		_setEventListeners.call(this);
		return this;
	}

	function _domObserver() {
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type == "childList") {
					mutation.addedNodes.forEach(function (item) {
						if (ALLOWED_NOTE_TYPES.has(item.nodeType)) {
							_findElements(item);
						}
					});
				}
			});
		});


		observer.observe(document.body, {
			childList: true
		});
	}

	_domObserver();


	// Edit Below

	function _init() {
		this.parentElement = this.dom.parentElement;
		console.log(this.parentElement);
		return this;
	}

	function _setEventListeners() {
		this.dom.addEventListener('mousedown', (e) => {
			_initDrag.call(this, e);
		}, false)
	}

	function _initDrag(e) {
		this.startX = e.clientX;
		this.startY = e.clientY;
		console.log(this);
		this.startWidth = parseInt(document.defaultView.getComputedStyle(this.parentElement).width, 10);
		this.startHeight = parseInt(document.defaultView.getComputedStyle(this.parentElement).height, 10);

		document.documentElement.addEventListener('mousemove', (e) => {
			_doDrag.call(this, e);
		}, false);
		document.documentElement.addEventListener('mouseup', (e) => {
			_stopDrag.call(this);
		}, false);
	}

	function _doDrag(e) {
		this.parentElement.style.width = (this.startWidth + e.clientX - this.startX) + 'px';
		this.parentElement.style.height = (this.startHeight + e.clientY - this.startY) + 'px';
	}

	function _stopDrag(e) {
		console.log('Stop');
		document.documentElement.removeEventListener('mousemove', this._doDrag, false);
		document.documentElement.removeEventListener('mouseup', this._stopDrag, false);
	}

	// make lnResizer globaly avaliable
	window[DOM_ATTRIBUTE] = constructor;
})();

window.lnResizer(document.body);