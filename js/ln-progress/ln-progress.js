(function () {
	const DOM_SELECTOR = '[data-ln-progress]';
	const DOM_ATTRIBUTE = 'lnProgress';

	// if the component is already defined, return
	if (window[DOM_ATTRIBUTE] !== undefined) {
		return;
	}

	// Shadow DOM styles — CSS tokens pierce shadow boundary
	var SHADOW_CSS = [
		':host {',
		'    display: flex;',
		'    height: var(--spacing-xs);',
		'    width: 100%;',
		'    border-radius: var(--radius-full);',
		'    background-color: var(--color-bg-body);',
		'    overflow: hidden;',
		'}',
		'::slotted([data-ln-progress]) {',
		'    width: 0;',
		'    transition: width 0.2s ease;',
		'    border-radius: 0;',
		'}',
		'::slotted([data-ln-progress]:last-child) {',
		'    border-top-right-radius: var(--radius-full);',
		'    border-bottom-right-radius: var(--radius-full);',
		'}',
		'::slotted(.green)  { background-color: var(--color-success); }',
		'::slotted(.red)    { background-color: var(--color-error); }',
		'::slotted(.yellow) { background-color: var(--color-warning); }',
	].join('\n');

	// Shared CSSStyleSheet — one instance for all progress tracks
	var _sharedSheet = null;
	function _getStyleSheet() {
		if (_sharedSheet) return _sharedSheet;
		try {
			_sharedSheet = new CSSStyleSheet();
			_sharedSheet.replaceSync(SHADOW_CSS);
		} catch (e) {
			_sharedSheet = null;
		}
		return _sharedSheet;
	}

	function _isBar(el) {
		var val = el.getAttribute('data-ln-progress');
		return val !== null && val !== '';
	}

	function _initTrack(el) {
		if (el.shadowRoot) return;

		var shadow = el.attachShadow({ mode: 'open' });
		var sheet = _getStyleSheet();
		if (sheet) {
			shadow.adoptedStyleSheets = [sheet];
		} else {
			var style = document.createElement('style');
			style.textContent = SHADOW_CSS;
			shadow.appendChild(style);
		}

		shadow.appendChild(document.createElement('slot'));
	}

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			composed: true,
			detail: detail || {}
		}));
	}

	function _findElements(domRoot) {
		var items = Array.from(domRoot.querySelectorAll(DOM_SELECTOR));

		items.forEach(function (item) {
			if (_isBar(item) && !item[DOM_ATTRIBUTE]) {
				item[DOM_ATTRIBUTE] = new _constructor(item);
			} else if (!_isBar(item)) {
				_initTrack(item);
			}
		});

		if (domRoot.hasAttribute && domRoot.hasAttribute('data-ln-progress')) {
			if (_isBar(domRoot) && !domRoot[DOM_ATTRIBUTE]) {
				domRoot[DOM_ATTRIBUTE] = new _constructor(domRoot);
			} else if (!_isBar(domRoot)) {
				_initTrack(domRoot);
			}
		}
	}

	function _constructor(dom) {
		this.dom = dom;
		_render.call(this);
		_listenValues.call(this);
		return this;
	}

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach(function (item) {
						if (item.nodeType === 1) {
							_findElements(item);
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	_domObserver();

	function _listenValues() {
		var self = this;
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.attributeName === 'data-ln-progress' || mutation.attributeName === 'data-ln-progress-max') {
					_render.call(self);
				}
			});
		});

		observer.observe(this.dom, {
			attributes: true,
			attributeFilter: ['data-ln-progress', 'data-ln-progress-max']
		});
	}

	function _render() {
		var value = parseFloat(this.dom.getAttribute('data-ln-progress')) || 0;
		var max = parseFloat(this.dom.getAttribute('data-ln-progress-max')) || 100;
		var percentage = (max > 0) ? (value / max) * 100 : 0;

		if (percentage < 0) percentage = 0;
		if (percentage > 100) percentage = 100;

		this.dom.style.width = percentage + '%';
		_dispatch(this.dom, 'ln-progress:change', { target: this.dom, value: value, max: max, percentage: percentage });
	}

	// make lnProgress globally available
	window[DOM_ATTRIBUTE] = constructor;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			window.lnProgress(document.body);
		});
	} else {
		window.lnProgress(document.body);
	}
})();
