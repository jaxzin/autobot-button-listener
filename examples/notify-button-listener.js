var BlendMicro = require('blendmicro');
var notifier = require('node-notifier');
var path = require('path');
var AutobotButton = require('../');
// var AutobotButton = require('autobot-button');


var autobot = new AutobotButton(new BlendMicro("Autobot Button"));

autobot.on('open', function() {
    console.log("autobot open!!");

    autobot.on("pressed", function() {
        console.log("autobot: The button was pressed!");
        notifier.notify({
          'title': 'Deploy Button',
          'message': 'The button was pressed!',
          'icon': path.join(__dirname, 'button.jpg'),
          'wait': true
        });
        notifier.on('click', function (notifierObject, options) {
            autobot.sendStatus(autobot.Status.GOOD);
        });

        notifier.on('timeout', function (notifierObject, options) {
            autobot.sendStatus(autobot.Status.WARN);
        });
    })
});

process.stdin.setEncoding("utf8");

// write data from STDIN
process.stdin.on("readable", function(){
  var chunk = process.stdin.read();
  if(chunk == null) return;
  chunk = chunk.toString().replace(/[\r\n]/g, '');
    autobot.sendStatus(autobot.Status.get(chunk));
});
