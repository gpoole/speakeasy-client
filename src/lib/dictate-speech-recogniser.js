import { Dictate } from 'dictate-js/lib/dictate';
import { SpeechService } from 'lib/speech-service';
import { Transcript } from 'lib/transcript';
import { Config } from 'lib/config';

export class DictateSpeechRecogniser extends SpeechService {

	init() {

	}

	start() {
		this.dictators = [];

		for(let speakerId in Config.audioSources) {
			let audioSourceId = Config.audioSources[speakerId];
			if(audioSourceId != "") {
				let dictate = new Dictate({
					server: `ws://${Config.dicateRecogniser.endpoint}/client/ws/speech`,
					serverStatus: `ws://${Config.dicateRecogniser.endpoint}/client/ws/status`,
					referenceHandler: `ws://${Config.dicateRecogniser.endpoint}/client/ws/reference`,
					audioSourceId: audioSourceId,
					onResults: this.onResults.bind(this, dictate, speakerId, true),
					onPartialResults: this.onResults.bind(this, dictate, speakerId, false),
					onError: this.onError.bind(this, dictate),
					onEvent: (type) => {
						// 3 == MSG_INIT_RECORDER
						// Start listening as soon as we're ready with the user media
						if(type == 3) {
							this.startListening();
						}
					}
					recorderWorkerPath: '/jspm_packages/github/gpoole/dictate.js@master/lib/recorderWorker.js'
				});
				this.dictators.push(dictate);
			}
		}
	}

	stop() {
		this.dictators.forEach((dictator) => dictator.stopListening());
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

	onError(dictate, type, message) {
		this.transcriptStore.publish(new Transcript(this, `Error: ${message} (${type})`, Transcript.TYPE_ERROR));
	}

}