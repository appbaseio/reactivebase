var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";

var ListItem = function (_Component) {
	_inherits(ListItem, _Component);

	function ListItem(props) {
		_classCallCheck(this, ListItem);

		var _this = _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).call(this, props));

		_this.state = {
			initialStatus: _this.props.status,
			status: _this.props.status || false
		};
		_this.handleCheckboxChange = _this.handleCheckboxChange.bind(_this);
		return _this;
	}

	_createClass(ListItem, [{
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			if (this.props.status !== this.state.initialStatus) {
				this.setState({
					status: this.props.status,
					initialStatus: this.props.status
				});
			}
		}
	}, {
		key: "handleClick",
		value: function handleClick() {
			this.setState({
				status: !this.state.status
			});
			this.props.handleClick(this.props.value, !this.state.status);
		}
	}, {
		key: "handleCheckboxChange",
		value: function handleCheckboxChange(event) {
			this.setState({
				status: event.target.checked
			});
		}
	}, {
		key: "render",
		value: function render() {
			var count = void 0;
			// Check if the user has set to display countField
			if (this.props.countField) {
				count = React.createElement(
					"span",
					{ className: "rbc-count" },
					" ",
					this.props.doc_count,
					" "
				);
			}
			var cx = classNames({
				"rbc-count-active": this.props.countField,
				"rbc-count-inactive": !this.props.countField
			});
			return React.createElement(
				"div",
				{ onClick: this.handleClick.bind(this), className: "rbc-list-item row " + cx },
				React.createElement("input", {
					type: "checkbox",
					className: "rbc-checkbox-item",
					checked: this.state.status,
					onChange: this.handleCheckboxChange
				}),
				React.createElement(
					"label",
					{ className: "rbc-label" },
					this.props.value,
					" ",
					count
				)
			);
		}
	}]);

	return ListItem;
}(Component);

export default ListItem;


ListItem.propTypes = {
	status: React.PropTypes.bool,
	handleClick: React.PropTypes.func,
	value: React.PropTypes.string,
	countField: React.PropTypes.bool,
	doc_count: React.PropTypes.number
};