import { inject } from 'aurelia-framework';
import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(SpeechService, EventAggregator)
export class Transcriber {

	transcripts = [];

	constructor(speechService, eventAggregator) {
		this.speechService = speechService;
		this.eventAggregator = eventAggregator;

		this.eventAggregator.subscribe(SpeechEvent, this.onSpeech.bind(this));
	}

	start() {
		this.speechService.start();
		this.eventAggregator.publish('transcriber:start', this);
	}

	stop() {
		this.speechService.stop();
		this.eventAggregator.publish('transcriber:stop', this);
	}

	get running() {
		return this.speechService.running;
	}

	onSpeech(event) {
		let isNew = true;
		let transcript = this.transcripts.find(function(transcript) {
			if(transcript.speaker == event.speaker && !transcript.complete) {
				isNew = false;
				return transcript;
			}
		});

		if(!transcript) {
			transcript = {
				speaker: event.speaker
			};
			this.transcripts.push(transcript);
		}

		if(event.final) {
			transcript.complete = true;
		}
		transcript.text = event.transcript;

		if(isNew) {
			this.eventAggregator.publish('transcriber:add', transcript, this);
		} else {
			this.eventAggregator.publish('transcriber:modify', transcript, this);
		}

		this.eventAggregator.publish('transcriber:update', transcript, this);
	}

}