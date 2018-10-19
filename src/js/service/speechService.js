var _allVoices = null;
var _voicesLangs = [];
var _voicesLangMap = {};

var speechService = {};

speechService.speak = function (text, lang) {
    lang = lang || 'en';
    if (speechService.speechSupported()) {
        var msg = new SpeechSynthesisUtterance(text);
        msg.voice = getVoice(lang);
        //log.info('used voice: ' + msg.voice.name);
        window.speechSynthesis.speak(msg);
    }
};

speechService.getVoicesLangs = function () {
    return _voicesLangs;
};

speechService.speechSupported = function () {
    return (typeof SpeechSynthesisUtterance !== 'undefined');
};

function getVoice(lang) {
    if (_voicesLangMap[lang]) {
        return _voicesLangMap[lang];
    }

    for (var i = 0; i < _allVoices.length; i++) {
        if (_allVoices[i].lang.includes(lang)) {
            _voicesLangMap[lang] = _allVoices[i];
            return _allVoices[i];
        }
    }
    return null;
}

function init() {
    if (speechService.speechSupported()) {
        _allVoices = window.speechSynthesis.getVoices();
        setTimeout(function () {
            _allVoices = window.speechSynthesis.getVoices(); //first call in chrome returns [] sometimes
            _voicesLangs = _allVoices.map(voice => voice.lang.substring(0,2).toLowerCase());
            _voicesLangs = _voicesLangs.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            })
        }, 1000);
    }
}
init();

export {speechService};