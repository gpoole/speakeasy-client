import { inject, bindable } from 'aurelia-framework';
import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(SpeechService, EventAggregator)
export class Listen {

	@bindable transcripts;

	constructor(speechService, eventAggregator) {
		this.speechService = speechService;
		this.eventAggregator = eventAggregator;

		// Start automatically and never stop
		this.speechService.start();
		this.eventAggregator.subscribe(SpeechEvent, this.onSpeech.bind(this));
		this.transcripts = [{}];
	}

	onSpeech(event) {
		this.transcripts[0].speaker = "Speaker 1";
		this.transcripts[0].text = event.transcript;
	}

}