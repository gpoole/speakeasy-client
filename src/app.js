import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Config } from 'lib/config';
// import $ from 'jquery';
import 'bootstrap';

@inject(EventAggregator, Config)
export class App {
	constructor(eventAggregator, config) {
		this.eventAggregator = eventAggregator;
		this.screenClass = "";
		this.config = config;

		this.eventAggregator.subscribe("router:navigation:success", (router) => {
			this.screenClass = router.instruction.config.class;
		});
	}

	configureRouter(config, router) {
		config.title = 'Speakeasy';
		config.map([{
			route: ['main', ''],
			name: 'main',
			moduleId: 'views/main',
			class: "se-screen-red",
			nav: false,
			title: 'Main'
		}, {
			route: ['listen'],
			name: 'listen',
			moduleId: 'views/listen',
			class: "se-screen-grey",
			nav: false,
			title: 'Listen'
		}, {
			route: ['conversation'],
			name: 'conversation',
			moduleId: 'views/conversation',
			class: "se-screen-blue",
			nav: true,
			title: 'Conversation'
		}, {
			route: ['settings'],
			name: 'settings',
			moduleId: 'views/settings',
			class: "se-screen-orange",
			nav: true,
			title: 'Settings'
		}]);

		this.router = router;
	}
}