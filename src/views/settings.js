import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SpeechService } from 'lib/speech-service';
import { Config } from 'lib/config';
import { View } from '../view';

@inject(Router, SpeechService)
export class Settings extends View {

	constructor(router, speechService) {
		super();
		this.router = router;
		this.speechService = speechService;
		this.config = Config;

		this.audioSources = [];
		speechService.getAudioSources((sources) => {
			this.audioSources = sources;
		});
	}

}