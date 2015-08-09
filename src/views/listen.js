import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Transcriber } from 'lib/transcriber';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Transcriber, EventAggregator)
export class Listen {

	@bindable transcripts = [];

	running = false;

	constructor(transcriber, eventAggregator) {
		this.transcriber = transcriber;
		this.eventAggregator = eventAggregator;

		this.eventAggregator.subscribe('transcriber:add', (transcript) => {
			this.transcripts.push(transcript);
		});

		this.eventAggregator.subscribe('transcriber:stop', () => {
			this.running = false;
		});

		this.eventAggregator.subscribe('transcriber:start', () => {
			this.running = true;
		});
	}

	@computedFrom('running')
	get stopped() {
		return !this.running;
	}

	toggleListening() {
		if(this.transcriber.running) {
			this.transcriber.stop();
		} else {
			this.transcriber.start();
		}
	}
}