function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";

var ListItem = function (_Component) {
	_inherits(ListItem, _Component);

	function ListItem(props) {
		_classCallCheck(this, ListItem);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			initialStatus: _this.props.status,
			status: _this.props.status || false
		};
		_this.handleCheckboxChange = _this.handleCheckboxChange.bind(_this);
		return _this;
	}

	ListItem.prototype.componentDidUpdate = function componentDidUpdate() {
		if (this.props.status !== this.state.initialStatus) {
			this.setState({
				status: this.props.status,
				initialStatus: this.props.status
			});
		}
	};

	ListItem.prototype.handleClick = function handleClick() {
		this.setState({
			status: !this.state.status
		});
		this.props.handleClick(this.props.value, !this.state.status);
	};

	ListItem.prototype.handleCheckboxChange = function handleCheckboxChange(event) {
		this.setState({
			status: event.target.checked
		});
	};

	ListItem.prototype.render = function render() {
		var count = void 0;
		if (this.props.countField) {
			count = React.createElement(
				"span",
				{ className: "rbc-count" },
				" ",
				this.props.doc_count,
				" "
			);
		}

		if (this.props.value.trim() === "" || !this.props.visible) {
			return null;
		}

		var cx = classNames({
			"rbc-count-active": this.props.countField,
			"rbc-count-inactive": !this.props.countField,
			"rbc-checkbox-active": this.props.showCheckbox,
			"rbc-checkbox-inactive": !this.props.showCheckbox,
			"rbc-list-item-active": this.state.status,
			"rbc-list-item-inactive": !this.state.status
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
	};

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