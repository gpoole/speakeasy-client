import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Transcript } from 'lib/transcript';

@inject(EventAggregator)
export class TranscriptStore {

	transcripts = [];

	constructor(eventAggregator) {
		this.eventAggregator = eventAggregator;
	}

	getCurrentForSource(source) {
		let transcript = this.transcripts.find(function(transcript) {
			if(transcript.source == source && !transcript.final) {
				return transcript;
			}
		});

		return transcript;
	}

	all() {
		return this.transcripts.slice();
	}

	publish(transcript) {
		transcript.lastModified = new Date();
		if(this.transcripts.indexOf(transcript) == -1) {
			this.transcripts.push(transcript);
			this.eventAggregator.publish('transcript:added', transcript, this);
		} else {
			this.eventAggregator.publish('transcript:updated', transcript, this);
		}
	}

}