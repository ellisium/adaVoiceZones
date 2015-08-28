var adaZones=require('adazones');
adaZones.init('ambilight')

exports.action = function(params, next){ 
  if(params.hasOwnProperty('index')){
	var index= params.index.split('_');
  }else{
  	var index=undefined;
  	for(var i=0; i < adaZones.zones.length; i++)index++;
  }

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
			if(params.hasOwnProperty('lvl')){
				adaZones.setColor(parseInt(index[i]), params.color, parseInt(params.lvl));
			}else{
				adaZones.setColor(parseInt(index[i]), params.color);
			}
  		}
  	break;
  }
  next();
}
