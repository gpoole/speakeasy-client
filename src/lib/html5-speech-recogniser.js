import { SpeechService } from 'lib/speech-service';
import { Transcript } from 'lib/transcript';

export class Html5SpeechRecogniser extends SpeechService {

	debug = null;

	currentResultIndex = 0;

	init() {
		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = true;
		this.recognition.interimResults = true;
		this.recognition.addEventListener('result', this.onResult.bind(this), true);
		this.recognition.addEventListener('error', this.onError.bind(this), true);
		this.recognition.addEventListener('end', this.onEnd.bind(this), true);

		for(let event of [ 'audio', 'speech', 'sound' ]) {
			this.recognition.addEventListener(`${event}start`, () => console.log(`${event}start`), true);
			this.recognition.addEventListener(`${event}end`, () => console.log(`${event}end`), true);
		}
	}

	start() {
		super.start();
		this.currentResultIndex = 0;
		this.recognition.start();
		this.transcriptStore.publish(new Transcript(this, "Starting speech recognition", Transcript.TYPE_SYSTEM));
	}

	stop() {
		super.stop();
		this.recognition.stop();
	}

	onResult(event) {
		let speaker = 1;
		let transcript = this.transcriptStore.getCurrentForSource(`speaker:${speaker}`);

		if(!transcript) {
			transcript = new Transcript();
			transcript.source = `speaker:${event.speaker}`;
			transcript.type = Transcript.TYPE_SPEECH;
			transcript.displayName = "Speaker 1";
		}

		transcript.text = event.results[this.currentResultIndex][0].transcript;
		if(event.results[this.currentResultIndex].isFinal) {
			if(!transcript.final) {
				transcript.final = true;
			}
			this.currentResultIndex++;
		}

		this.transcriptStore.publish(transcript);
	}

	onError(event) {
		let text = "Error: ";
		if(event.message) {
			text += `${event.message} (${event.error})`;
		} else {
			text += event.error;
		}
		this.transcriptStore.publish(new Transcript(this, text, Transcript.TYPE_ERROR));
	}

	onEnd(event) {
		this.transcriptStore.publish(new Transcript(this, "Stopping speech recognition", Transcript.TYPE_SYSTEM));
	}

}