import { Dictate } from 'dictate-js/lib/dictate';
import { SpeechService } from 'lib/speech-service';
import { Transcript } from 'lib/transcript';

export class DictateSpeechRecogniser extends SpeechService {

	init() {
		this.dictate = new Dictate({
			server: "ws://docker:32775/client/ws/speech",
			serverStatus: "ws://docker:32775/client/ws/status",
			referenceHandler: "ws://docker:32775/client/ws/reference",
			onResults: this.onResults.bind(this, true),
			onPartialResults: this.onResults.bind(this, false),
			onError: this.onError.bind(this),
			recorderWorkerPath: '/jspm_packages/github/gpoole/dictate.js@master/lib/recorderWorker.js'
		});
	}

	start() {
		this.dictate.init(() => this.dictate.startListening());
	}

	stop() {
		this.dictate.stopListening();
	}

	onResults(final, hypothesis) {
		let speaker = 1;
		let transcript = this.transcriptStore.getCurrentForSource(`speaker:${speaker}`);

		if(!transcript) {
			transcript = new Transcript();
			transcript.source = `speaker:${speaker}`;
			transcript.type = Transcript.TYPE_SPEECH;
			transcript.displayName = "Speaker 1";
		}

		transcript.text = hypothesis[0].transcript;
		transcript.final = final;

		this.transcriptStore.publish(transcript);
	}

	onError(type, message) {
		this.transcriptStore.publish(new Transcript(this, `Error: ${message} (${type})`, Transcript.TYPE_ERROR));
	}

}