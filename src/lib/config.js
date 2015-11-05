let defaults = {
	dicateRecogniser: {
		inputs: 1,
		endpoint: "ec2-52-64-221-43.ap-southeast-2.compute.amazonaws.com:8000"
	},
	audioSources: {}
};

export class Config {
	
	constructor() {

		if(window.localStorage) {
			if(window.localStorage.config) {
				this.config = JSON.parse(window.localStorage.config);
			} else {
				this.config = {};
			}
		}
	}

	get(key) {
		let path = key.split("\.");
		let currentConfigObj = this.config;
		let currentDefaultsObj = defaults;
		for(let prop of path) {
			if(typeof currentConfigObj != "undefined") {
				currentConfigObj = currentConfigObj[prop];
			} 
			if(typeof currentDefaultsObj != "undefined") {
				currentDefaultsObj = currentDefaultsObj[prop];
			}
		}

		if(typeof currentConfigObj != "undefined") {
			return currentConfigObj;
		}

		if(typeof currentDefaultsObj != "undefined") {
			return currentDefaultsObj;
		}
	}

	set(key, value) {
		let currentConfigObj = this.config;
		let path = key.split("\.");
		let prop = path[0];
		for(let i = 0; i < path.length - 1; i++, prop = path[i]) {
			if(typeof currentConfigObj[prop] == "undefined") {
				currentConfigObj = currentConfigObj[prop] = {};
			} else {
				currentConfigObj = currentConfigObj[prop];
			}
		}
		currentConfigObj[prop] = value;
		window.localStorage.config = JSON.stringify(this.config);
	}

}