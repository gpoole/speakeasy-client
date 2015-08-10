import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TranscriptStore } from 'lib/transcript-store';
import { Transcript } from 'lib/transcript';

@inject(TranscriptStore)
export class SpeechService {

	running = false;

	constructor(transcriptStore) {
		this.transcriptStore = transcriptStore;
		if('init' in this && typeof this.init == 'function') {
			this.init();
		}
	}

	start() {
		this.running = true;
	}

	stop() {
		this.running = false;
	}

}