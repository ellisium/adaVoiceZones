var spawn=require('child_process').spawn,
settings= require(__dirname+'\\settings.json'),
io = require('socket.io-client'),
adaZonesServerUrl = 'http://localhost:'+settings.adaZonesPort+'/adaZones',
hyperionScreenServerUrl = 'http://localhost:'+settings.hyperionScreenPort+'/hyperionScreen',
zones=null,
client=null;

setTimeout(function(){
  try{
    adaZonesClient = io.connect(adaZonesServerUrl);
    adaZonesClient.on('zones', function(data) {
      zones=data;
      console.log('server sent zones settings');
    });
    hyperionClient = io.connect(hyperionScreenServerUrl);
  }catch(e){
    console.log(e)
  }
},2000);

exports.action = function(params, next){

  if(params.hasOwnProperty('index')){
  var index= params.index.split('_');
  }else{
    var index=[];
    for(var i=0; i < zones.length; i++){
      index.push(i);
    }
  }

  switch(params.mode){
    case 'pass':
      var verb=null;
      if(params.off == 'true'){
        verb='setPassthruOff'
      }else{  
        verb='setPassthruOn';
      }
      for(var i=0; i<index.length; i++){
        var cmd={cmd:verb, args:[parseInt(index[i])]}
        adaZonesClient.emit('cmd', cmd, function(resp, data) {
            console.log('server sent resp code ' + resp + 'for zone'+i);
        });
      }
      var cmd={cmd:'ffmpegOff', args:[]}
      hyperionClient.emit('hyperionCmd', cmd, function(resp, data) {
        console.log('server sent setPassthru resp code ' + resp);
      });
    break;
    case 'hyperionScreen':
      var verb=null;
      if(params.off == 'true'){
        verbAdaZones='setPassthruOff';
        verbHyperion='ffmpegOff'
      }else{  
        verbAdaZones='setPassthruOn';
        verbHyperion='ffmpegOn';
      }
      for(var i=0; i<index.length; i++){
        var cmd={cmd:verbAdaZones, args:[parseInt(index[i])]}
        adaZonesClient.emit('cmd', cmd, function(resp, data) {
            console.log('server sent resp code ' + resp + 'for zone'+i);
        });
      }
      var cmd={cmd:verbHyperion, args:[]}
      hyperionClient.emit('hyperionCmd', cmd, function(resp, data) {
        console.log('server sent resp hyperionScreen code ' + resp);
      });
    break;
    case 'off':
      var verb=null;
      if(params.off == 'true'){
        verb='turnOff'
      }else{  
        verb='turnOn';
      }
      for(var i=0; i<index.length; i++){
       var cmd={cmd:verb, args:[parseInt(index[i])]}
        adaZonesClient.emit('cmd', cmd, function(resp, data) {
            console.log('server sent off resp code ' + resp+ 'for zone'+i);
        });
      }
    break;
    case 'color':
    for(var i=0; i<index.length; i++){
        if(params.hasOwnProperty('lvl')){
          var cmd={cmd:'setColor', args:[parseInt(index[i]), params.color, parseInt(params.lvl)]};
        }else{
          var cmd={cmd:'setColor', args:[parseInt(index[i]), params.color]};
        }
        adaZonesClient.emit('cmd', cmd, function(resp, data) {
          console.log('server sent color resp code ' + resp+ 'for zone'+i);
        });
    }
    break;
    case 'negate':
    for(var i=0; i<index.length; i++){
        var cmd={cmd:'negateColor', args:[parseInt(index[i])]};
        adaZonesClient.emit('cmd', cmd, function(resp, data) {
          console.log('server sent negate resp code ' + resp+ 'for zone'+i);
        });
    }
    break;
  }
  next();
}