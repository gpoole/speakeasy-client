import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';

export class Html5SpeechRecogniser extends SpeechService {

	init() {
		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = true;
		this.recognition.interimResults = true;
		this.recognition.addEventListener('result', this.onResult.bind(this), true);
		this.recognition.addEventListener('error', this.onError.bind(this), true);

		for(let event of [ 'audio', 'speech', 'sound' ]) {
			this.recognition.addEventListener(`${event}start`, () => console.log(`${event}start`), true);
			this.recognition.addEventListener(`${event}end`, () => console.log(`${event}end`), true);
		}
	}

	start() {
		super.start();
		this.recognition.start();
	}

	stop() {
		super.stop();
		this.recognition.stop();	
	}

	onResult(event) {
		let ourEvent = new SpeechEvent();
		ourEvent.transcript = event.results[0][0].transcript;
		ourEvent.final =  event.results.final;
		this.publish(ourEvent);
	}

	onError(event) {
		console.log(event);
	}

	onEnd(event) {
		console.log('end');
		super.stop();
	}

}