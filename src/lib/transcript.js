export class Transcript {
	id;
	source;
	displayName;
	type;
	text;
	final;
	created = new Date();
	lastModified = new Date();

	constructor(source, text, type, displayName, final, created, lastModified) {
		this.source = source;
		this.text = text;
		this.displayName = displayName;
		this.type = type;
		this.final = final;
		this.created = created;
		this.lastModified = lastModified;
	}
}

Transcript.TYPE_SYSTEM = 'system';
Transcript.TYPE_ERROR = 'error';
Transcript.TYPE_SPEECH = 'speech';
Transcript.TYPE_TEXT = 'text';