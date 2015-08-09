import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';

export class DummySpeechRecogniser extends SpeechService {

	transcript = [
		"I",
		"I am",
		"I am testing",
		"I am testing the speech",
		"I am testing the speech recogniser"
	];

	pos = 0;

	init() {

	}

	start() {
		super.start();
		this.nextTimeout();	
	}

	nextTimeout() {
		setTimeout(() => {
			let event = new SpeechEvent();
			event.transcript = this.transcript[this.pos++];
			event.speaker = "Speaker 1";
			if(this.pos >= this.transcript.length) {
				this.pos = 0;
				event.final = true
			}
			this.publish(event);

			if(this.running) {
				this.nextTimeout();
			}
		}.bind(this), Math.random() * 250 + 500);
	}

}