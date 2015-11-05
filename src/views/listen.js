import { inject, bindable, computedFrom } from 'aurelia-framework';
import { TranscriptStore } from 'lib/transcript-store';
import { SpeechService } from 'lib/speech-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';
import { View } from '../view';

@inject(EventAggregator, TranscriptStore, SpeechService)
export class Listen extends View {

	@bindable transcripts;

	@bindable running = false;

	constructor(eventAggregator, transcriptStore, speechService) {
		super();
		this.transcriptStore = transcriptStore;
		this.eventAggregator = eventAggregator;
		this.speechService = speechService;

		// this.transcripts = this.transcriptStore.all();
		this.bubbles = [];
		this.speakerBubbles = {};

		this.disposeHandlers = [];

		let currentBubble;
		this.disposeHandlers.push(this.eventAggregator.subscribe('transcript:added', (transcript) => {
			let currentBubble = this.speakerBubbles[transcript.speaker.id];
			if(!currentBubble || (new Date() - currentBubble.lastUpdated > 2000)) {
				currentBubble = {
					transcripts: [ transcript ],
					extraClasses: '',
					// This isn't quite right, since presumably different transcripts
					// from the same speaker could have different types, but that's pretty
					// hard to work with
					type: transcript.type,
					speaker: transcript.speaker,
					lastUpdated: new Date()
				};
				this.speakerBubbles[transcript.speaker.id] = currentBubble;
				this.bubbles.push(currentBubble);
			} else {
				currentBubble.transcripts.push(transcript);
				currentBubble.lastUpdated = new Date();
			}

			// Seems a little shady...
			setTimeout(() => {
				currentBubble.extraClasses = 'se-bubble-added';
				let lastBubble = $('.se-bubble:last');
				$('body').animate({
					scrollTop: lastBubble.offset().top + lastBubble.outerHeight(true)
				});
			}, 5);
		}));

		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:stopping', () => {
			this.running = false;
		}));
		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:starting', () => {
			this.running = true;
		}));
		this.speechService.start();
	}

	stopListening() {
		this.speechService.stop();
	}

	deactivate() {
		this.stopListening();
		this.bubbles = [];
		this.disposeHandlers.forEach((disposeHandler) => disposeHandler());
		this.disposeHandlers = [];
	}
}