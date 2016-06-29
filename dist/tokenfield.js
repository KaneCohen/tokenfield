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

	/**
	 * Input field with tagging/token/chip capabilities written in raw JavaScript
	 * tokenfield 0.3.4 <https://github.com/KaneCohen/tokenfield>
	 * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
	 * Available under BSD-3-Clause license
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x8, _x9, _x10) { var _again = true; _function: while (_again) { var object = _x8, property = _x9, receiver = _x10; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x8 = parent; _x9 = property; _x10 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _events = __webpack_require__(1);

	var _events2 = _interopRequireDefault(_events);

	var _tokenfields = {};

	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	var reHasRegExpChar = RegExp(reRegExpChar.source);

	var _factory = document.createElement('div');

	var _templates = {
	  containerTokenfield: '<div class="tokenfield tokenfield-mode-tokens">\n      <div class="tokenfield-set">\n        <ul></ul>\n      </div>\n      <input class="tokenfield-input" />\n      <div class="tokenfield-suggest">\n        <ul class="tokenfield-suggest-list"></ul>\n      </div>\n    </div>',
	  containerList: '<div class="tokenfield tokenfield-mode-list">\n      <input class="tokenfield-input" />\n      <div class="tokenfield-suggest">\n        <ul class="tokenfield-suggest-list"></ul>\n      </div>\n      <div class="tokenfield-set">\n        <ul></ul>\n      </div>\n    </div>',
	  suggestItem: '<li class="tokenfield-suggest-item"></li>',
	  setItem: '<li class="tokenfield-set-item">\n      <span class="item-label"></span>\n      <span class="item-remove">×</span>\n      <input class="item-input" type="hidden" />\n    </li>'
	};

	function guid() {
	  return ((1 + Math.random()) * 0x10000 | 0).toString(16) + ((1 + Math.random()) * 0x10000 | 0).toString(16);
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
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

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
	    keys: {
	      8: 'delete', // backspace
	      9: 'enter', // tab
	      13: 'enter', // normal enter
	      27: 'esc',
	      37: 'left',
	      38: 'up',
	      39: 'right',
	      40: 'down',
	      46: 'delete',
	      108: 'enter' // numpad enter
	    },
	    focusedItem: null,
	    cache: {},
	    timer: null,
	    xhr: null,
	    suggested: false,
	    suggestedItems: [],
	    setItems: [],
	    events: {}
	  };

	  var _options = {
	    el: null,
	    mode: 'tokenfield', // Display mode: tokenfield or list
	    setItems: [], // List of set items.
	    items: [], // List of available items to work with.
	    // Example: [{id: 143, value: 'Hello World'}, {id: 144, value: 'Foo Bar'}].
	    newItems: true, // Allow input (on enter) of new items.
	    multiple: true, // Accept multiple tags per field.
	    maxItems: 0, // Set maximum allowed number of items.
	    remote: {
	      type: 'GET', // Ajax request type.
	      url: null, // Full server url.
	      queryParam: 'q', // What param to use when asking server for data.
	      delay: 300, // Dealy between last keydown event and ajax request for data.
	      timestampParam: 't',
	      params: {}
	    },
	    placeholder: null, // Hardcoded placeholder text. If not set, will use placeholder from the element itself.
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

	var Tokenfield = (function (_EventEmitter) {
	  _inherits(Tokenfield, _EventEmitter);

	  function Tokenfield() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Tokenfield);

	    _get(Object.getPrototypeOf(Tokenfield.prototype), 'constructor', this).call(this);

	    var _makeDefaultsAndOptions = makeDefaultsAndOptions();

	    var _defaults = _makeDefaultsAndOptions._defaults;
	    var _options = _makeDefaultsAndOptions._options;

	    this.id = guid();
	    this.key = 'key_' + this.id;
	    this._vars = Object.assign({}, _defaults);
	    this._options = Object.assign({}, _options, options);
	    this._options.remote = Object.assign({}, _options.remote, options.remote);
	    this._templates = Object.assign({}, _templates, options.templates);
	    this._vars.setItems = this._options.setItems || [];
	    this._html = {};

	    var o = this._options;

	    if (o.el) {
	      var el = o.el;
	      if (typeof el == 'string') {
	        el = document.querySelector(o.el);
	        if (!el) {
	          throw new Error('Selector: DOM Element ' + o.el + ' not found.');
	        }
	      }
	      el.tokenfield = this;
	      this.el = el;
	    } else {
	      throw new Error('Cannot create tokenfield without DOM Element.');
	    }

	    if (o.placeholder === null) {
	      o.placeholder = o.el.placeholder || '';
	    }

	    _tokenfields[this.id] = this;

	    this._render();
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
	      html.input.placeholder = o.placeholder;

	      o.el.style.display = 'none';
	      html.suggest.style.display = 'none';
	      this._renderSizer();

	      // Set tokenfield in DOM.
	      html.container.tokenfield = this;
	      o.el.parentElement.insertBefore(html.container, o.el);
	      html.container.appendChild(o.el);

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
	        top: -100 + 'px',
	        left: -1000 + 'px',
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
	      var focus = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	      var v = this._vars;
	      var html = this._html;

	      html.input.value = '';
	      if (focus === true) {
	        this.focus();
	      }

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
	      var val = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	      var html = this._html;
	      var b = this._getBounds();
	      var style = window.getComputedStyle(html.container);
	      var compensate = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);

	      html.sizer.innerHTML = val;
	      html.input.style.width = '20px';

	      var sb = html.sizer.getBoundingClientRect();
	      var ib = html.input.getBoundingClientRect();
	      var rw = b.width - (ib.left - b.left) - compensate;

	      if (sb.width > rw) {
	        html.input.style.width = b.width - compensate + 'px';
	      } else {
	        html.input.style.width = rw + 'px';
	      }
	    }
	  }, {
	    key: '_fetchData',
	    value: function _fetchData(val) {
	      var _this = this;

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
	            var data = _this._prepareData(_this.remapData(response));
	            var items = _this._filterData(val, data);
	            v.suggestedItems = _this._filterSetItems(items);
	            _this.showSuggestions();
	          } else if (v.xhr.status > 0) {
	            throw new Error('Error while loading remote data.');
	          }
	          _this._abortXhr();
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
	      var _this2 = this;

	      return data.map(function (item) {
	        item[_this2.key] = guid();
	        return item;
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
	      var key = this.key;
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

	      html.container.addEventListener('click', v.events.onClick);

	      // Attach document event only once.
	      if (Object.keys(_tokenfields).length === 1) {
	        document.addEventListener('mousedown', v.events.onMouseDown);
	        document.addEventListener('touchstart', v.events.onMouseDown);
	        window.addEventListener('resize', v.events.onResize);
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
	      }
	    }
	  }, {
	    key: '_onFocus',
	    value: function _onFocus(e) {
	      var v = this._vars;
	      var html = this._html;
	      v.events.onKeyDown = this._onKeyDown.bind(this);
	      v.events.onFocusOut = this._onFocusOut.bind(this);

	      html.input.removeEventListener('keydown', v.events.onKeyDown);
	      html.input.addEventListener('keydown', v.events.onKeyDown);
	      html.input.addEventListener('focusout', v.events.onFocusOut);
	      this.focus();
	      if (html.input.value.trim().length >= this._options.minChars) {
	        this.showSuggestions();
	      }
	    }
	  }, {
	    key: '_onFocusOut',
	    value: function _onFocusOut(e) {
	      var v = this._vars;
	      var html = this._html;
	      html.input.removeEventListener('keydown', v.events.onKeyDown);
	      html.input.removeEventListener('focusout', v.events.onFocusOut);

	      if (!html.container.contains(e.target)) {
	        this.hideSuggestions();
	      }
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
	        for (var key in _tokenfields) {
	          if (key !== tokenfield.id) {
	            _tokenfields[key].hideSuggestions();
	            _tokenfields[key].blur();
	          }
	        }
	      } else {
	        for (var key in _tokenfields) {
	          _tokenfields[key].hideSuggestions();
	          _tokenfields[key].blur();
	        }
	      }
	    }
	  }, {
	    key: '_onResize',
	    value: function _onResize() {
	      this._resizeInput(this._html.input.value);
	    }
	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(e) {
	      var _this3 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      if (o.mode === 'tokenfield') {
	        setTimeout(function () {
	          _this3._resizeInput(html.input.value);
	        }, 1);
	      }

	      if (typeof v.keys[e.keyCode] !== 'undefined') {
	        this._keyAction(e);
	        return true;
	      } else {
	        this._defocusItems()._renderItems();
	      }

	      clearTimeout(v.timer);
	      this._abortXhr();

	      if (o.maxItems && v.setItems.length >= o.maxItems) {
	        e.preventDefault();
	      } else {
	        setTimeout(function () {
	          _this3._keyInput(e);
	        }, 1);
	      }
	    }
	  }, {
	    key: '_keyAction',
	    value: function _keyAction(e) {
	      var _this4 = this;

	      var item = null;
	      var v = this._vars;
	      var key = this.key;
	      var o = this._options;
	      var html = this._html;
	      var keyName = v.keys[e.keyCode];
	      var val = html.input.value.trim();

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
	            this._selectPrevItem();
	            e.preventDefault();
	          }
	          this._defocusItems()._renderItems();
	          break;
	        case 'down':
	          if (this._vars.suggested) {
	            this._selectNextItem();
	            e.preventDefault();
	          }
	          this._defocusItems()._renderItems();
	          break;
	        case 'left':
	          this._focusPrevItem();
	          break;
	        case 'right':
	          this._focusNextItem();
	          break;
	        case 'enter':
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
	            this._renderItems()._refreshInput(true).hideSuggestions();
	          }
	          e.preventDefault();
	          break;
	        case 'delete':
	          this._abortXhr();
	          if (val.length < o.minChars) {
	            this.hideSuggestions();
	            var focusedItem = this.getFocusedItem();
	            if (o.mode === 'tokenfield' && !val.length && v.setItems.length) {
	              if (focusedItem) {
	                this._removeItem(focusedItem[key]);
	              } else {
	                this._focusItem(v.setItems[v.setItems.length - 1][key]);
	              }
	            } else if (focusedItem) {
	              this._removeItem(focusedItem[key]);
	            }
	            this._renderItems()._refreshInput();
	          } else {
	            v.timer = setTimeout(function () {
	              _this4._keyInput(e);
	            }, o.delay);
	          }
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: '_keyInput',
	    value: function _keyInput(e) {
	      var _this5 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      this._defocusItems();

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
	            _this5._fetchData(val);
	          }, o.delay);
	        } else if (!o.remote.url && o.items.length) {
	          var data = this._prepareData(this.remapData(o.items));
	          var items = this._filterData(val, data);
	          v.suggestedItems = this._filterSetItems(items);
	          this.showSuggestions();
	        }
	      } else {
	        // Work with cached data.
	        var data = this._prepareData(this.remapData(v.cache[val]));
	        var items = this._filterData(val, data);
	        v.suggestedItems = this._filterSetItems(items);
	        this.showSuggestions();
	      }
	    }
	  }, {
	    key: '_onClick',
	    value: function _onClick(e) {
	      var target = e.target;
	      if (target.classList.contains('item-remove')) {
	        var item = this._getItem(target.key);
	        this._removeItem(target.key)._renderItems().focus();
	      } else if (target.classList.contains('tokenfield-suggest-item')) {
	        var item = this._getSuggestedItem(target.key);
	        this._addItem(item)._renderItems()._refreshInput(true).hideSuggestions();
	      } else {
	        this.focus();
	        this._keyInput(e);
	      }
	    }
	  }, {
	    key: '_selectPrevItem',
	    value: function _selectPrevItem() {
	      var key = this.key;
	      var items = this._vars.suggestedItems;
	      var index = this._getSelectedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === 0) {
	          this._selectItem(items[items.length - 1][key]);
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
	      var items = this._vars.suggestedItems;
	      var index = this._getSelectedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === items.length - 1) {
	          this._selectItem(items[0][key]);
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
	      var key = this.key;
	      var items = this._vars.setItems;
	      var index = this._getFocusedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === 0) {
	          this._defocusItems();
	        } else {
	          this._focusItem(items[index - 1][key]);
	        }
	      } else {
	        this._focusItem(items[items.length - 1][key]);
	      }
	      this._renderItems();

	      return this;
	    }
	  }, {
	    key: '_focusNextItem',
	    value: function _focusNextItem() {
	      var key = this.key;
	      var items = this._vars.setItems;
	      var index = this._getFocusedItemIndex();

	      if (!items.length) {
	        return this;
	      }

	      if (index !== null) {
	        if (index === items.length - 1) {
	          this._defocusItems();
	        } else {
	          this._focusItem(items[index + 1][key]);
	        }
	      } else {
	        this._focusItem(items[0][key]);
	      }
	      this._renderItems();

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
	      var _this6 = this;

	      this._vars.suggestedItems.forEach(function (v) {
	        v.selected = v[_this6.key] === key;
	        if (v.el) {
	          if (v.selected) {
	            v.el.classList.add('selected');
	          } else {
	            v.el.classList.remove('selected');
	          }
	        }
	      });
	    }
	  }, {
	    key: '_deselectItem',
	    value: function _deselectItem(key) {
	      var _this7 = this;

	      this._vars.suggestedItems.every(function (v) {
	        if (v[_this7.key] === key) {
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
	      this._vars.suggestedItems.every(function (v) {
	        v.selected = false;
	      });
	      return this;
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
	      var index = null;
	      this._vars.setItems.every(function (v, k) {
	        if (v.focused) {
	          index = k;
	          return false;
	        }
	        return true;
	      });
	      return index;
	    }
	  }, {
	    key: '_getItem',
	    value: function _getItem(val) {
	      var prop = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      if (prop === null) {
	        prop = this.key;
	      }
	      var items = this._vars.setItems.filter(function (v) {
	        return v[prop] === val;
	      });
	      return items.length ? items[0] : null;
	    }
	  }, {
	    key: '_getSuggestedItem',
	    value: function _getSuggestedItem(key) {
	      var _this8 = this;

	      var items = this._vars.suggestedItems.filter(function (v) {
	        return v[_this8.key] === key;
	      });
	      return items.length ? items[0] : null;
	    }
	  }, {
	    key: '_removeItem',
	    value: function _removeItem(key) {
	      var _this9 = this;

	      this._vars.setItems.every(function (item, k) {
	        if (item[_this9.key] === key) {
	          _this9.emit('removeToken', _this9, item);
	          _this9._vars.setItems.splice(k, 1);
	          _this9.emit('removedToken', _this9);
	          _this9.emit('change', _this9);
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
	          this._vars.setItems.push(item);
	          this.emit('addedToken', this, item);
	          this.emit('change', this);
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'getFocusedItem',
	    value: function getFocusedItem() {
	      var item = null;
	      this._vars.setItems.every(function (v) {
	        if (v.focused) {
	          item = v;
	          return false;
	        }
	        return true;
	      });
	      return item;
	    }
	  }, {
	    key: '_focusItem',
	    value: function _focusItem(key) {
	      var _this10 = this;

	      this._vars.setItems.forEach(function (v) {
	        v.focused = v[_this10.key] === key;
	      });
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
	      var o = this._options;
	      var item = this._getItem(value, o.itemData);
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
	      var _this11 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      html.items.innerHTML = '';
	      if (v.setItems.length) {
	        v.setItems.forEach(function (item) {
	          var itemEl = _this11._renderItem(item);
	          html.items.appendChild(itemEl);
	          item.el = itemEl;
	          if (item.focused) {
	            item.el.classList.add('focused');
	          } else {
	            item.el.classList.remove('focused');
	          }
	        });
	      }

	      if (v.setItems.length > 1 && o.mode === 'tokenfield') {
	        html.input.setAttribute('placeholder', '');
	      }

	      return this;
	    }
	  }, {
	    key: '_renderItem',
	    value: function _renderItem(item) {
	      var o = this._options;

	      var itemHtml = this.renderSetItemHtml(item);
	      var label = itemHtml.querySelector('.item-label');
	      var input = itemHtml.querySelector('.item-input');
	      var remove = itemHtml.querySelector('.item-remove');

	      remove.key = item[this.key];
	      input.setAttribute('name', (item.isNew ? o.newItemName : o.itemName) + '[]');

	      input.value = item[item.isNew ? o.newitemValue : o.itemValue] || null;
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
	      var _this12 = this;

	      var v = this._vars;
	      var o = this._options;
	      var html = this._html;

	      html.suggestList.innerHTML = '';

	      if (!v.suggestedItems.length) {
	        return this;
	      }

	      items.every(function (item, k) {
	        if (k >= o.maxSuggest) return false;

	        var el = _this12.renderSuggestedItem(item, k);
	        item.el = el;
	        html.suggestList.appendChild(el);
	        return true;
	      });

	      return this;
	    }
	  }, {
	    key: 'renderSuggestedItem',
	    value: function renderSuggestedItem(item, k) {
	      var o = this._options;
	      var el = this._buildEl(this._templates.suggestItem);
	      el.key = item[this.key];
	      el.innerHTML = item[o.itemData];
	      el.setAttribute('title', item[o.itemData]);

	      if (k === 0) {
	        item.selected = true;
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
	      var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	      this._vars.setItems = items;
	      this._refreshInput(true);
	      this.hideSuggestions()._renderItems();
	      this.emit('change', this);
	      return this;
	    }
	  }, {
	    key: 'emptyItems',
	    value: function emptyItems() {
	      this._vars.setItems = [];
	      this._refreshInput(true);
	      this.hideSuggestions()._renderItems();
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

	      delete _tokenfields[this.id];
	      delete this.el.tokenfield;
	    }
	  }]);

	  return Tokenfield;
	})(_events2['default']);

	exports['default'] = Tokenfield;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ }
/******/ ]);