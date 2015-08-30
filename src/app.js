import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

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
			nav: true,
			title: 'Conversation'
		}]);

		this.router = router;
	}
}