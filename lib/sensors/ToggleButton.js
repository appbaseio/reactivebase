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
		_this.urlParams = helper.URLParams.get(_this.props.componentId, true);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	ToggleButton.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.listenFilter();
	};

	ToggleButton.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (nextProps.defaultSelected && !_isEqual(nextProps.defaultSelected, this.props.defaultSelected)) {
			this.checkDefault(nextProps);
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
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.defaultSelected = null;
				_this2.handleChange(null);
			}
		});
	};

	ToggleButton.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, true);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.valueChange(defaultValue);
	};

	ToggleButton.prototype.valueChange = function valueChange(defaultValue) {
		var _this3 = this;

		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (this.defaultSelected) {
				this.defaultSelected = Array.isArray(this.defaultSelected) ? this.defaultSelected : [this.defaultSelected];
				var records = this.props.data.filter(function (record) {
					return _this3.defaultSelected.indexOf(record.label) > -1;
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
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.appbaseField,
				customQuery: props.customQuery ? props.customQuery : this.customQuery,
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
					should: generateTermQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return query;

		function generateTermQuery(appbaseField) {
			return record.map(function (singleRecord, index) {
				var _term;

				return {
					term: (_term = {}, _term[appbaseField] = singleRecord.value, _term)
				};
			});
		}
	};

	// handle the input change and pass the value inside sensor info


	ToggleButton.prototype.handleChange = function handleChange(record) {
		var _this4 = this;

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
			if (_this4.props.onValueChange) {
				_this4.props.onValueChange(obj.value);
			}
			helper.URLParams.update(_this4.props.componentId, _this4.setURLValue(newSelection), _this4.props.URLParams);
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

	ToggleButton.prototype.setURLValue = function setURLValue(records) {
		return records ? records.map(function (item) {
			return item.label;
		}) : null;
	};

	ToggleButton.prototype.renderButtons = function renderButtons() {
		var _this5 = this;

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
							return _this5.handleChange(record);
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
		});
		return React.createElement(
			"div",
			{ className: "rbc rbc-togglebutton col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
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
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true,
	componentStyle: {},
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
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};