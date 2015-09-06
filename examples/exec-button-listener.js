var BlendMicro = require('blendmicro');
var notifier = require('node-notifier');
var path = require('path');
var child_process = require('child_process');
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
          'icon': path.join(__dirname, 'button.jpg')
        });

        // execFile: executes a file with the specified arguments
        child_process.execFile('bin/onPressed.sh', function(error, stdout, stderr){
            var status = stdout.toString().trim();
            console.log(status);
            autobot.sendStatus(autobot.Status.get(status));

            notifier.notify({
                'title': 'Deploy Button',
                'message': 'The job finished with a status of: ' + status,
                'icon': path.join(__dirname, 'button.jpg')
            });
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
