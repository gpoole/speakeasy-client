import { SpeechService } from 'lib/speech-service';
import { Html5SpeechRecogniser } from 'lib/html5-speech-recogniser';
import { DummySpeechRecogniser } from 'lib/dummy-speech-recogniser';
import { DictateSpeechRecogniser } from 'lib/dictate-speech-recogniser';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    // .globalizeResources('views/components/menu')
    .plugin('aurelia-animator-css');

  // aurelia.container.registerSingleton(SpeechService, Html5SpeechRecogniser);
  // aurelia.container.registerSingleton(SpeechService, DummySpeechRecogniser);
  aurelia.container.registerSingleton(SpeechService, DictateSpeechRecogniser);

  aurelia.start().then(a => a.setRoot());
}
