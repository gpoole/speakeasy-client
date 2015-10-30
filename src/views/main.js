import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { View } from '../view';

@inject(Router)
export class Main extends View {

	constructor(router) {
		super();
		this.router = router;
	}

}