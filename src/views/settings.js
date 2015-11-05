import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SpeechService } from 'lib/speech-service';
import { Config } from 'lib/config';
import { View } from '../view';

@inject(Router, SpeechService, Config)
export class Settings extends View {

	constructor(router, speechService, config) {
		super();
		this.router = router;
		this.speechService = speechService;
		this.config = config;

		this.audioSources = [];
		speechService.getAudioSources((sources) => {
			this.audioSources = sources;
		});

		this.audioSource1 = this.config.get("audioSources.1");
		this.audioSource2 = this.config.get("audioSources.2");
		console.log(this.config.get("audioSources.2"));
	}

	changeSetting(key, event) {
		this.config.set(key, event.target.value);
	}

}