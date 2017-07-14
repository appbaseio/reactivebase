function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { default as React, Component } from "react";

export var StaticSearch = function (_Component) {
	_inherits(StaticSearch, _Component);

	function StaticSearch(props) {
		_classCallCheck(this, StaticSearch);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			searchValue: ""
		};
		_this.handleChange = _this.handleChange.bind(_this);
		return _this;
	}

	StaticSearch.prototype.handleChange = function handleChange(event) {
		var _this2 = this;

		var value = event.target.value;
		this.setState({
			searchValue: value
		}, function () {
			_this2.props.changeCallback(_this2.state.searchValue);
		});
	};

	StaticSearch.prototype.render = function render() {
		return React.createElement(
			"div",
			{ className: "rbc-search-container col s12 col-xs-12" },
			React.createElement("input", {
				type: "text", className: "rbc-input col s12 col-xs-12 form-control",
				value: this.state.searchValue,
				placeholder: this.props.placeholder,
				onChange: this.handleChange
			})
		);
	};

	return StaticSearch;
}(Component);