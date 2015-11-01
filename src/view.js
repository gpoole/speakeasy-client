export class View {
	construct() {
		this.bodyClass = "";
	}

	bind() {
		setTimeout(() => {
			this.bodyClass = 'se-screen-body-entry';
		}, 5);
	}

	canDeactivate() {
		this.bodyClass = 'se-screen-body-exit';
		return new Promise((resolve) => {
			setInterval(() => {
				resolve(true);
			}, 150);
		});
	}
}