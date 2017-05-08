class RbcURLParams {
	constructor() {
		this.params = new URLSearchParams(window.location.search);
	}
	get(componentId, multipleSelect=false) {
		let value = this.params.get(componentId);
		return multipleSelect ? value.split(",") : value;
	}
	update(componentId, value) {
		if(componentId) {
			if(value === null) {
				this.params.delete(componentId);
			} else {
				this.params.set(componentId, value);
			}
		}
		if (history.pushState && this.params.toString()) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" +this.params.toString();
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
}

export const URLParams = new RbcURLParams();