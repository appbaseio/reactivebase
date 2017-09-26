import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
var helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

var ToggleButton = function (_Component) {
	_inherits(ToggleButton, _Component);

	function ToggleButton(props, context) {
		_classCallCheck(this, ToggleButton);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = "term";
		_this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, true) : null;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	ToggleButton.prototype.componentWillMount = function componentWillMount() {
		var _this2 = this;

		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		setTimeout(function () {
			_this2.checkDefault(_this2.props);
		}, 100);
		this.listenFilter();
	};

	ToggleButton.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (nextProps.multiSelect) {
			if (nextProps.defaultSelected !== null && nextProps.defaultSelected !== undefined && !_isEqual(nextProps.defaultSelected, this.props.defaultSelected)) {
				this.valueChange(nextProps.defaultSelected);
			}
		} else {
			if (nextProps.defaultSelected !== null && nextProps.defaultSelected !== undefined && nextProps.defaultSelected !== this.props.defaultSelected) {
				this.valueChange(nextProps.defaultSelected);
			}
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected, true);
		}
	};

	ToggleButton.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	ToggleButton.prototype.listenFilter = function listenFilter() {
		var _this3 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this3.props.componentId) {
				_this3.defaultSelected = null;
				_this3.handleChange(null);
			}
		});
	};

	ToggleButton.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, true) : null;
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.valueChange(defaultValue);
	};

	ToggleButton.prototype.valueChange = function valueChange(defaultValue) {
		var _this4 = this;

		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (this.defaultSelected !== null && this.defaultSelected !== undefined) {
				this.defaultSelected = Array.isArray(this.defaultSelected) ? this.defaultSelected : [this.defaultSelected];
				var records = this.props.data.filter(function (record) {
					return _this4.defaultSelected.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					this.handleChange(records, true);
				} else {
					this.handleChange(null);
				}
			} else {
				this.handleChange(null);
			}
		}
	};

	// set the query type and input data


	ToggleButton.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this5 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = props.customQuery ? props.customQuery(value) : _this5.customQuery(value);
			if (_this5.props.onQueryChange && JSON.stringify(_this5.previousQuery) !== JSON.stringify(currentQuery)) {
				_this5.props.onQueryChange(_this5.previousQuery, currentQuery);
			}
			_this5.previousQuery = currentQuery;
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
				component: "ToggleButton",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	ToggleButton.prototype.customQuery = function customQuery(record) {
		var query = null;
		if (record && record.length) {
			query = {
				bool: {
					should: generateTermQuery(this.props.dataField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;

		function generateTermQuery(dataField) {
			return record.map(function (singleRecord, index) {
				var _term;

				return {
					term: (_term = {}, _term[dataField] = singleRecord.value, _term)
				};
			});
		}
	};

	// handle the input change and pass the value inside sensor info


	ToggleButton.prototype.handleChange = function handleChange(record) {
		var _this6 = this;

		var setTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var selected = this.state.selected;

		var newSelection = null;
		var selectedIndex = null;

		if (record) {
			newSelection = [];
			if (setTrue) {
				// All the matching records should be selected and not toggled
				newSelection = record;
			} else {
				selected = selected ? selected : [];
				selected.forEach(function (selectedRecord, index) {
					if (record.label === selectedRecord.label) {
						selectedIndex = index;
						selected.splice(index, 1);
					}
				});
				if (selectedIndex === null) {
					if (this.props.multiSelect) {
						selected.push(record);
						newSelection = selected;
					} else {
						newSelection.push(record);
					}
				} else {
					newSelection = selected;
				}
			}
			newSelection = newSelection.length ? newSelection : null;
		} else {
			newSelection = null;
		}

		this.setState({
			selected: newSelection
		});

		var obj = {
			key: this.props.componentId,
			value: newSelection
		};

		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this6.props.onValueChange) {
				_this6.props.onValueChange(obj.value);
			}
			if (_this6.props.URLParams) {
				helper.URLParams.update(_this6.props.componentId, _this6.setURLValue(newSelection), _this6.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this6.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	ToggleButton.prototype.setURLValue = function setURLValue(records) {
		return records ? records.map(function (item) {
			return item.label;
		}) : null;
	};

	ToggleButton.prototype.renderButtons = function renderButtons() {
		var _this7 = this;

		var buttons = void 0;
		var selectedText = this.state.selected ? this.state.selected.map(function (record) {
			return record.label;
		}) : "";
		if (this.props.data) {
			buttons = this.props.data.map(function (record, i) {
				return React.createElement(
					"button",
					{
						key: i, className: "btn rbc-btn " + (selectedText.indexOf(record.label) > -1 ? "rbc-btn-active" : "rbc-btn-inactive"),
						onClick: function onClick() {
							return _this7.handleChange(record);
						}, title: record.title ? record.title : record.label
					},
					record.label
				);
			});
		}
		return buttons;
	};

	// render


	ToggleButton.prototype.render = function render() {
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
			"rbc-multiselect-active": this.props.multiSelect,
			"rbc-multiselect-inactive": !this.props.multiSelect
		}, this.props.className);
		return React.createElement(
			"div",
			{ className: "rbc rbc-togglebutton col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
			React.createElement(
				"div",
				{ className: "row" },
				title,
				React.createElement(
					"div",
					{ className: "rbc-buttongroup col s12 col-xs-12" },
					this.renderButtons()
				)
			)
		);
	};

	return ToggleButton;
}(Component);

export default ToggleButton;


ToggleButton.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.any.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true,
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

ToggleButton.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};