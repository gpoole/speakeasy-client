import { Dictate } from 'dictate-js/lib/dictate';
import { SpeechService } from 'lib/speech-service';
import { Transcript } from 'lib/transcript';
import { Config } from 'lib/config';

export class DictateSpeechRecogniser extends SpeechService {

	init() {
		this.dictators = [];
		MediaStreamTrack.getSources((sources) => {
			let speakerCount = 0;
			sources.forEach((sourceInfo) => {
				if(sourceInfo.kind != 'audio') {
					return;
				}
				let speakerId = ++speakerCount;
				let dictate = new Dictate({
					server: `ws://${Config.dicateRecogniser.endpoint}/client/ws/speech`,
					serverStatus: `ws://${Config.dicateRecogniser.endpoint}/client/ws/status`,
					referenceHandler: `ws://${Config.dicateRecogniser.endpoint}/client/ws/reference`,
					audioSourceId: sourceInfo.id,
					onResults: this.onResults.bind(this, dictate, speakerId, true),
					onPartialResults: this.onResults.bind(this, dictate, speakerId, false),
					onError: this.onError.bind(this, dictate, speakerId),
					recorderWorkerPath: '/jspm_packages/github/gpoole/dictate.js@master/lib/recorderWorker.js'
				});
				this.dictators.push(dictate);
			});
		});
	}

	start() {
		this.dictate.init(() => {
			this.dictators.forEach(Dictate.prototype.startListening.call);
		});
	}

	stop() {
		this.dictators.forEach(Dictate.prototype.stopListening.call);
	}

	onResults(dictate, speakerId, final, hypothesis) {
		let transcript = this.transcriptStore.getCurrentForSpeaker({ id: speakerId });

		if(!transcript) {
			transcript = new Transcript();
			transcript.source = this;
			transcript.speaker = { id: speakerId };
			transcript.type = Transcript.TYPE_SPEECH;
		}

		transcript.text = hypothesis[0].transcript;
		transcript.final = final;

		this.transcriptStore.publish(transcript);
	}

	onError(type, message) {
		this.transcriptStore.publish(new Transcript(this, `Error: ${message} (${type})`, Transcript.TYPE_ERROR));
	}

}