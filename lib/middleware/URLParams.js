"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.URLParams = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLSearchParams = require("url-search-params");

var RbcURLParams = function () {
	function RbcURLParams() {
		_classCallCheck(this, RbcURLParams);

		this.params = new URLSearchParams(window.location.search);
	}

	_createClass(RbcURLParams, [{
		key: "get",
		value: function get(componentId) {
			var multipleSelect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var jsonParse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var value = this.params.get(componentId);
			if (jsonParse && value) {
				try {
					value = JSON.parse(value);
				} catch (e) {
					console.log(e);
				}
			}
			return multipleSelect ? value && value.trim() ? value.split(",") : null : value;
		}
	}, {
		key: "update",
		value: function update(componentId, value) {
			var allowUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (allowUpdate) {
				this.setOrDelete(componentId, value);
				this.applyURLUpdate();
			}
		}
	}, {
		key: "setOrDelete",
		value: function setOrDelete(componentId, value) {
			if (componentId) {
				if (value === null || value === undefined) {
					this.params.delete(componentId);
				} else {
					this.params.set(componentId, value);
				}
			}
		}
	}, {
		key: "applyURLUpdate",
		value: function applyURLUpdate() {
			if (history.pushState) {
				var paramsSting = this.params.toString() ? "?" + this.params.toString() : "";
				var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsSting;
				window.history.pushState({ path: newurl }, '', newurl);
			}
		}
	}]);

	return RbcURLParams;
}();

var URLParams = exports.URLParams = new RbcURLParams();