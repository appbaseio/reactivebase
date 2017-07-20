function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import manager from "./ChannelManager";
var Appbase = require("appbase-js");
var helper = require("./helper.js");

var ReactiveBase = function (_Component) {
	_inherits(ReactiveBase, _Component);

	function ReactiveBase(props, context) {
		_classCallCheck(this, ReactiveBase);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {};
		_this.type = _this.props.type ? _this.props.type : "*";
		_this.appbaseRef = new Appbase({
			url: "https://scalr.api.appbase.io",
			appname: _this.props.app,
			credentials: _this.props.credentials,
			type: _this.type
		});
		_this.appbaseCrdentials = {
			url: "https://scalr.api.appbase.io",
			credentials: _this.props.credentials,
			appname: _this.props.app,
			type: _this.type
		};
		_this.reactiveId = helper.RecactivebaseComponents.length;
		helper.RecactivebaseComponents[_this.reactiveId] = [];
		return _this;
	}

	ReactiveBase.prototype.componentWillMount = function componentWillMount() {
		this.setupComponents(this.props.children);
	};

	ReactiveBase.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.setupComponents(nextProps.children);
	};

	ReactiveBase.prototype.setupComponents = function setupComponents(children) {
		this.components = [];
		this.getComponents(children);
		helper.RecactivebaseComponents[this.reactiveId] = this.components;
	};

	ReactiveBase.prototype.getComponents = function getComponents(children) {
		var _this2 = this;

		children = Array.isArray(children) ? children : [children];
		children.forEach(function (child) {
			if (child && child.props && child.props.componentId && child.props.showFilter !== false) {
				_this2.components.push({
					component: child.type.name,
					componentId: child.props.componentId
				});
			}
			if (child && child.props && child.props.children) {
				_this2.getComponents(child.props.children);
			}
		});
	};

	ReactiveBase.prototype.getChildContext = function getChildContext() {
		return {
			appbaseRef: this.appbaseRef,
			type: this.type,
			app: this.props.app,
			appbaseCrdentials: this.appbaseCrdentials,
			reactiveId: this.reactiveId
		};
	};

	ReactiveBase.prototype.render = function render() {
		return React.createElement(
			"section",
			{ className: "rbc-base col s12 col-xs-12 " + this.props.theme, style: { padding: 0 } },
			this.props.children
		);
	};

	return ReactiveBase;
}(Component);

export default ReactiveBase;


ReactiveBase.propTypes = {
	app: React.PropTypes.string.isRequired,
	credentials: helper.reactiveBaseValidation,
	type: React.PropTypes.string,
	theme: React.PropTypes.string
};

// Default props value
ReactiveBase.defaultProps = {
	theme: "rbc-blue"
};

ReactiveBase.childContextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	app: React.PropTypes.any,
	appbaseCrdentials: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};