import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SpeechService } from 'lib/speech-service';
import { Config } from 'lib/config';

@inject(Router, SpeechService)
export class Settings {

	constructor(router, speechService) {
		this.router = router;
		this.speechService = speechService;
		this.config = Config;

		this.audioSources = [];
		speechService.getAudioSources((sources) => {
			this.audioSources = sources;
		});
	}

}