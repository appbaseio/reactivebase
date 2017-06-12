import _ from "lodash";
const URLSearchParams = require("url-search-params");

class RbcURLParams {
	constructor() {
		this.params = new URLSearchParams(window.location.search);
	}

	get(componentId, multipleSelect=false, jsonParse=false) {
		let value = this.params.get(componentId);
		if(jsonParse && value) {
			try {
				value = JSON.parse(value);
			} catch(e) {
				console.log(e);
			}
		}
		return multipleSelect ? ( value && value.trim() ? value.split(",") : null ) : value;
	}

	update(componentId, value, allowUpdate = false) {
		if(allowUpdate) {
			this.setOrDelete(componentId, value);
			this.applyURLUpdate();
		}
	}

	setOrDelete(componentId, value) {
		if(componentId) {
			if(value) {
				this.params.set(componentId, value);
			} else {
				this.params.delete(componentId);
			}
		}
	}

	applyURLUpdate() {
		if (history.pushState) {
			const paramsSting = this.params.toString() ? "?" + this.params.toString() : "";
			const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsSting;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
}

export const URLParams = new RbcURLParams();
