import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
  configureRouter(config, router){
    config.title = 'Speakeasy';
    config.map([
      { route: [ 'listen', '' ],         name: 'listen',        moduleId: 'views/listen',        nav: true, title:'Listen' }
    ]);

    this.router = router;
  }
}
