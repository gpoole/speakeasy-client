import { SpeechService } from 'lib/speech-service';
import { SpeechEvent } from 'lib/speech-event';
import { Transcript } from 'lib/transcript';

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
		this.transcriptStore.publish(new Transcript(this, "Starting speech recognition", Transcript.TYPE_SYSTEM));
	}

	stop() {
		super.stop();
		this.recognition.stop();
		this.transcriptStore.publish(new Transcript(this, "Stopping speech recognition", Transcript.TYPE_SYSTEM));
	}

	onResult(event) {
		let ourEvent = new SpeechEvent();
		ourEvent.transcript = event.results[0][0].transcript;
		ourEvent.final =  event.results.final;
		ourEvent.speaker = "Speaker 1";
		this.publish(ourEvent);
	}

	onError(event) {
		console.log(event);
	}

	onEnd(event) {
		this.stop();
	}

}