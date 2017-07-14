function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
var helper = require("../middleware/helper.js");

var Pagination = function (_Component) {
	_inherits(Pagination, _Component);

	function Pagination(props, context) {
		_classCallCheck(this, Pagination);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			currentValue: 1,
			maxPageNumber: 1
		};
		_this.handleChange = _this.handleChange.bind(_this);
		_this.prePage = _this.prePage.bind(_this);
		_this.nextPage = _this.nextPage.bind(_this);
		_this.firstPage = _this.firstPage.bind(_this);
		_this.lastPage = _this.lastPage.bind(_this);
		return _this;
	}

	// Set query information


	Pagination.prototype.componentDidMount = function componentDidMount() {
		this.setQueryInfo();
		this.listenGlobal();
	};

	// stop streaming request and remove listener when component will unmount


	Pagination.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.globalListener) {
			this.globalListener.remove();
		}
	};

	// set the query type and input data


	Pagination.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: this.state.currentValue
		};
		helper.selectedSensor.setPaginationInfo(obj);
	};

	// listen all results


	Pagination.prototype.listenGlobal = function listenGlobal() {
		var _this2 = this;

		this.globalListener = manager.emitter.addListener("global", function (res) {
			if (res.react && Object.keys(res.react).indexOf(_this2.props.componentId) > -1) {
				var totalHits = res.channelResponse && res.channelResponse.data && res.channelResponse.data.hits ? res.channelResponse.data.hits.total : 0;
				var maxPageNumber = Math.ceil(totalHits / res.queryOptions.size) < 1 ? 1 : Math.ceil(totalHits / res.queryOptions.size);
				var size = res.queryOptions.size ? res.queryOptions.size : 20;
				var currentPage = Math.floor(res.queryOptions.from / size) + 1;
				if (currentPage > maxPageNumber) {
					_this2.handleChange(1);
				} else {
					_this2.setState({
						totalHits: totalHits,
						size: size,
						maxPageNumber: maxPageNumber,
						currentValue: currentPage
					});
				}
			}
		});
	};

	// handle the input change and pass the value inside sensor info


	Pagination.prototype.handleChange = function handleChange(inputVal) {
		this.setState({
			currentValue: inputVal
		});
		var obj = {
			key: this.props.componentId,
			value: inputVal
		};

		// pass the selected sensor value with componentId as key,
		var isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery, "paginationChange");
		if (this.props.onPageChange) {
			this.props.onPageChange(inputVal);
		}
	};

	// first page


	Pagination.prototype.firstPage = function firstPage() {
		if (this.state.currentValue !== 1) {
			this.handleChange.call(this, 1);
		}
	};

	// last page


	Pagination.prototype.lastPage = function lastPage() {
		if (this.state.currentValue !== this.state.maxPageNumber) {
			this.handleChange.call(this, this.state.maxPageNumber);
		}
	};

	// pre page


	Pagination.prototype.prePage = function prePage() {
		var currentValue = this.state.currentValue > 1 ? this.state.currentValue - 1 : 1;
		if (this.state.currentValue !== currentValue) {
			this.handleChange.call(this, currentValue);
		}
	};

	// next page


	Pagination.prototype.nextPage = function nextPage() {
		var currentValue = this.state.currentValue < this.state.maxPageNumber ? this.state.currentValue + 1 : this.state.maxPageNumber;
		if (this.state.currentValue !== currentValue) {
			this.handleChange.call(this, currentValue);
		}
	};

	Pagination.prototype.getStart = function getStart() {
		var midValue = parseInt(this.props.pages / 2, 10);
		var start = this.state.currentValue - midValue;
		return start > 1 ? start : 1;
	};

	Pagination.prototype.renderPageNumber = function renderPageNumber() {
		var _this3 = this;

		var start = this.getStart(),
		    numbers = [];

		var _loop = function _loop(i) {
			var singleItem = React.createElement(
				"li",
				{ key: i, className: "rbc-page-number " + (_this3.state.currentValue === i ? "active rbc-pagination-active" : "waves-effect") },
				React.createElement(
					"a",
					{ onClick: function onClick() {
							return _this3.handleChange(i);
						} },
					i
				)
			);
			if (i <= _this3.state.maxPageNumber) {
				numbers.push(singleItem);
			}
		};

		for (var i = start; i < start + this.props.pages; i++) {
			_loop(i);
		}
		return React.createElement(
			"ul",
			{ className: "pagination" },
			React.createElement(
				"li",
				{ className: this.state.currentValue === 1 ? "disabled" : "waves-effect" },
				React.createElement(
					"a",
					{ className: "rbc-page-previous", onClick: this.prePage },
					React.createElement("i", { className: "fa fa-angle-left" })
				)
			),
			start !== 1 ? React.createElement(
				"li",
				{ className: "rbc-page-one " + (this.state.currentValue === 1 ? "disabled" : "waves-effect") },
				React.createElement(
					"a",
					{ className: "rbc-page-previous", onClick: this.firstPage },
					"1"
				)
			) : null,
			numbers,
			React.createElement(
				"li",
				{ className: this.state.currentValue === this.state.maxPageNumber ? "disabled" : "waves-effect" },
				React.createElement(
					"a",
					{ className: "rbc-page-next", onClick: this.nextPage },
					React.createElement("i", { className: "fa fa-angle-right" })
				)
			)
		);
	};

	// render


	Pagination.prototype.render = function render() {
		var title = null;
		var titleExists = false;
		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}

		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title
		});

		return React.createElement(
			"div",
			{ className: "rbc rbc-pagination col s12 col-xs-12 " + cx + " " + this.props.className },
			title,
			React.createElement(
				"div",
				{ className: "col s12 col-xs-12" },
				this.renderPageNumber()
			)
		);
	};

	return Pagination;
}(Component);

export default Pagination;


Pagination.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	onPageChange: React.PropTypes.func,
	pages: helper.pagesValidation
};

// Default props value
Pagination.defaultProps = {
	pages: 10
};

// context type
Pagination.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};