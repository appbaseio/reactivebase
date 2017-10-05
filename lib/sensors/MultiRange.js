import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");

var MultiRange = function (_Component) {
	_inherits(MultiRange, _Component);

	function MultiRange(props) {
		_classCallCheck(this, MultiRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = "range";
		_this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, true) : null;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	MultiRange.prototype.componentWillMount = function componentWillMount() {
		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.listenFilter();
	};

	MultiRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault(nextProps);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected, true);
		}
	};

	MultiRange.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	MultiRange.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.changeValue(null);
			}
		});
	};

	MultiRange.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, true) : null;
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	};

	MultiRange.prototype.changeValue = function changeValue(defaultValue) {
		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (defaultValue) {
				var records = this.props.data.filter(function (record) {
					return defaultValue.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records, true), 1000);
				} else {
					// since no records match the selected state should be reset
					setTimeout(this.handleChange.bind(this, null, true), 1000);
				}
			} else {
				this.handleChange(null, true);
			}
		}
	};

	// set the query type and input data


	MultiRange.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this3 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = props.customQuery ? props.customQuery(value) : _this3.customQuery(value);
			if (_this3.props.onQueryChange && JSON.stringify(_this3.previousQuery) !== JSON.stringify(currentQuery)) {
				_this3.props.onQueryChange(_this3.previousQuery, currentQuery);
			}
			_this3.previousQuery = currentQuery;
			return currentQuery;
		};
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "MultiRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	MultiRange.prototype.customQuery = function customQuery(record) {
		function generateRangeQuery(dataField) {
			if (record.length > 0) {
				return record.map(function (singleRecord) {
					var _range;

					return {
						range: (_range = {}, _range[dataField] = {
							gte: singleRecord.start,
							lte: singleRecord.end,
							boost: 2.0
						}, _range)
					};
				});
			}
			return null;
		}

		if (record) {
			var query = {
				bool: {
					should: generateRangeQuery(this.props.dataField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	};

	// handle the input change and pass the value inside sensor info
	// setTrue adds all the matching records to state instead of toggling them


	MultiRange.prototype.handleChange = function handleChange(record) {
		var _this4 = this;

		var setTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var selected = this.state.selected;

		var selectedIndex = null;
		var records = record;

		function setRecord(selectedRecord, index, item) {
			if (item.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		}

		if (record) {
			if (selected === null) {
				selected = [];
			}
			if (!Array.isArray(record)) {
				records = [record];
			}
			if (setTrue) {
				// all matching records should be added to selected state
				selected = [];
				records.forEach(function (item) {
					if (_this4.props.data.some(function (label) {
						return label.label === item.label;
					})) {
						selected.push(item);
					}
				});
			} else {
				records.forEach(function (item) {
					selected.forEach(function (selectedRecord, index) {
						setRecord(selectedRecord, index, item);
					});
				});

				if (selectedIndex === null) {
					records.forEach(function (item) {
						selected.push(item);
					});
				}
			}
		} else {
			selected = null;
		}
		selected = selected === "" ? null : selected;
		selected = selected && selected.length ? selected : null;
		this.defaultSelected = selected;

		this.setState({
			selected: selected
		});

		var obj = {
			key: this.props.componentId,
			value: selected
		};

		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this4.props.onValueChange) {
				_this4.props.onValueChange(obj.value);
			}
			if (_this4.props.URLParams) {
				helper.URLParams.update(_this4.props.componentId, _this4.getSelectedLabels(selected), _this4.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this4.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	MultiRange.prototype.getSelectedLabels = function getSelectedLabels(selected) {
		return selected ? selected.map(function (item) {
			return item.label;
		}) : null;
	};

	MultiRange.prototype.renderButtons = function renderButtons() {
		var _this5 = this;

		var buttons = void 0;
		var selectedText = this.state.selected ? this.state.selected.map(function (record) {
			return record.label;
		}) : "";
		if (this.props.data) {
			buttons = this.props.data.map(function (record) {
				var cx = classNames({
					"rbc-checkbox-active": _this5.props.showCheckbox,
					"rbc-checkbox-inactive": !_this5.props.showCheckbox,
					"rbc-list-item-active": selectedText.indexOf(record.label) !== -1,
					"rbc-list-item-inactive": selectedText.indexOf(record.label) === -1
				});

				return React.createElement(
					"div",
					{ className: "rbc-list-item row " + cx, key: record.label, onClick: function onClick() {
							return _this5.handleChange(record);
						} },
					React.createElement("input", {
						type: "checkbox",
						className: "rbc-checkbox-item",
						checked: selectedText.indexOf(record.label) > -1,
						value: record.label
					}),
					React.createElement(
						"label",
						{ className: "rbc-label" },
						record.label
					)
				);
			});
		}
		return buttons;
	};

	// render


	MultiRange.prototype.render = function render() {
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
			"rbc-checkbox-active": this.props.showCheckbox,
			"rbc-checkbox-inactive": !this.props.showCheckbox
		}, this.props.className);

		return React.createElement(
			"div",
			{ className: "rbc rbc-multirange col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
			React.createElement(
				"div",
				{ className: "row" },
				title,
				React.createElement(
					"div",
					{ className: "col s12 col-xs-12 rbc-list-container" },
					this.renderButtons()
				)
			)
		);
	};

	return MultiRange;
}(Component);

export default MultiRange;


MultiRange.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	data: PropTypes.any.isRequired,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	defaultSelected: PropTypes.array,
	customQuery: PropTypes.func,
	beforeValueChange: PropTypes.func,
	onValueChange: PropTypes.func,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	onQueryChange: PropTypes.func,
	showCheckbox: PropTypes.bool,
	className: PropTypes.string
};

// Default props value
MultiRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showCheckbox: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

MultiRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION,
	showCheckbox: TYPES.BOOLEAN,
	className: TYPES.STRING
};