import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TranscriptStore } from 'lib/transcript-store';
import { Transcript } from 'lib/transcript';

@inject(TranscriptStore, EventAggregator)
export class SpeechService {

	running = false;

	constructor(transcriptStore, eventAggregator) {
		this.transcriptStore = transcriptStore;
		this.eventAggregator = eventAggregator;

		if('init' in this && typeof this.init == 'function') {
			this.init();
		}
	}

	start() {
		this.eventAggregator.publish("speech:starting");
		this.running = true;
	}

	stop() {
		this.eventAggregator.publish("speech:stopping");
		this.running = false;
	}

}