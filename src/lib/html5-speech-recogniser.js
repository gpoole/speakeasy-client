import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';

export class Html5SpeechRecogniser extends SpeechService {

	init() {
		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = true;
		this.recognition.interimResults = true;
		this.recognition.addEventListener('result', this.onResult.bind(this), true);
	}

	start() {
		super.start();
		this.recognition.start();
	}

	stop() {
		super.start();
		this.recognition.stop();	
	}

	onResult(event) {
		let ourEvent = new SpeechEvent();
		ourEvent.transcript = event.results[0][0].transcript;
		ourEvent.final =  event.results.final;
		this.publish(ourEvent);
	}

}