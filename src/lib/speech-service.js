import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class SpeechService {

	running = false;

	constructor(eventAggregator) {
		this.eventAggregator = eventAggregator;
		if('init' in this && typeof this.init == 'function') {
			this.init();
		}
	}

	start() {
		this.running = true;
	}

	stop() {

	}

	publish(event) {
		this.eventAggregator.publish(event);
	}

}