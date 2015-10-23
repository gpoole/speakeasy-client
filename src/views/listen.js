import { inject, bindable, computedFrom } from 'aurelia-framework';
import { TranscriptStore } from 'lib/transcript-store';
import { SpeechService } from 'lib/speech-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';

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
			// FIXME: there's got to be a hook for the render update and a way to get the view's DOM
			// element, but if there is I can't find it...
			setTimeout(() => {
				let lastBubble = $('.se-bubble:last');
				lastBubble.addClass('se-bubble-added');
				let bubbleBottom = lastBubble.offset().top + lastBubble.outerHeight();

				if(bubbleBottom > $(window).height()) {
					$('body').animate({
						scrollTop: lastBubble.offset().top
					});
				}
			}, 0);
		}));

		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:stopping', () => {
			console.log("Speech recognition is stopping.");
			this.running = false;
		}));
		this.disposeHandlers.push(this.eventAggregator.subscribe('speech:starting', () => {
			console.log("Speech recognition is starting.");
			this.running = true;
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