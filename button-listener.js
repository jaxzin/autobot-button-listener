var BlendMicro = require('blendmicro');
var notifier = require('node-notifier');
var path = require('path');

var bm = new BlendMicro("Adafruit Bluefruit LE");

bm.on('open', function(){
  console.log("open!!");

  // read data
  bm.on("data", function(data){
    console.log("The button was pressed!");
    notifier.notify({
      'title': 'Deploy Button',
      'message': 'The button was pressed!',
      'icon': path.join(__dirname, 'button.jpg'),
      'wait': true
    });
    notifier.on('click', function (notifierObject, options) {
      bm.write("2");
    });

    notifier.on('timeout', function (notifierObject, options) {
      bm.write("3");
    });
  });

});

bm.on('close', function(){
  console.log('close!!');
});

process.stdin.setEncoding("utf8");

// write data from STDIN
process.stdin.on("readable", function(){
  var chunk = process.stdin.read();
  if(chunk == null) return;
  chunk = chunk.toString().replace(/[\r\n]/g, '');
  bm.write(chunk);
});
