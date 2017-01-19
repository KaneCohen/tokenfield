module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1).default;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(2);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Input field with tagging/token/chip capabilities written in raw JavaScript
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * tokenfield 0.6.4 <https://github.com/KaneCohen/tokenfield>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Available under BSD-3-Clause license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var _tokenfields = {};

	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	var reHasRegExpChar = RegExp(reRegExpChar.source);

	var _factory = document.createElement('div');

	var _templates = {
	  containerTokenfield: '<div class="tokenfield tokenfield-mode-tokens">\n      <div class="tokenfield-set">\n        <ul></ul>\n      </div>\n      <input class="tokenfield-input" />\n      <div class="tokenfield-suggest">\n        <ul class="tokenfield-suggest-list"></ul>\n      </div>\n    </div>',
	  containerList: '<div class="tokenfield tokenfield-mode-list">\n      <input class="tokenfield-input" />\n      <div class="tokenfield-suggest">\n        <ul class="tokenfield-suggest-list"></ul>\n      </div>\n      <div class="tokenfield-set">\n        <ul></ul>\n      </div>\n    </div>',
	  suggestItem: '<li class="tokenfield-suggest-item"></li>',
	  setItem: '<li class="tokenfield-set-item">\n      <span class="item-label"></span>\n      <span class="item-remove">\xD7</span>\n      <input class="item-input" type="hidden" />\n    </li>'
	};

	function guid() {
	  return ((1 + Math.random()) * 0x10000 | 0).toString(16) + ((1 + Math.random()) * 0x10000 | 0).toString(16);
	}

	function getPath(node) {
	  var nodes = [node];
	  while (node.parentNode) {
	    node = node.parentNode;
	    nodes.push(node);
	  }
	  return nodes;
	}

	function build(html, all) {
	  if (html.nodeName) return html;
	  html = html.replace(/(\t|\n$)/g, '');

	  _factory.innerHTML = '';
	  _factory.innerHTML = html;
	  if (all === true) {
	    return _factory.childNodes;
	  } else {
	    return _factory.childNodes[0];
	  }
	}

	function toString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value === null) {
	    return '';
	  }
	  var result = value + '';
	  return result === '0' && 1 / value === -Infinity ? '-0' : result;
	}

	function escapeRegex(string) {
	  string = toString(string);
	  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
	}

	function ajax(params) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	  var xhr = new XMLHttpRequest();
	  var url = options.url;
	  var paramsArr = [];
	  for (var key in params) {
	    paramsArr.push(key + '=' + params[key]);
	  }

	  var paramsString = paramsArr.join('&');
	  if (options.type.toLowerCase() === 'get') {
	    url += '?' + paramsString;
	  }

	  xhr.open(options.type, url, true);
	  if (callback) {
	    xhr.onreadystatechange = callback;
	  }
	  xhr.send(params);
	  return xhr;
	}

	function makeDefaultsAndOptions() {
	  var _defaults = {
	    focusedItem: null,
	    cache: {},
	    timer: null,
	    xhr: null,
	    suggested: false,
	    suggestedItems: [],
	    setItems: [],
	    events: {},
	    delimiters: {}
	  };

	  var _options = {
	    el: null,
	    form: true, // Listens to reset event on the specifiedform. If set to true listens to
	    // immediate parent form. Also accepts selectors or elements.
	    mode: 'tokenfield', // Display mode: tokenfield or list.
	    addItemOnBlur: false, // Add token if input field loses focus.
	    addItemsOnPaste: false, // Add tokens using `delimiters` option below to tokenize given string.
	    setItems: [], // List of set items.
	    items: [], // List of available items to work with.
	    // Example: [{id: 143, value: 'Hello World'}, {id: 144, value: 'Foo Bar'}].
	    newItems: true, // Allow input (on delimiter key) of new items.
	    multiple: true, // Accept multiple tags per field.
	    maxItems: 0, // Set maximum allowed number of items.
	    keys: { // Various action keys.
	      17: 'ctrl',
	      16: 'shift',
	      91: 'meta',
	      8: 'delete', // Backspace
	      27: 'esc',
	      37: 'left',
	      38: 'up',
	      39: 'right',
	      40: 'down',
	      46: 'delete',
	      65: 'select',
	      9: 'delimiter', // Tab
	      13: 'delimiter', // Enter
	      108: 'delimiter' // Numpad Enter
	    },
	    delimiters: [], // Array of strings which act as delimiters during tokenization.
	    remote: {
	      type: 'GET', // Ajax request type.
	      url: null, // Full server url.
	      queryParam: 'q', // What param to use when asking server for data.
	      delay: 300, // Dealy between last keydown event and ajax request for data.
	      timestampParam: 't',
	      params: {}
	    },
	    placeholder: null, // Hardcoded placeholder text. If not set, will use placeholder from the element itself.
	    inputType: 'text', // HTML attribute for the input element which lets mobile browsers use various input modes.
	    // Accepts text, email, url, and others.
	    minChars: 2, // Number of characters before we start to look for similar items.
	    maxSuggest: 10, // Max items in the suggest box.
	    itemLabel: 'name', // Property to use in order to render item label.
	    itemName: 'items', // If set, for each tag/token there will be added
	    // input field with array property name:
	    // name="items[]".

	    newItemName: 'items_new', // Suffix that will be added to the new tag in
	    // case it was not available from the server:
	    // name="items_new[]".

	    itemValue: 'id', // Value that will be taken out of the results and inserted into itemAttr.
	    newItemValue: 'name', // Value that will be taken out of the results and inserted into itemAttr.
	    itemData: 'name' // Which property to search for.
	  };
	  return { _defaults: _defaults, _options: _options };
	}

	var Tokenfield = function (_EventEmitter) {
	  _inherits(Tokenfield, _EventEmitter);

	  function Tokenfield() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Tokenfield);

	    var _this = _possibleConstructorReturn(this, (Tokenfield.__proto__ || Object.getPrototypeOf(Tokenfield)).call(this));

	    var _makeDefaultsAndOptio = makeDefaultsAndOptions(),
	        _defaults = _makeDefaultsAndOptio._defaults,
	        _options = _makeDefaultsAndOptio._options;

	    _this.id = guid();
	    _this.key = 'key_' + _this.id;
	    _this._vars = Object.assign({}, _defaults);
	    _this._options = Object.assign({}, _options, options);
	    _this._options.keys = Object.assign({}, _options.keys, options.keys);
	    _this._options.remote = Object.assign({}, _options.remote, options.remote);
	    _this._templates = Object.assign({}, _templates, options.templates);
	    _this._vars.setItems = _this._prepareData(_this._options.setItems || []);
	    _this._focused = false;
	    _this._form = false;
	    _this._html = {};

	    var o = _this._options;

	    // Make a hash map to simplify filtering later.
	    o.delimiters.forEach(function (delimiter) {
	      _this._vars.delimiters[delimiter] = true;
	    });

	    if (o.el.nodeName) {
	      _this.el = o.el;
	    } else if (typeof o.el == 'string') {
	      var el = document.querySelector(o.el);
	      if (!el) {
	        throw new Error('Selector: DOM Element ' + o.el + ' not found.');
	      }
	      _this.el = el;
	    } else {
	      throw new Error('Cannot create tokenfield without DOM Element.');
	    }

	    _this.el.tokenfield = _this;

	    if (o.placeholder === null) {
	      o.placeholder = o.el.placeholder || '';
	    }

	    if (o.form) {
	      var form = false;
	      if (o.form.nodeName) {
	        form = o.form;
	      } else if (o.form === true) {
	        var node = _this.el;
	        while (node.parentNode) {
	          if (node.nodeName === 'FORM') {
	            form = node;
	            break;
	          }
	          node = node.parentNode;
	        }
	      } else if (typeof form == 'string') {
	        form = document.querySelector(form);
	        if (!form) {
	          throw new Error('Selector: DOM Element ' + o.form + ' not found.');
	        }
	      }
	      _this._form = form;
	    } else {
	      throw new Error('Cannot create tokenfield without DOM Element.');
	    }

	    _tokenfields[_this.id] = _this;

	    _this._render();
	    return _this;
	  }

	  _createClass(Tokenfield, [{
	    key: '_render',
	    value: function _render() {
	      var o = this._options;
	      var html = this._html;

	      if (o.mode === 'tokenfield') {
	        html.container = build(this._templates.containerTokenfield);
	      } else {
	        html.container = build(this._templates.containerList);
	      }
	      html.suggest = html.container.querySelector('.tokenfield-suggest');
	      html.suggestList = html.container.querySelector('.tokenfield-suggest-list');
	      html.items = html.container.querySelector('.tokenfield-set > ul');
	      html.input = html.container.querySelector('.tokenfield-input');
	      html.input.setAttribute('type', o.inputType);
	      html.input.placeholder = o.placeholder;

	      o.el.style.display = 'none';
	      html.suggest.style.display = 'none';
	      this._renderSizer();

	      // Set tokenfield in DOM.
	      html.container.tokenfield = this;
	      o.el.parentElement.insertBefore(html.container, o.el);
	      html.container.insertBefore(o.el, html.container.firstChild);

	      this._setEvents();
	      this._renderItems();
	      if (o.mode === 'tokenfield') {
	        this._resizeInput();
	      }

	      return this;
	    }
	  }, {
	    key: '_renderSizer',
	    value: function _renderSizer() {
	      var html = this._html;
	      var b = this._getBounds();
	      var style = window.getComputedStyle(html.container);
	      var compensate = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);

	      var styles = {
	        width: 'auto',
	        height: 'auto',
	        overflow: 'hidden',
	        whiteSpace: 'pre',
	        maxWidth: b.width - compensate + 'px',
	        position: 'fixed',
	        top: -10000 + 'px',
	        left: 10000 + 'px',
	        fontSize: style.fontSize,
	        paddingLeft: style.paddingLeft,
	        paddingRight: style.paddingRight
	      };

	      html.sizer = document.createElement('div');
	      html.sizer.id = 'tokenfield-sizer-' + this.id;
	      for (var key in styles) {
	        html.sizer.style[key] = styles[key];
	      }
	      html.container.appendChild(html.sizer);
	    }
	  }, {
	    key: '_refreshInput',
	    value: function _refreshInput() {
	      var empty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      var v = this._vars;
	      var html = this._html;

	      if (empty) html.input.value = '';

	      if (this._options.mode === 'tokenfield') {
	        this._resizeInput();
	        var placeholder = v.setItems.length ? '' : this._options.placeholder;
	        html.input.setAttribute('placeholder', placeholder);
	      }
	      return this;
	    }
	  }, {
	    key: '_resizeInput',
	    value: function _resizeInput() {
	      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      var html = this._html;
	      var b = this._getBounds();
	      var style = window.getComputedStyle(html.container);
	      var compensate = parseInt(style.paddingRight, 10) + parseInt(style.borderRightWidth, 10);

	      var fullCompensate = compensate + parseInt(style.paddingLeft, 10) + parseInt(style.borderLeftWidth, 10);

	      html.sizer.innerHTML = val;
	      html.input.style.width = '20px';

	      var sb = html.sizer.getBoundingClientRect();
	      var ib = html.input.getBoundingClientRect();
	      var rw = b.width - (ib.left - b.left) - compensate;

	      if (sb.width > rw) {
	        html.input.style.width = b.width - fullCompensate + 'px';
	      } else {
	        html.input.style.width = rw + 'px';
	      }
	    }
	  }, {
	    key: '_fetchData',
	    value: function _fetchData(val) {
	      var _this2 = this;

	      var v = this._vars;
	      var o = this._options;
	      var r = o.remote;
	      var reqData = Object.assign({}, o.params);

	      for (var key in r.params) {
	        reqData[key] = r.params[key];
	      }

	      if (r.limit) {
	        reqData[r.limit] = o.remote.limit;
	      }

	      reqData[r.queryParam] = val;
	      reqData[r.timestampParam] = Math.round(new Date().getTime() / 1000);

	      v.xhr = ajax(reqData, o.remote, function () {
	        if (v.xhr.readyState == 4) {
	          if (v.xhr.status == 200) {
	            var response = JSON.parse(v.xhr.responseText);
	            v.cache[val] = response;
	            var data = _this2._prepareData(_this2.remapData(response));
	            var items = _this2._filterData(val, data);
	            v.suggestedItems = _this2._filterSetItems(items);
	            _this2.showSuggestions();
	          } else if (v.xhr.status > 0) {
	            throw new Error('Error while loading remote data.');
	          }
	          _this2._abortXhr();
	        }
	      });
	    }

	    // Overwriteable method where you can change given data to appropriate format.

	  }, {
	    key: 'remapData',
	    value: function remapData(data) {
	      return data;
	    }
	  }, {
	    key: '_prepareData',
	    value: function _prepareData(data) {
	      var _this3 = this;

	      return data.map(function (item) {
	        return Object.assign({}, item, _defineProperty({}, _this3.key, guid()));
	      });
	    }
	  }, {
	    key: '_filterData',
	    value: function _filterData(val, data) {
	      var o = this._options;
	      var patt = new RegExp(escapeRegex(val), 'i');
	      return data.filter(function (item) {
	        return patt.test(item[o.itemData]);
	      });
	    }
	  }, {
	    key: '_abortXhr',
	    value: function _abortXhr() {
	      var v = this._vars;
	      if (v.xhr !== null) {
	        v.xhr.abort();
	        v.xhr = null;
	      }
	    }
	  }, {
	    key: '_filterSetItems',
	    value: function _filterSetItems(items) {
	      var key = this._options.itemValue;
	      var v = this._vars;
	      if (!v.setItems.length) return items;

	      var setKeys = v.setItems.map(function (item) {
	        return item[key];
	      });

	      return items.filter(function (item) {
	        if (setKeys.indexOf(item[key]) === -1) {
	          return true;
	        }
	        return false;
	      });
	    }
	  }, {
	    key: '_setEvents',
	    value: function _setEvents() {
	      var v = this._vars;
	      var html = this._html;
	      v.events.onClick = this._onClick.bind(this);
	      v.events.onMouseDown = this._onMouseDown.bind(this);
	      v.events.onMouseOver = this._onMouseOver.bind(this);
	      v.events.onFocus = this._onFocus.bind(this);
	      v.events.onResize = this._onResize.bind(this);
	      v.events.onReset = this._onReset.bind(this);

	      html.container.addEventListener('click', v.events.onClick);
	      html.container.addEventListener('touchend', v.events.onClick);

	      // Attach document event only once.
	      if (Object.keys(_tokenfields).length === 1) {
	        document.addEventListener('mousedown', v.events.onMouseDown);
	        document.addEventListener('touchstart', v.events.onMouseDown);
	        window.addEventListener('resize', v.events.onResize);
	      }

	      if (this._form && this._form.nodeName) {
	        this._form.addEventListener('reset', v.events.onReset);
	      }

	      html.suggestList.addEventListener('mouseover', v.events.onMouseOver);
	      html.input.addEventListener('focus', v.events.onFocus);
	    }
	  }, {
	    key: '_onMouseOver',
	    value: function _onMouseOver(e) {
	      var target = e.target;
	      if (target.classList.contains('tokenfield-suggest-item')) {
	        var selected = this._html.suggestList.querySelectorAll('.selected');
	        Array.prototype.forEach.call(selected, function (item) {
	          if (item !== target) item.classList.remove('selected');
	        });
	        target.classList.add('selected');
	        this._selectItem(target.key);
	        this._refreshItemsSelection();
	      }
	    }
	  }, {
	    key: '_onReset',
	    value: function _onReset() {
	      this.setItems(this._options.setItems);
	    }
	  }, {
	    key: '_onFocus',
	    value: function _onFocus(e) {
	      var v = this._vars;
	      var html = this._html;
	      var o = this._options;
	      v.events.onKeyDown = this._onKeyDown.bind(this);
	      v.events.onFocusOut = this._onFocusOut.bind(this);

	      html.input.removeEventListener('keydown', v.events.onKeyDown);
	      html.input.addEventListener('keydown', v.events.onKeyDown);
	      html.input.addEventListener('focusout', v.events.onFocusOut);

	      if (o.addItemsOnPaste) {
	        v.events.onPaste = this._onPaste.bind(this);
	        html.input.addEventListener('paste', v.events.onPaste);
	      }

	      this.focus();
	      this._focused = true;
	      if (html.input.value.trim().length >= o.minChars) {
	        this.showSuggestions();
	      }
	    }
	  }, {
	    key: '_onFocusOut',
	    value: function _onFocusOut(e) {
	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;
	      html.input.removeEventListener('keydown', v.events.onKeyDown);
	      html.input.removeEventListener('focusout', v.events.onFocusOut);

	      if (typeof v.events.onPaste !== 'undefined') {
	        html.input.removeEventListener('paste', v.events.onPaste);
	      }

	      var canAddItem = !o.maxItems || o.maxItems && v.setItems.length < o.maxItems;

	      if (this._focused && o.addItemOnBlur && canAddItem && this._newItem(html.input.value)) {
	        this._renderItems()._refreshInput().focus();
	      } else {
	        this._defocusItems()._renderItems();
	      }

	      this._focused = false;
	    }
	  }, {
	    key: '_onMouseDown',
	    value: function _onMouseDown(e) {
	      var tokenfield = null;
	      for (var key in _tokenfields) {
	        if (_tokenfields[key]._html.container.contains(e.target)) {
	          tokenfield = _tokenfields[key];
	          break;
	        }
	      }

	      if (tokenfield) {
	        for (var _key in _tokenfields) {
	          if (_key !== tokenfield.id) {
	            _tokenfields[_key].hideSuggestions();
	            _tokenfields[_key].blur();
	          }
	        }

	        // Prevent input blur.
	        if (e.target !== tokenfield._html.input) {
	          e.preventDefault();
	        }
	      } else {
	        for (var _key2 in _tokenfields) {
	          _tokenfields[_key2].hideSuggestions();
	          _tokenfields[_key2].blur();
	        }
	      }
	    }
	  }, {
	    key: '_onResize',
	    value: function _onResize() {
	      for (var key in _tokenfields) {
	        _tokenfields[key]._resizeInput(_tokenfields[key]._html.input.value);
	      }
	    }
	  }, {
	    key: '_onPaste',
	    value: function _onPaste(e) {
	      var _this4 = this;

	      var v = this._vars;
	      var o = this._options;
	      var val = e.clipboardData.getData('text');
	      var tokens = [val];

	      // Break input using delimiters option.
	      if (o.delimiters.length) {
	        var search = o.delimiters.join('|');
	        var splitRegex = new RegExp('(' + search + ')', 'ig');
	        tokens = val.split(splitRegex);
	      }

	      var items = tokens.map(function (token) {
	        return token.trim();
	      }).filter(function (token) {
	        return token.length > 0 && token.length >= o.minChars && typeof v.delimiters[token] === 'undefined';
	      }).map(function (token) {
	        return _this4._newItem(token);
	      });

	      if (items.length) {
	        setTimeout(function () {
	          _this4._renderItems()._refreshInput()._deselectItems().hideSuggestions().blur();
	        }, 1);

	        e.preventDefault();
	      }
	    }
	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(e) {
	      var _this5 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      if (o.mode === 'tokenfield') {
	        setTimeout(function () {
	          _this5._resizeInput(html.input.value);
	        }, 1);
	      }

	      if (typeof o.keys[e.keyCode] !== 'undefined' || o.delimiters.includes(e.key)) {
	        this._keyAction(e);
	        return true;
	      } else {
	        this._defocusItems()._refreshItems();
	      }

	      clearTimeout(v.timer);
	      this._abortXhr();

	      if (o.maxItems && v.setItems.length >= o.maxItems) {
	        e.preventDefault();
	      } else {
	        setTimeout(function () {
	          _this5._keyInput(e);
	        }, 1);
	      }
	    }
	  }, {
	    key: '_keyAction',
	    value: function _keyAction(e) {
	      var _this6 = this;

	      var item = null;
	      var v = this._vars;
	      var key = this.key;
	      var o = this._options;
	      var html = this._html;
	      var keyName = o.keys[e.keyCode];
	      var val = html.input.value.trim();

	      if (o.delimiters.includes(e.key) && typeof keyName === 'undefined') {
	        keyName = 'delimiter';
	      }

	      var selected = this._getSelectedItems();
	      if (selected.length) {
	        item = selected[0];
	      }

	      switch (keyName) {
	        case 'esc':
	          this._deselectItems()._defocusItems()._renderItems().hideSuggestions();
	          break;
	        case 'up':
	          if (this._vars.suggested) {
	            this._selectPrevItem()._refreshItemsSelection();
	            e.preventDefault();
	          }
	          this._defocusItems()._renderItems();
	          break;
	        case 'down':
	          if (this._vars.suggested) {
	            this._selectNextItem()._refreshItemsSelection();
	            e.preventDefault();
	          }
	          this._defocusItems()._renderItems();
	          break;
	        case 'left':
	          if (this.getFocusedItems().length || !html.input.selectionStart) {
	            this._focusPrevItem(e.shiftKey);
	            e.preventDefault();
	          }
	          break;
	        case 'right':
	          if (this.getFocusedItems().length || html.input.selectionStart === val.length) {
	            this._focusNextItem(e.shiftKey);
	            e.preventDefault();
	          }
	          break;
	        case 'delimiter':
	          this._abortXhr();
	          this._defocusItems();

	          if (v.setItems.length == 1 && !o.multiple) {
	            return false;
	          }

	          val = this.onInput(val);
	          if (item) {
	            this._addItem(item);
	          } else if (val.length) {
	            item = this._newItem(val);
	          }

	          if (item) {
	            this._renderItems().focus()._refreshInput()._refreshSuggestions()._deselectItems();
	          }
	          e.preventDefault();
	          break;
	        case 'select':
	          if (!val.length && (e.ctrlKey || e.metaKey)) {
	            this._vars.setItems.forEach(function (item) {
	              item.focused = true;
	            });
	            this._refreshItems();
	          }
	          break;
	        case 'delete':
	          {
	            this._abortXhr();
	            var focusedItems = this.getFocusedItems();
	            if (!html.input.selectionEnd && e.keyCode === 8 || html.input.selectionStart === val.length && e.keyCode === 46 || focusedItems.length) {
	              this.hideSuggestions();
	              if (o.mode === 'tokenfield' && v.setItems.length) {
	                if (focusedItems.length) {
	                  focusedItems.forEach(function (item) {
	                    _this6._removeItem(item[key]);
	                  });
	                } else if (!html.input.selectionStart) {
	                  this._focusItem(v.setItems[v.setItems.length - 1][key]);
	                }
	              } else if (focusedItems.length) {
	                focusedItems.forEach(function (item) {
	                  _this6._removeItem(item[key]);
	                });
	              }
	              this._renderItems()._refreshInput(false);
	            } else {
	              v.timer = setTimeout(function () {
	                _this6._keyInput(e);
	              }, o.delay);
	            }
	            break;
	          }
	        default:
	          break;
	      }
	    }
	  }, {
	    key: '_keyInput',
	    value: function _keyInput(e) {
	      var _this7 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      this._defocusItems()._refreshItems();

	      var val = this.onInput(html.input.value.trim(), e);

	      if (val.length < o.minChars) {
	        this.hideSuggestions();
	        return false;
	      }

	      if (v.setItems.length == 1 && !o.multiple) {
	        return false;
	      }

	      // Check if we have cache with this val.
	      if (typeof v.cache[val] === 'undefined') {
	        // Get new data.
	        if (o.remote.url) {
	          v.timer = setTimeout(function () {
	            _this7._fetchData(val);
	          }, o.delay);
	        } else if (!o.remote.url && o.items.length) {
	          var data = this._prepareData(this.remapData(o.items));
	          var items = this._filterData(val, data);
	          v.suggestedItems = this._filterSetItems(items);
	          this.showSuggestions();
	        }
	      } else {
	        // Work with cached data.
	        var _data = this._prepareData(this.remapData(v.cache[val]));
	        var _items = this._filterData(val, _data);
	        v.suggestedItems = this._filterSetItems(_items);
	        this.showSuggestions();
	      }

	      return this;
	    }
	  }, {
	    key: '_onClick',
	    value: function _onClick(e) {
	      var target = e.target;

	      if (target.classList.contains('item-remove')) {

	        this._removeItem(target.key)._defocusItems()._renderItems()._keyInput(e);

	        this.focus();
	      } else if (target.classList.contains('tokenfield-suggest-item')) {

	        var item = this._getSuggestedItem(target.key);
	        this._addItem(item)._renderItems()._refreshInput()._refreshSuggestions().focus();
	      } else {

	        var setItem = getPath(target).filter(function (node) {
	          return node.classList && node.classList.contains('tokenfield-set-item');
	        })[0];

	        if (setItem) {
	          this._focusItem(setItem.key, e.shiftKey, e.ctrlKey || e.metaKey, true);
	          this._refreshItems();
	        } else {
	          this._keyInput(e);
	        }

	        this.focus();
	      }
	    }
	  }, {
	    key: '_selectPrevItem',
	    value: function _selectPrevItem() {
	      var key = this.key;
	      var o = this._options;
	      var items = this._vars.suggestedItems;
	      var index = this._getSelectedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === 0) {
	          if (o.newItems) {
	            this._deselectItems();
	          } else {
	            this._selectItem(items[items.length - 1][key]);
	          }
	        } else {
	          this._selectItem(items[index - 1][key]);
	        }
	      } else {
	        this._selectItem(items[items.length - 1][key]);
	      }

	      return this;
	    }
	  }, {
	    key: '_selectNextItem',
	    value: function _selectNextItem() {
	      var key = this.key;
	      var o = this._options;
	      var items = this._vars.suggestedItems;
	      var index = this._getSelectedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === items.length - 1) {
	          if (o.newItems) {
	            this._deselectItems();
	          } else {
	            this._selectItem(items[0][key]);
	          }
	        } else {
	          this._selectItem(items[index + 1][key]);
	        }
	      } else {
	        this._selectItem(items[0][key]);
	      }

	      return this;
	    }
	  }, {
	    key: '_focusPrevItem',
	    value: function _focusPrevItem() {
	      var multiple = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      var key = this.key;
	      var items = this._vars.setItems;
	      var index = this._getFocusedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === 0 && !multiple) {
	          this._defocusItems();
	        } else if (index === 0 && multiple) {
	          this._focusItem(items[items.length - 1][key], multiple, false, true);
	        } else {
	          this._focusItem(items[index - 1][key], multiple, false, true);
	        }
	      } else {
	        this._focusItem(items[items.length - 1][key], multiple, false, true);
	      }
	      this._refreshItems();

	      return this;
	    }
	  }, {
	    key: '_focusNextItem',
	    value: function _focusNextItem() {
	      var multiple = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      var key = this.key;
	      var items = this._vars.setItems;
	      var index = this._getFocusedItemIndex(true);

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === items.length - 1 && !multiple) {
	          this._defocusItems();
	        } else if (index === items.length - 1 && multiple) {
	          this._focusItem(items[0][key], multiple);
	        } else {
	          this._focusItem(items[index + 1][key], multiple);
	        }
	      } else {
	        this._focusItem(items[0][key], multiple);
	      }
	      this._refreshItems();

	      return this;
	    }
	  }, {
	    key: '_getSelectedItems',
	    value: function _getSelectedItems() {
	      var key = this.key;
	      var setIds = this._vars.setItems.map(function (item) {
	        return item[key];
	      });
	      return this._vars.suggestedItems.filter(function (v) {
	        return v.selected && setIds.indexOf(v[key]) < 0;
	      });
	    }
	  }, {
	    key: '_selectItem',
	    value: function _selectItem(key) {
	      var _this8 = this;

	      this._vars.suggestedItems.forEach(function (v) {
	        v.selected = v[_this8.key] === key;
	      });
	    }
	  }, {
	    key: '_deselectItem',
	    value: function _deselectItem(key) {
	      var _this9 = this;

	      this._vars.suggestedItems.every(function (v) {
	        if (v[_this9.key] === key) {
	          v.selected = false;
	          return false;
	        }
	        return true;
	      });
	      return this;
	    }
	  }, {
	    key: '_deselectItems',
	    value: function _deselectItems() {
	      this._vars.suggestedItems.forEach(function (v) {
	        v.selected = false;
	      });
	      return this;
	    }
	  }, {
	    key: '_refreshItemsSelection',
	    value: function _refreshItemsSelection() {
	      this._vars.suggestedItems.forEach(function (v) {
	        if (v.selected && v.el) {
	          v.el.classList.add('selected');
	        } else if (v.el) {
	          v.el.classList.remove('selected');
	        }
	      });
	    }
	  }, {
	    key: '_getSelectedItemIndex',
	    value: function _getSelectedItemIndex() {
	      var index = null;
	      this._vars.suggestedItems.every(function (v, k) {
	        if (v.selected) {
	          index = k;
	          return false;
	        }
	        return true;
	      });
	      return index;
	    }
	  }, {
	    key: '_getFocusedItemIndex',
	    value: function _getFocusedItemIndex() {
	      var last = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      var index = null;
	      this._vars.setItems.every(function (v, k) {
	        if (v.focused) {
	          index = k;
	          if (!last) {
	            return false;
	          }
	        }
	        return true;
	      });
	      return index;
	    }
	  }, {
	    key: '_getItem',
	    value: function _getItem(val) {
	      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      if (prop === null) prop = this.key;
	      var items = this._filterItems(this._vars.setItems, val, prop);
	      return items.length ? items[0] : null;
	    }
	  }, {
	    key: '_getSuggestedItem',
	    value: function _getSuggestedItem(val) {
	      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      if (prop === null) prop = this.key;
	      var items = this._filterItems(this._vars.suggestedItems, val, prop);
	      return items.length ? items[0] : null;
	    }
	  }, {
	    key: '_filterItems',
	    value: function _filterItems(items, val, prop) {
	      return items.filter(function (v) {
	        if (typeof v[prop] === 'string' && typeof val === 'string') {
	          return v[prop].toLowerCase() === val.toLowerCase();
	        }
	        return v[prop] === val;
	      });
	    }
	  }, {
	    key: '_removeItem',
	    value: function _removeItem(key) {
	      var _this10 = this;

	      this._vars.setItems.every(function (item, k) {
	        if (item[_this10.key] === key) {
	          _this10.emit('removeToken', _this10, item);
	          _this10._vars.setItems.splice(k, 1);
	          _this10.emit('removedToken', _this10);
	          _this10.emit('change', _this10);
	          return false;
	        }
	        return true;
	      });
	      return this;
	    }
	  }, {
	    key: '_addItem',
	    value: function _addItem(item) {
	      item.focused = false;
	      if (!this._getItem(item[this.key])) {
	        this.emit('addToken', this, item);
	        if (!this._options.maxItems || this._options.maxItems && this._vars.setItems.length < this._options.maxItems) {
	          item.selected = false;
	          var clonedItem = Object.assign({}, item);
	          this._vars.setItems.push(clonedItem);
	          this.emit('addedToken', this, clonedItem);
	          this.emit('change', this);
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'getFocusedItem',
	    value: function getFocusedItem() {
	      var items = this._vars.setItems.filter(function (item) {
	        return item.focused;
	      })[0];
	      if (items.length) return items[0];
	      return null;
	    }
	  }, {
	    key: 'getFocusedItems',
	    value: function getFocusedItems() {
	      return this._vars.setItems.filter(function (item) {
	        return item.focused;
	      });
	    }
	  }, {
	    key: '_focusItem',
	    value: function _focusItem(key) {
	      var shift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      var _this11 = this;

	      var ctrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	      var add = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


	      if (shift) {
	        var _ret = function () {
	          var first = null;
	          var last = null;
	          var target = null;
	          _this11._vars.setItems.forEach(function (item, k) {
	            if (item[_this11.key] === key) {
	              target = k;
	            }
	            if (first === null && item.focused) {
	              first = k;
	            }
	            if (item.focused) {
	              last = k;
	            }
	          });

	          if (target === 0 && first === null && last === null) {
	            return {
	              v: void 0
	            };
	          } else if (first === null && last === null) {
	            _this11._vars.setItems[target].focused = true;
	          } else if (target === 0 && last === _this11._vars.setItems.length - 1 && !add) {
	            _this11._vars.setItems[first].focused = false;
	          } else {
	            first = Math.min(target, first);
	            last = Math.max(target, last);
	            _this11._vars.setItems.forEach(function (item, k) {
	              item.focused = target === k || k >= first && k <= last;
	            });
	          }
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      } else {
	        this._vars.setItems.forEach(function (item) {
	          if (ctrl) {
	            item.focused = item[_this11.key] === key ? !item.focused : item.focused;
	          } else {
	            item.focused = item[_this11.key] === key;
	          }
	        });
	      }
	      return this;
	    }
	  }, {
	    key: '_defocusItems',
	    value: function _defocusItems() {
	      this._vars.setItems.forEach(function (item) {
	        item.focused = false;
	      });
	      return this;
	    }
	  }, {
	    key: '_newItem',
	    value: function _newItem(value) {
	      if (typeof value === 'string' && !value.length) return null;

	      var o = this._options;
	      var item = this._getItem(value, o.itemData) || this._getSuggestedItem(value, o.itemData);

	      if (!item && o.newItems) {
	        var _item;

	        item = (_item = {
	          isNew: true
	        }, _defineProperty(_item, this.key, guid()), _defineProperty(_item, o.itemData, value), _item);
	        this.emit('newToken', this, item);
	      }

	      if (item) {
	        this._addItem(item);
	        return item;
	      }

	      return null;
	    }

	    // Wrapper for build function in case some of the functions are overwritten.

	  }, {
	    key: '_buildEl',
	    value: function _buildEl(html) {
	      return build(html);
	    }
	  }, {
	    key: '_getBounds',
	    value: function _getBounds() {
	      return this._html.container.getBoundingClientRect();
	    }
	  }, {
	    key: '_renderItems',
	    value: function _renderItems() {
	      var _this12 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      html.items.innerHTML = '';
	      v.setItems.forEach(function (item) {
	        var itemEl = _this12._renderItem(item);
	        html.items.appendChild(itemEl);
	        item.el = itemEl;
	        if (item.focused) {
	          item.el.classList.add('focused');
	        } else {
	          item.el.classList.remove('focused');
	        }
	      });

	      if (v.setItems.length > 1 && o.mode === 'tokenfield') {
	        html.input.setAttribute('placeholder', '');
	      }

	      return this;
	    }
	  }, {
	    key: '_refreshItems',
	    value: function _refreshItems() {
	      var v = this._vars;

	      v.setItems.forEach(function (item) {
	        if (item.focused) {
	          item.el.classList.add('focused');
	        } else {
	          item.el.classList.remove('focused');
	        }
	      });
	    }
	  }, {
	    key: '_renderItem',
	    value: function _renderItem(item) {
	      var o = this._options;

	      var itemHtml = this.renderSetItemHtml(item);
	      var label = itemHtml.querySelector('.item-label');
	      var input = itemHtml.querySelector('.item-input');
	      var remove = itemHtml.querySelector('.item-remove');

	      itemHtml.key = item[this.key];
	      remove.key = item[this.key];
	      input.setAttribute('name', (item.isNew ? o.newItemName : o.itemName) + '[]');

	      input.value = item[item.isNew ? o.newItemValue : o.itemValue] || null;
	      label.textContent = this.renderSetItemLabel(item);
	      if (item.focused) {
	        itemHtml.classList.add('focused');
	      }

	      return itemHtml;
	    }
	  }, {
	    key: 'onInput',
	    value: function onInput(value, e) {
	      return value;
	    }
	  }, {
	    key: 'renderSetItemHtml',
	    value: function renderSetItemHtml() {
	      return this._buildEl(this._templates.setItem);
	    }
	  }, {
	    key: 'renderSetItemLabel',
	    value: function renderSetItemLabel(item) {
	      return item[this._options.itemLabel];
	    }
	  }, {
	    key: 'renderSuggestions',
	    value: function renderSuggestions(items) {
	      var _this13 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;
	      var index = this._getSelectedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      html.suggestList.innerHTML = '';

	      if (!v.suggestedItems.length) {
	        return this;
	      }

	      if (!o.newItems && index === null) {
	        items[0].selected = true;
	      }

	      items.every(function (item, k) {
	        if (k >= o.maxSuggest) return false;

	        var el = _this13.renderSuggestedItem(item);
	        item.el = el;
	        html.suggestList.appendChild(el);
	        return true;
	      });

	      return this;
	    }
	  }, {
	    key: 'renderSuggestedItem',
	    value: function renderSuggestedItem(item) {
	      var o = this._options;
	      var el = this._buildEl(this._templates.suggestItem);
	      el.key = item[this.key];
	      el.innerHTML = item[o.itemData];
	      el.setAttribute('title', item[o.itemData]);
	      if (item.selected) {
	        el.classList.add('selected');
	      }
	      return el;
	    }
	  }, {
	    key: 'showSuggestions',
	    value: function showSuggestions() {
	      if (this._vars.suggestedItems.length) {
	        this.emit('showSuggestions', this);
	        if (!this._options.maxItems || this._options.maxItems && this._vars.setItems.length < this._options.maxItems) {
	          this.renderSuggestions(this._vars.suggestedItems);
	          this._html.suggest.style.display = 'block';
	          this._vars.suggested = true;
	        }
	        this.emit('shownSuggestions', this);
	      } else {
	        this.hideSuggestions();
	      }
	      return this;
	    }
	  }, {
	    key: '_refreshSuggestions',
	    value: function _refreshSuggestions() {
	      var v = this._vars;
	      var o = this._options;

	      if (v.suggestedItems.length) {
	        if (!o.maxItems || o.maxItems && v.setItems.length < o.maxItems) {
	          var data = this._prepareData(this.remapData(o.items));
	          var items = this._filterData(this._html.input.value, data);
	          this._vars.suggestedItems = this._filterSetItems(items);
	          this.renderSuggestions(this._vars.suggestedItems);
	        } else {
	          this.hideSuggestions();
	        }
	      } else {
	        this.hideSuggestions();
	      }
	      return this;
	    }
	  }, {
	    key: 'hideSuggestions',
	    value: function hideSuggestions() {
	      this.emit('hideSuggestions', this);
	      this._vars.suggested = false;
	      this._html.suggest.style.display = 'none';
	      this._html.suggestList.innerHTML = '';
	      this.emit('hiddenSuggestions', this);
	      return this;
	    }
	  }, {
	    key: 'getItems',
	    value: function getItems() {
	      return this._vars.setItems.map(function (item) {
	        return Object.assign({}, item);
	      });
	    }
	  }, {
	    key: 'setItems',
	    value: function setItems() {
	      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	      this._vars.setItems = items;
	      this._refreshInput()._renderItems().hideSuggestions().focus();
	      this.emit('change', this);
	      return this;
	    }
	  }, {
	    key: 'emptyItems',
	    value: function emptyItems() {
	      this._vars.setItems = [];
	      this._refreshInput()._renderItems().hideSuggestions().focus();
	      this.emit('change', this);
	      return this;
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {
	      this._html.container.classList.add('focused');
	      this._html.input.focus();
	      return this;
	    }
	  }, {
	    key: 'blur',
	    value: function blur() {
	      this._html.container.classList.remove('focused');
	      this._html.input.blur();
	      return this;
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      var html = this._html;

	      html.container.parentElement.insertBefore(this.el, html.container);
	      html.container.remove();
	      this.el.style.display = 'block';

	      if (Object.keys(_tokenfields).length === 1) {
	        document.removeEventListener('mousedown', this._vars.events.onMouseDown);
	        window.removeEventListener('resize', this._vars.events.onResize);
	      }

	      if (this._form && this._form.nodeName) {
	        this._form.removeEventListener('reset', this._vars.events.onReset);
	      }

	      delete _tokenfields[this.id];
	      delete this.el.tokenfield;
	    }
	  }]);

	  return Tokenfield;
	}(_events2.default);

	exports.default = Tokenfield;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ }
/******/ ]);