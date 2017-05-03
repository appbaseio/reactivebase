import _isEqual from "lodash/isEqual";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");

var MultiDropdownRange = function (_Component) {
	_inherits(MultiDropdownRange, _Component);

	function MultiDropdownRange(props) {
		_classCallCheck(this, MultiDropdownRange);

		var _this = _possibleConstructorReturn(this, (MultiDropdownRange.__proto__ || Object.getPrototypeOf(MultiDropdownRange)).call(this, props));

		_this.state = {
			selected: ""
		};
		_this.type = "range";
		_this.state.data = _this.props.data.map(function (item) {
			item.value = item.label;
			return item;
		});
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(MultiDropdownRange, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				var records = this.state.data.filter(function (record) {
					return _this2.defaultSelected.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records), 1000);
				}
			}
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this3 = this;

			setTimeout(function () {
				if (!_isEqual(_this3.defaultSelected, _this3.props.defaultSelected)) {
					_this3.defaultSelected = _this3.props.defaultSelected;
					var records = _this3.state.data.filter(function (record) {
						return _this3.defaultSelected.indexOf(record.label) > -1;
					});
					if (records && records.length) {
						setTimeout(_this3.handleChange.bind(_this3, records), 1000);
					}
				}
			}, 300);
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(record) {
			function generateRangeQuery(appbaseField) {
				if (record.length > 0) {
					return record.map(function (singleRecord) {
						return {
							range: _defineProperty({}, appbaseField, {
								gte: singleRecord.start,
								lte: singleRecord.end,
								boost: 2.0
							})
						};
					});
				}
			}

			if (record) {
				var query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						minimum_should_match: 1,
						boost: 1.0
					}
				};
				return query;
			}
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(record) {
			var selected = [];
			selected = record.map(function (item) {
				return item.label;
			});
			selected = selected.join();
			this.setState({
				selected: selected
			});
			var obj = {
				key: this.props.componentId,
				value: record
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var title = null;
			if (this.props.title) {
				title = React.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = classNames({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder
			});

			return React.createElement(
				"div",
				{ className: "rbc rbc-multidropdownrange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				React.createElement(
					"div",
					{ className: "row" },
					title,
					React.createElement(
						"div",
						{ className: "col s12 col-xs-12" },
						React.createElement(Select, {
							options: this.state.data,
							value: this.state.selected,
							onChange: this.handleChange,
							clearable: false,
							multi: true,
							placeholder: this.props.placeholder,
							searchable: true
						})
					)
				)
			);
		}
	}]);

	return MultiDropdownRange;
}(Component);

export default MultiDropdownRange;


MultiDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object
};

// Default props value
MultiDropdownRange.defaultProps = {};

// context type
MultiDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiDropdownRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};