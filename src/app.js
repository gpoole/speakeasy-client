import 'bootstrap';

export class App {
	configureRouter(config, router) {
		config.title = 'Speakeasy';
		config.map([{
			route: ['main', ''],
			name: 'main',
			moduleId: 'views/main',
			nav: false,
			title: 'Main'
		}, {
			route: ['listen'],
			name: 'listen',
			moduleId: 'views/listen',
			nav: false,
			title: 'Listen'
		}, {
			route: ['conversation'],
			name: 'conversation',
			moduleId: 'views/conversation',
			nav: true,
			title: 'Conversation'
		}, {
			route: ['settings'],
			name: 'settings',
			moduleId: 'views/settings',
			nav: true,
			title: 'Settings'
		}]);

		this.router = router;
	}
}