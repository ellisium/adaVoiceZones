var adaZones=require('adazones');
adaZones.init('ambilight')

exports.action = function(params, next){ 
  var index= params.index.split('_');
  switch(params.mode){
  	case 'off':
  		var verb=null;
  		if(params.off == 'true'){
  			verb='turnOff'
  		}else{  
  			verb='turnOn';
  		}
  		for(var i=0; i<index.length; i++){
			adaZones[verb](parseInt(index[i]));
  		}
  	break;
  	case 'color':
		for(var i=0; i<index.length; i++){
			adaZones.setColor(parseInt(index[i]), params.color);
  		}
  	break;
  }
  next();
}