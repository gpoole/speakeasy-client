import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TranscriptStore } from 'lib/transcript-store';
import { Config } from 'lib/config';
import { Transcript } from 'lib/transcript';

@inject(TranscriptStore, EventAggregator, Config)
export class SpeechService {

	running = false;

	constructor(transcriptStore, eventAggregator, config) {
		this.transcriptStore = transcriptStore;
		this.eventAggregator = eventAggregator;
		this.config = config;

		if('init' in this && typeof this.init == 'function') {
			this.init();
		}
	}

	start() {
		this.eventAggregator.publish("speech:starting");
		this.running = true;
	}

	stop() {
		this.eventAggregator.publish("speech:stopping");
		this.running = false;
	}

	getAudioSources(cb) {
		let audioSources = [];
		MediaStreamTrack.getSources((sources) => {
			sources.forEach((sourceInfo) => {
				if(sourceInfo.kind != 'audio') {
					return;
				}
				audioSources.push(sourceInfo);
			});
			cb(audioSources);
		});
	}

	getConfiguredSpeakers() {
		let speakers = [];
		for(let speakerId in this.config.get('audioSources')) {
			speakers.push({
				id: speakerId,
				audioSourceId: this.config.get('audioSources')[speakerId]
			});
		}
		return speakers;
	}

}