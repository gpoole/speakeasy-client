import { inject, bindable } from 'aurelia-framework';
import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(SpeechService, EventAggregator)
export class Listen {

	@bindable transcripts = [];

	constructor(speechService, eventAggregator) {
		this.speechService = speechService;
		this.eventAggregator = eventAggregator;

		// Start automatically and never stop
		this.speechService.start();
		this.eventAggregator.subscribe(SpeechEvent, this.onSpeech.bind(this));
	}

	getCurrentTranscriptForSpeaker(speaker) {
		let transcript = this.transcripts.find(function(transcript) {
			if(transcript.speaker == speaker && !transcript.complete) {
				return transcript;
			}
		});

		if(!transcript) {
			transcript = {
				speaker: speaker
			};
			this.transcripts.push(transcript);
		}

		return transcript;
	}

	onSpeech(event) {
		let transcript = this.getCurrentTranscriptForSpeaker(event.speaker);
		if(event.final) {
			transcript.complete = true;
		}
		transcript.text = event.transcript;
	}

}