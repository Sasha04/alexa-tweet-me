'use strict';


var Alexa = require('alexa-sdk');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var languageStrings = {
    'en-GB': {
        'translation': {
            'TW_WELCOME_MSG'  : 'Welcome to Tweet Me. To start Tweet use tweet',
            'TW_MAX_CHAR_MSG' : 'The length of the Tweet is more than 140 characters',
            'TW_SEND_MSG'     : 'Do you want to Tweet',
            'TW_YESORNOT_MSG' : 'Say yes to post on Twitter or no to do nothing',
            'TW_OK_MSG'       : 'Your Tweet has been posted',
            'TW_KO_MSG'       : 'Ops, there is an error. Please, retry',
            'TW_NO_TWEET_MSG' : 'Ok, nothing will be posted on Twitter'
        }
    },
    'en-US': {
        'translation': {
            'TW_WELCOME_MSG'  : 'Welcome to Tweet Me. To start Tweet use tweet',
            'TW_MAX_CHAR_MSG' : 'The length of the Tweet is more than 140 characters',
            'TW_SEND_MSG'     : 'Do you want to Tweet',
            'TW_YESORNOT_MSG' : 'Say yes to post on Twitter or no to do nothing',
            'TW_OK_MSG'       : 'Your Tweet has been posted',
            'TW_KO_MSG'       : 'Ops, there is an error. Please, retry',
            'TW_NO_TWEET_MSG' : 'Ok, nothing will be posted on Twitter'
        }
    },
    'de-DE': {
        'translation': {
            'TW_WELCOME_MSG'  : 'Willkommen bei Tweet Me. Um zu starten Tweet verwenden Sie tweet',
            'TW_MAX_CHAR_MSG' : 'Die Länge des Tweets beträgt mehr als 140 Zeichen',
            'TW_SEND_MSG'     : 'Möchtest du Tweet',
            'TW_YESORNOT_MSG' : 'Sagen Sie ja, um auf Twitter zu posten oder gar nichts zu tun',
            'TW_OK_MSG'       : 'ein Tweet wurde veröffentlicht',
            'TW_KO_MSG'       : 'Ops gibt es einen Fehler. Bitte erneut versuchen',
            'TW_NO_TWEET_MSG' : 'Ok, nichts wird auf Twitter veröffentlicht'
        }
    },
    'it-IT': {
        'translation': {
            'TW_WELCOME_MSG'  : 'Benvenuto in Tweet Me. Per iniziare a twittare di tweet seguito dalla frase che vuoi',
            'TW_MAX_CHAR_MSG' : 'La lunghezza del Tweet super i 140 caratteri',
            'TW_SEND_MSG'     : 'Vuoi Twittare',
            'TW_YESORNOT_MSG' : 'Si per Twittate o no per terminare',
            'TW_OK_MSG'       : 'Il tuo tweet è stato postato correttamente',
            'TW_KO_MSG'       : 'Ops, c\'è stato un errore. Per favore, riprova',
            'TW_NO_TWEET_MSG' : 'Ok, non verrà postato nulla su Twitter'
        }
    }
};


//RETRIVE SENTENTENCE FROM SLOTS
var giveMeASentence = function(slots){

    var sentence = {word_one: null, word_two: null, word_three: null, word_four: null, word_five: null, word_six: null, word_seven: null, word_eight: null, word_nine: null, word_ten: null,
        word_eleven: null, word_twelve: null, word_thirteen: null, word_fourteen: null, word_fifteen: null, word_sixteen: null, word_seventeen: null, word_eighteen: null, word_twenty:null,
        word_twentyone: null, word_twentytwo: null, word_twentythree: null};


    for (var slot in slots){
        console.log(slot + "=" + slots[slot].value);
        if(slots[slot].value)
            sentence[slot] = slots[slot].value;
    }


    //console.log(sentence);

    var sentence_to_tweet = "";
    for (var key in sentence) {
        //console.log(sentence[key]);
        if(sentence[key])
            sentence_to_tweet += sentence[key] + " ";
    }

    sentence_to_tweet = sentence_to_tweet.trim();

    return sentence_to_tweet;

};


module.exports.sendTweet  = function(event, context, callback) {
        var alexa = Alexa.handler(event, context, callback);

        alexa.appId = '';

        alexa.resources = languageStrings;
        alexa.registerHandlers(handlers);
        alexa.execute();
};



var handlers = {

    'LaunchRequest': function () {
        this.emit('WelcomeIntent');
    },

    'WelcomeIntent': function () {
        this.emit(':tell', this.t('TW_WELCOME_MSG'));
    },

    'TweetEmAll': function () {

        var sentence_to_tweet = giveMeASentence(this.event.request.intent.slots);

        if(sentence_to_tweet.length > 140){
            //TODO: CONTROLLO LUNGHEZZA TWEET -> come si gestisce un retry?
            this.emit(':tell', this.t('TW_MAX_CHAR_MSG'));
        } else {
            this.attributes['sentence_to_tweet'] = sentence_to_tweet;
            this.emit(':ask', this.t('TW_SEND_MSG') + ' <s><prosody volume="x-loud">' + sentence_to_tweet + '</prosody></s>', this.t('TW_YESORNOT_MSG'));

        }

    },

    'AMAZON.YesIntent': function() {
        console.log(this.attributes['sentence_to_tweet']);

        client.post('statuses/update', {status: this.attributes['sentence_to_tweet']})
            .then(function (tweet) {
              //  console.log(tweet);
                this.emit(':tell', this.t('TW_OK_MSG'));
            })
            .catch(function (error) {
                //throw error;
                this.emit(':tell', this.t('TW_KO_MSG'));
            })

    },

    'AMAZON.NoIntent': function() {
        this.emit(':tell', this.t('TW_NO_TWEET_MSG'));
        this.attributes['sentence_to_tweet'] = '';
    },

};