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

	pos = 0;

	init() {
		this.transcripts = {};
		this.currentPos = {};
	}

	start() {
		super.start();
		for(let i = 1; i <= 2; i++) {
			this._generateRecogniser(i);
		}
		this.transcriptStore.publish(new Transcript(this, "Starting dummy recogniser", Transcript.TYPE_SYSTEM));
		this.pos = 0;
	}

	_generateRecogniser(speaker) {
		let nextBlock = () => {
			setTimeout(() => {
				if(!this.transcripts[speaker]) {
					this.transcripts[speaker] = new Transcript(this, "", Transcript.TYPE_SPEECH, { id: speaker }, false);
					this.currentPos[speaker] = 0;
				}
				this.transcripts[speaker].text = this.dummyText[this.currentPos[speaker]++];
				if(this.currentPos[speaker] >= this.dummyText.length) {
					this.currentPos[speaker] = 0;
					this.transcripts[speaker].final = true;
				}
				this.transcriptStore.publish(this.transcripts[speaker]);

				if(this.running) {
					nextBlock();
					if(this.currentPos[speaker] == 0) {
						this.transcripts[speaker] = null;
					}
				}
			}, Math.random() * 250 + 500);
		}
		nextBlock();
	}
}