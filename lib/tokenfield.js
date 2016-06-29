/**
 * Input field with tagging/token/chip capabilities written in raw JavaScript
 * tokenfield 0.3.2 <https://github.com/KaneCohen/tokenfield>
 * Copyright 2016 Kane Cohen <https://github.com/KaneCohen>
 * Available under BSD-3-Clause license
 */
import EventEmitter from 'events';

let _tokenfields = {};

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

const _factory = document.createElement('div');

const _templates = {
  containerTokenfield: `<div class="tokenfield tokenfield-mode-tokens">
      <div class="tokenfield-set">
        <ul></ul>
      </div>
      <input class="tokenfield-input" />
      <div class="tokenfield-suggest">
        <ul class="tokenfield-suggest-list"></ul>
      </div>
    </div>`,
  containerList: `<div class="tokenfield tokenfield-mode-list">
      <input class="tokenfield-input" />
      <div class="tokenfield-suggest">
        <ul class="tokenfield-suggest-list"></ul>
      </div>
      <div class="tokenfield-set">
        <ul></ul>
      </div>
    </div>`,
  suggestItem: `<li class="tokenfield-suggest-item"></li>`,
  setItem: `<li class="tokenfield-set-item">
      <span class="item-label"></span>
      <span class="item-remove">×</span>
      <input class="item-input" type="hidden" />
    </li>`
};

function guid() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16) +
    (((1 + Math.random()) * 0x10000) | 0).toString(16);
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
  let result = (value + '');
  return (result === '0' && (1 / value) === -Infinity) ? '-0' : result;
}

function escapeRegex(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string)) ?
    string.replace(reRegExpChar, '\\$&') :
    string;
}

function ajax(params, options = {}, callback = null) {
  let xhr = new XMLHttpRequest();
  let url = options.url;
  let paramsArr = [];
  for (let key in params) {
    paramsArr.push(`${key}=${params[key]}`);
  }

  let paramsString = paramsArr.join('&');
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
  const _defaults = {
    keys : {
      8:   'delete', // backspace
      9:   'enter',  // tab
      13:  'enter',  // normal enter
      27:  'esc',
      37:  'left',
      38:  'up',
      39:  'right',
      40:  'down',
      46:  'delete',
      108: 'enter'    // numpad enter
    },
    focusedItem: null,
    cache: {},
    timer: null,
    xhr: null,
    suggested: false,
    suggestedItems: [],
    setItems:    [],
    events: {}
  };

  const _options = {
    el: null,
    mode: 'tokenfield',       // Display mode: tokenfield or list
    setItems: [],             // List of set items.
    items: [],                // List of available items to work with.
                              // Example: [{id: 143, value: 'Hello World'}, {id: 144, value: 'Foo Bar'}].
    newItems: true,           // Allow input (on enter) of new items.
    multiple: true,           // Accept multiple tags per field.
    maxItems: 0,              // Set maximum allowed number of items.
    remote: {
      type: 'GET',            // Ajax request type.
      url: null,              // Full server url.
      queryParam: 'q',        // What param to use when asking server for data.
      delay: 300,             // Dealy between last keydown event and ajax request for data.
      timestampParam: 't',
      params: {}
    },
    placeholder: null,        // Hardcoded placeholder text. If not set, will use placeholder from the element itself.
    minChars: 2,              // Number of characters before we start to look for similar items.
    maxSuggest: 10,           // Max items in the suggest box.
    itemLabel: 'name',        // Property to use in order to render item label.
    itemName: 'items',        // If set, for each tag/token there will be added
                              // input field with array property name:
                              // name="items[]".

    newItemName: 'items_new', // Suffix that will be added to the new tag in
                              // case it was not available from the server:
                              // name="items_new[]".

    itemValue: 'id',         // Value that will be taken out of the results and inserted into itemAttr.
    newItemValue: 'name',    // Value that will be taken out of the results and inserted into itemAttr.
    itemData: 'name'         // Which property to search for.
  };
  return {_defaults, _options};
}

class Tokenfield extends EventEmitter {
  constructor(options = {}) {
    super();

    let { _defaults, _options } = makeDefaultsAndOptions();

    this.id = guid();
    this.key = `key_${this.id}`;
    this._vars = Object.assign({}, _defaults);
    this._options = Object.assign({}, _options, options);
    this._options.remote = Object.assign({}, _options.remote, options.remote);
    this._templates = Object.assign({}, _templates, options.templates);
    this._vars.setItems = this._options.setItems || [];
    this._html = {};

    let o = this._options;

    if (o.el) {
      let el = o.el;
      if (typeof el == 'string') {
        el = document.querySelector(o.el);
        if (! el) {
          throw new Error(`Selector: DOM Element ${o.el} not found.`);
        }
      }
      el.tokenfield = this;
      this.el = el;
    } else {
      throw new Error(`Cannot create tokenfield without DOM Element.`);
    }

    if (o.placeholder === null) {
      o.placeholder = o.el.placeholder || '';
    }

    _tokenfields[this.id] = this;

    this._render();
  }

  _render() {
    let o = this._options;
    let html = this._html;

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

  _renderSizer() {
    let html = this._html;
    let b = this._getBounds();
    let style = window.getComputedStyle(html.container);
    let compensate = parseInt(style.paddingLeft, 10) +
      parseInt(style.paddingRight, 10);

    let styles = {
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
    for (let key in styles) {
      html.sizer.style[key] = styles[key];
    }
    html.container.appendChild(html.sizer);
  }

  _refreshInput(focus = false) {
    let v = this._vars;
    let html = this._html;

    html.input.value = '';
    if (focus === true) {
      this.focus();
    }

    if (this._options.mode === 'tokenfield') {
      this._resizeInput();
      let placeholder =  v.setItems.length ? '' : this._options.placeholder;
      html.input.setAttribute('placeholder', placeholder);
    }
    return this;
  }

  _resizeInput(val = '') {
    let html = this._html;
    let b = this._getBounds();
    let style = window.getComputedStyle(html.container);
    let compensate = parseInt(style.paddingLeft, 10) +
      parseInt(style.paddingRight, 10);

    html.sizer.innerHTML = val;
    html.input.style.width = '20px';

    let sb = html.sizer.getBoundingClientRect();
    let ib = html.input.getBoundingClientRect();
    let rw = b.width - (ib.left - b.left) - compensate;

    if (sb.width > rw) {
      html.input.style.width = b.width - compensate + 'px';
    } else {
      html.input.style.width = rw + 'px';
    }
  }

  _fetchData(val) {
    let v = this._vars;
    let o = this._options;
    let r = o.remote;
    let reqData = Object.assign({}, o.params);

    for (let key in r.params) {
      reqData[key] = r.params[key];
    }

    if (r.limit) {
      reqData[r.limit] = o.remote.limit;
    }

    reqData[r.queryParam] = val;
    reqData[r.timestampParam] = Math.round((new Date()).getTime() / 1000);

    v.xhr = ajax(reqData, o.remote, () => {
      if(v.xhr.readyState == 4) {
        if(v.xhr.status == 200) {
          let response = JSON.parse(v.xhr.responseText);
          v.cache[val] = response;
          let data = this._prepareData(this.remapData(response));
          let items = this._filterData(val, data);
          v.suggestedItems = this._filterSetItems(items);
          this.showSuggestions();
        } else if (v.xhr.status > 0) {
          throw new Error('Error while loading remote data.');
        }
        this._abortXhr();
      }
    });
  }

  // Overwriteable method where you can change given data to appropriate format.
  remapData(data) {
    return data;
  }

  _prepareData(data) {
    return data.map(item => {
      item[this.key] = guid();
      return item;
    });
  }

  _filterData(val, data) {
    let o = this._options;
    let patt = new RegExp(escapeRegex(val), 'i');
    return data.filter(item => patt.test(item[o.itemData]));
  }

  _abortXhr() {
    let v = this._vars;
    if (v.xhr !== null) {
      v.xhr.abort();
      v.xhr = null;
    }
  }

  _filterSetItems(items) {
    const key = this.key;
    let v = this._vars;
    if (! v.setItems.length) return items;

    let setKeys = v.setItems.map(item => item[key]);

    return items.filter(item => {
      if (setKeys.indexOf(item[key]) === -1) {
        return true;
      }
      return false;
    });
  }

  _setEvents() {
    let v = this._vars;
    let html = this._html;
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

  _onMouseOver(e) {
    let target = e.target;
    if (target.classList.contains('tokenfield-suggest-item')) {
      let selected = this._html.suggestList.querySelectorAll('.selected');
      Array.prototype.forEach.call(selected, item => {
        if (item !== target) item.classList.remove('selected');
      });
      target.classList.add('selected');
      this._selectItem(target.key);
    }
  }

  _onFocus(e) {
    let v = this._vars;
    let html = this._html;
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

  _onFocusOut(e) {
    let v = this._vars;
    let html = this._html;
    html.input.removeEventListener('keydown', v.events.onKeyDown);
    html.input.removeEventListener('focusout', v.events.onFocusOut);

    if (! html.container.contains(e.target)) {
      this.hideSuggestions();
    }
  }

  _onMouseDown(e) {
    let tokenfield = null;
    for (let key in _tokenfields) {
      if (_tokenfields[key]._html.container.contains(e.target)) {
        tokenfield = _tokenfields[key];
        break;
      }
    }

    if (tokenfield) {
      for (let key in _tokenfields) {
        if (key !== tokenfield.id) {
          _tokenfields[key].hideSuggestions();
          _tokenfields[key].blur();
        }
      }
    } else {
      for (let key in _tokenfields) {
        _tokenfields[key].hideSuggestions();
        _tokenfields[key].blur();
      }
    }
  }

  _onResize() {
    this._resizeInput(this._html.input.value);
  }

  _onKeyDown(e) {
    let v = this._vars;
    let o = this._options;
    let html = this._html;

    if (o.mode === 'tokenfield') {
      setTimeout(() => {
        this._resizeInput(html.input.value);
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
      setTimeout(() => {
        this._keyInput(e);
      }, 1);
    }
  }

  _keyAction(e) {
    let item = null;
    let v = this._vars;
    const key = this.key;
    let o = this._options;
    let html = this._html;
    let keyName = v.keys[e.keyCode];
    let val = html.input.value.trim();

    let selected = this._getSelectedItems();
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

        if (v.setItems.length == 1 && ! o.multiple) {
          return false;
        }

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
          let focusedItem = this.getFocusedItem();
          if (o.mode === 'tokenfield' && ! val.length && v.setItems.length) {
            if (focusedItem) {
              this._removeItem(focusedItem[key]);
            } else {
              this._focusItem(v.setItems[v.setItems.length - 1][key]);
            }
          } else  if (focusedItem) {
            this._removeItem(focusedItem[key]);
          }
          this._renderItems()._refreshInput();
        } else {
          v.timer = setTimeout(() => {
            this._keyInput(e);
          }, o.delay);
        }
        break;
      default:
        break;
    }
  }

  _keyInput(e) {
    let v = this._vars;
    let o = this._options;
    let html = this._html;

    this._defocusItems();

    // We've got an input to deal with.
    var val = html.input.value;
    if (val.length < o.minChars) {
      this.hideSuggestions();
      return false;
    }
    if (v.setItems.length == 1 && ! o.multiple) {
      return false;
    }

    // Check if we have cache with this val.
    if (typeof v.cache[val] === 'undefined') {
      // Get new data.
      if (o.remote.url) {
        v.timer = setTimeout(() => {
          this._fetchData(val);
        }, o.delay);
      } else if (! o.remote.url && o.items.length) {
        let data = this._prepareData(this.remapData(o.items));
        let items = this._filterData(val, data);
        v.suggestedItems = this._filterSetItems(items);
        this.showSuggestions();
      }
    } else {
      // Work with cached data.
      let data = this._prepareData(this.remapData(v.cache[val]));
      let items = this._filterData(val, data);
      v.suggestedItems = this._filterSetItems(items);
      this.showSuggestions();
    }
  }

  _onClick(e) {
    let target = e.target;
    if (target.classList.contains('item-remove')) {
      let item = this._getItem(target.key);
      this._removeItem(target.key)
        ._renderItems()
        .focus();
    } else if (target.classList.contains('tokenfield-suggest-item')) {
      let item = this._getSuggestedItem(target.key);
      this._addItem(item)
        ._renderItems()
        ._refreshInput(true)
        .hideSuggestions();
    } else {
      this.focus();
      this._keyInput(e);
    }
  }

  _selectPrevItem() {
    const key = this.key;
    let items = this._vars.suggestedItems;
    let index = this._getSelectedItemIndex();

    if (! items.length) {
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

  _selectNextItem() {
    const key = this.key;
    let items = this._vars.suggestedItems;
    let index = this._getSelectedItemIndex();

    if (! items.length) {
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

  _focusPrevItem() {
    const key = this.key;
    let items = this._vars.setItems;
    let index = this._getFocusedItemIndex();

    if (! items.length) {
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

  _focusNextItem() {
    const key = this.key;
    let items = this._vars.setItems;
    let index = this._getFocusedItemIndex();

    if (! items.length) {
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

  _getSelectedItems() {
    const key = this.key;
    let setIds = this._vars.setItems.map(item => item[key]);
    return this._vars.suggestedItems.filter(v => {
      return v.selected && setIds.indexOf(v[key]) < 0;
    });
  }

  _selectItem(key) {
    this._vars.suggestedItems.forEach(v => {
      v.selected = v[this.key] === key;
      if (v.el) {
        if (v.selected) {
          v.el.classList.add('selected');
        } else {
          v.el.classList.remove('selected');
        }
      }
    });
  }

  _deselectItem(key) {
    this._vars.suggestedItems.every(v => {
      if (v[this.key] === key) {
        v.selected = false;
        return false;
      }
      return true;
    });
    return this;
  }

  _deselectItems() {
    this._vars.suggestedItems.every(v => {
      v.selected = false;
    });
    return this;
  }

  _getSelectedItemIndex() {
    let index = null;
    this._vars.suggestedItems.every((v, k) => {
      if (v.selected) {
        index = k;
        return false;
      }
      return true;
    });
    return index;
  }

  _getFocusedItemIndex() {
    let index = null;
    this._vars.setItems.every((v, k) => {
      if (v.focused) {
        index = k;
        return false;
      }
      return true;
    });
    return index;
  }

  _getItem(val, prop = null) {
    if (prop === null) {
      prop = this.key;
    }
    let items = this._vars.setItems.filter(v => v[prop] === val);
    return items.length ? items[0] : null;
  }

  _getSuggestedItem(key) {
    let items = this._vars.suggestedItems.filter(v => v[this.key] === key);
    return items.length ? items[0] : null;
  }

  _removeItem(key) {
    this._vars.setItems.every((item, k) => {
      if (item[this.key] === key) {
        this.emit('removeToken', this, item);
        this._vars.setItems.splice(k, 1);
        this.emit('removedToken', this);
        this.emit('change', this);
        return false;
      }
      return true;
    });
    return this;
  }

  _addItem(item) {
    item.focused = false;
    if (! this._getItem(item[this.key])) {
      this.emit('addToken', this, item);
      if (! this._options.maxItems || (this._options.maxItems &&
        this._vars.setItems.length < this._options.maxItems)
      ) {
        this._vars.setItems.push(item);
        this.emit('addedToken', this, item);
        this.emit('change', this);
      }
    }
    return this;
  }

  getFocusedItem() {
    let item = null;
    this._vars.setItems.every(v => {
      if (v.focused) {
        item = v;
        return false;
      }
      return true;
    });
    return item;
  }

  _focusItem(key) {
    this._vars.setItems.forEach(v => {
      v.focused = v[this.key] === key;
    });
    return this;
  }

  _defocusItems() {
    this._vars.setItems.forEach(item => {
      item.focused = false;
    });
    return this;
  }
  
  evaluateValue(value) {
  	return value;
  }

  _newItem(value) {
    let o = this._options;
    let item = this._getItem(this.evaluateValue(value), o.itemData);
    if (! item && o.newItems) {
      item = {
        isNew: true,
        [this.key]: guid(),
        [o.itemData]: this.evaluateValue(value).trim()
      };
      this.emit('newToken', this, item);
    }
    if (item) {
      this._addItem(item);
      return item;
    }
    return null;
  }

  // Wrapper for build function in case some of the functions are overwritten.
  _buildEl(html) {
    return build(html);
  }

  _getBounds() {
    return this._html.container.getBoundingClientRect();
  }

  _renderItems() {
    let v = this._vars;
    let o = this._options;
    let html = this._html;

    html.items.innerHTML = '';
    if (v.setItems.length) {
      v.setItems.forEach(item => {
        let itemEl = this._renderItem(item);
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

  _renderItem(item) {
    let o = this._options;

    let itemHtml = this.renderSetItemHtml(item);
    let label = itemHtml.querySelector('.item-label');
    let input = itemHtml.querySelector('.item-input');
    let remove = itemHtml.querySelector('.item-remove');

    remove.key = item[this.key];
    input.setAttribute('name', (item.isNew ? o.newItemName : o.itemName) + '[]');

    input.value = item[(item.isNew ? o.newitemValue : o.itemValue)] || null;
    label.textContent = this.renderSetItemLabel(item);
    if (item.focused) {
      itemHtml.classList.add('focused');
    }

    return itemHtml;
  }

  renderSetItemHtml() {
    return this._buildEl(this._templates.setItem);
  }

  renderSetItemLabel(item) {
    return item[this._options.itemLabel];
  }

  renderSuggestions(items) {
    let v = this._vars;
    let o = this._options;
    let html = this._html;

    html.suggestList.innerHTML = '';

    if (! v.suggestedItems.length) {
      return this;
    }

    items.every((item, k) => {
      if (k >= o.maxSuggest) return false;

      let el = this.renderSuggestedItem(item, k);
      item.el = el;
      html.suggestList.appendChild(el);
      return true;
    });

    return this;
  }

  renderSuggestedItem(item, k) {
    let o = this._options;
    let el = this._buildEl(this._templates.suggestItem);
    el.key = item[this.key];
    el.innerHTML = item[o.itemData];
    el.setAttribute('title', item[o.itemData]);

    if (k === 0) {
      item.selected = true;
      el.classList.add('selected');
    }
    return el;
  }

  showSuggestions() {
    if (this._vars.suggestedItems.length) {
      this.emit('showSuggestions', this);
      if (! this._options.maxItems || (this._options.maxItems &&
        this._vars.setItems.length < this._options.maxItems)
      ) {
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

  hideSuggestions() {
    this.emit('hideSuggestions', this);
    this._vars.suggested = false;
    this._html.suggest.style.display = 'none';
    this._html.suggestList.innerHTML = '';
    this.emit('hiddenSuggestions', this);
    return this;
  }

  getItems() {
    return this._vars.setItems.map(item => {
      return Object.assign({}, item);
    });
  }

  setItems(items = []) {
    this._vars.setItems = items;
    this._refreshInput(true);
    this.hideSuggestions()._renderItems();
    this.emit('change', this);
    return this;
  }

  emptyItems() {
    this._vars.setItems = [];
    this._refreshInput(true);
    this.hideSuggestions()._renderItems();
    this.emit('change', this);
    return this;
  }

  focus() {
    this._html.container.classList.add('focused');
    this._html.input.focus();
    return this;
  }

  blur() {
    this._html.container.classList.remove('focused');
    this._html.input.blur();
    return this;
  }

  remove() {
    let html = this._html;

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
}

export default Tokenfield;
