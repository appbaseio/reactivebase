import _ from "lodash";

class RbcURLParams {
	constructor() {
		this.params = new URLSearchParams(window.location.search);
	}
	get(componentId, multipleSelect=false, jsonParse=true) {
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
			if(value === null) {
				this.params.delete(componentId);
			} else {
				this.params.set(componentId, value);
			}
		}
	}
	applyURLUpdate() {
		if (history.pushState && this.params.toString()) {
			const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" +this.params.toString();
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
}

export const URLParams = new RbcURLParams();