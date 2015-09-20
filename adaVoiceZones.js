var spawn=require('child_process').spawn,
settings= require(__dirname+'\\settings.json'),
io = require('socket.io-client'),
serverUrl = 'http://localhost:'+settings.port+'/adaZones',
zones=null,
client=null;

setTimeout(function(){
  try{
    client = io.connect(serverUrl);
    client.on('zones', function(data) {
      zones=data;
      console.log('server sent zones settings');
    });
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
        client.emit('cmd', cmd, function(resp, data) {
            console.log('server sent resp code ' + resp + 'for zone'+i);
        });
      }
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
        client.emit('cmd', cmd, function(resp, data) {
            console.log('server sent resp code ' + resp+ 'for zone'+i);
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
        client.emit('cmd', cmd, function(resp, data) {
          console.log('server sent resp code ' + resp+ 'for zone'+i);
        });
  	}
  	break;
  }
  next();
}
