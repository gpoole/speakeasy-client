import { inject, bindable, computedFrom } from 'aurelia-framework';
import { TranscriptStore } from 'lib/transcript-store';
import { SpeechService } from 'lib/speech-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator, TranscriptStore, SpeechService)
export class Listen {

	@bindable transcripts;

	@bindable running = false;

	constructor(eventAggregator, transcriptStore, speechService) {
		this.transcriptStore = transcriptStore;
		this.eventAggregator = eventAggregator;
		this.speechService = speechService;

		this.transcripts = this.transcriptStore.all();

		this.disposeHandlers = [];

		this.disposeHandlers.push(this.eventAggregator.subscribe('transcript:added', (transcript) => {
			this.transcripts.push(transcript);
		}));

		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:stopping', () => {
			console.log("Speech recognition is stopping.");
			this.running = false
		}));
		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:starting', () => {
			console.log("Speech recognition is starting.");
			this.running = true
		}));
		this.speechService.start();
	}

	stopListening() {
		this.speechService.stop();
	}

	deactivate() {
		this.stopListening();
		this.transcripts = [];
		this.disposeHandlers.forEach((disposeHandler) => disposeHandler());
		this.disposeHandlers = [];
	}
}