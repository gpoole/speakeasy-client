import { SpeechService } from 'lib/speech-service';
import { Transcript } from 'lib/transcript';

export class DummySpeechRecogniser extends SpeechService {

	dummyText = [
		"I",
		"I am",
		"I am testing",
		"I am testing the speech",
		"I am testing the speech recogniser"
	];

	currentTranscript;

	pos = 0;

	init() {

	}

	start() {
		super.start();
		this.nextTimeout();
		this.transcriptStore.publish(new Transcript(this, "Starting dummy recogniser", Transcript.TYPE_SYSTEM));
		this.pos = 0;
	}

	nextTimeout() {
		setTimeout(() => {
			if(!this.currentTranscript) {
				this.currentTranscript = new Transcript(this, "", Transcript.TYPE_SPEECH, "Speaker 1", false);
			}
			this.currentTranscript.text = this.dummyText[this.pos++];
			if(this.pos >= this.dummyText.length) {
				this.pos = 0;
				this.currentTranscript.final = true;
			}
			this.transcriptStore.publish(this.currentTranscript);

			if(this.running) {
				this.nextTimeout();
				if(this.pos == 0) {
					this.currentTranscript = null;
				}
			}
		}.bind(this), Math.random() * 250 + 500);
	}

}