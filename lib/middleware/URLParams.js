function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLSearchParams = require("url-search-params");

var RbcURLParams = function () {
	function RbcURLParams() {
		_classCallCheck(this, RbcURLParams);

		this.params = new URLSearchParams(window.location.search);
	}

	RbcURLParams.prototype.get = function get(componentId) {
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
	};

	RbcURLParams.prototype.update = function update(componentId, value) {
		var allowUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		if (allowUpdate) {
			this.setOrDelete(componentId, value);
			this.applyURLUpdate();
		}
	};

	RbcURLParams.prototype.setOrDelete = function setOrDelete(componentId, value) {
		if (componentId) {
			if (value === undefined || value === null || typeof value === "string" && value.trim() === "" || Array.isArray(value) && value.length === 0) {
				this.params.delete(componentId);
			} else {
				this.params.set(componentId, value);
			}
		}
	};

	RbcURLParams.prototype.applyURLUpdate = function applyURLUpdate() {
		if (history.pushState) {
			var paramsSting = this.params.toString() ? "?" + this.params.toString() : "";
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsSting;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	};

	return RbcURLParams;
}();

export var URLParams = new RbcURLParams();