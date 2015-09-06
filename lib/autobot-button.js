console.log("entering autobot-button.js");

(function() {
    var AutobotButton, _, debug, events, BlendMicro, Enum,
        extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        hasProp = {}.hasOwnProperty;

    events = require('eventemitter2');

    BlendMicro = require('blendmicro');

    _ = require('lodash');

    debug = require('debug')('autobot-button');

    Enum = require('enum');

    module.exports = AutobotButton = (function(superClass) {

        extend(AutobotButton, superClass);

        function AutobotButton(bm) {
            debug("entering AutobotButton.");
            this.bm = bm;

            this.Status = new Enum(["GOOD", "WARN", "ERROR", "INFO", "UNKNOWN"]);

            var autobotSelf = this;

            this.bm.on('open', function() {
                debug("blendmicro in autobot open!!");
                autobotSelf.emit("open");

                debug(autobotSelf.bm);

                autobotSelf.bm.on("data", function(data) {
                    autobotSelf.emit("pressed");
                });
            });

            this.bm.on('close', function(){
                debug('close!!');
                autobotSelf.emit("close");
            });

        }

        AutobotButton.prototype.sendStatus = function(status) {
            debug("Sending status: "+ (status == undefined ? "undefined" : status.toString()));
            var data = '7';
            switch(status) {
                case this.Status.GOOD:
                    data = '2';
                    break;
                case this.Status.WARN:
                    data = '3';
                    break;
                case this.Status.ERROR:
                    data = '4';
                    break;
                case this.Status.INFO:
                    data = '5';
                    break;
                default:
                    debug("Unknown autobot status: " + status);
            }
            debug("Sending status data: "+ data);
            this.bm.write(data);
        };

        AutobotButton.prototype.testPattern = function() {
            this.bm.write('c');
        };

        return AutobotButton;
    })(events.EventEmitter2);

}).call(this);