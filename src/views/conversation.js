import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SpeechService } from 'lib/speech-service';
import { View } from '../view';

@inject(Router, SpeechService)
export class Conversation extends View {

	constructor(router, speechService) {
		super();
		this.router = router;
		this.speechService = speechService;
		this.speakers = speechService.getConfiguredSpeakers();
	}

}