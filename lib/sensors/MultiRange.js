import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
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
		_this.urlParams = helper.URLParams.get(_this.props.componentId, true);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.resetState = _this.resetState.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	MultiRange.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	};

	MultiRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.checkDefault(nextProps);
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
		this.urlParams = helper.URLParams.get(props.componentId, true);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	};

	MultiRange.prototype.changeValue = function changeValue(defaultValue) {
		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (defaultValue) {
				this.resetState();
				var records = this.props.data.filter(function (record) {
					return defaultValue.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records), 1000);
				}
			} else {
				this.handleChange(null);
			}
		}
	};

	// set the query type and input data


	MultiRange.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "MultiRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	MultiRange.prototype.customQuery = function customQuery(record) {
		function generateRangeQuery(appbaseField) {
			if (record.length > 0) {
				return record.map(function (singleRecord) {
					var _range;

					return {
						range: (_range = {}, _range[appbaseField] = {
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
					should: generateRangeQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	};

	// handle the input change and pass the value inside sensor info


	MultiRange.prototype.handleChange = function handleChange(record) {
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

		// pass the selected sensor value with componentId as key,
		var isExecuteQuery = true;
		if (this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.URLParams.update(this.props.componentId, this.getSelectedLabels(selected), this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	};

	MultiRange.prototype.getSelectedLabels = function getSelectedLabels(selected) {
		return selected ? selected.map(function (item) {
			return item.label;
		}) : null;
	};

	MultiRange.prototype.resetState = function resetState() {
		this.setState({
			selected: []
		});
		var obj = {
			key: this.props.componentId,
			value: []
		};
		// pass the selected sensor value with componentId as key,
		var isExecuteQuery = true;
		helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	};

	MultiRange.prototype.renderButtons = function renderButtons() {
		var _this3 = this;

		var buttons = void 0;
		var selectedText = this.state.selected ? this.state.selected.map(function (record) {
			return record.label;
		}) : "";
		if (this.props.data) {
			buttons = this.props.data.map(function (record) {
				var cx = classNames({
					"rbc-checkbox-active": _this3.props.showCheckbox,
					"rbc-checkbox-inactive": !_this3.props.showCheckbox,
					"rbc-list-item-active": selectedText.indexOf(record.label) !== -1,
					"rbc-list-item-inactive": selectedText.indexOf(record.label) === -1
				});

				return React.createElement(
					"div",
					{ className: "rbc-list-item row " + cx, key: record.label, onClick: function onClick() {
							return _this3.handleChange(record);
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
		});

		return React.createElement(
			"div",
			{ className: "rbc rbc-multirange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
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
	appbaseField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	showCheckbox: React.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showCheckbox: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

MultiRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	showCheckbox: TYPES.BOOLEAN
};