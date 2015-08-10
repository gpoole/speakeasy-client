import { inject, bindable, computedFrom } from 'aurelia-framework';
import { TranscriptStore } from 'lib/transcript-store';
import { SpeechService } from 'lib/speech-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator, TranscriptStore, SpeechService)
export class Listen {

	@bindable transcripts = [];

	@bindable running = false;

	constructor(eventAggregator, transcriptStore, speechService) {
		this.transcriptStore = transcriptStore;
		this.eventAggregator = eventAggregator;
		this.speechService = speechService;

		this.eventAggregator.subscribe('transcript:added', (transcript) => {
			this.transcripts.push(transcript);
		});

		this.eventAggregator.subscribe('speech:stopping', () => this.running = false);
		this.eventAggregator.subscribe('speech:starting', () => this.running = true);
	}

	startListening() {
		this.speechService.start();
	}

	stopListening() {
		this.speechService.stop();
	}
}