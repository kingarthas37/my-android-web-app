 
var fdChartObj = {};
var global = $(window);
 
$.fn.showFdChart = function(options) {
	
   var settings = $.extend({
	container:this,
    type:'line',
	width:'100%',
	height:200,
	active:true,
	animate:true,
	showValue:false,
	showType:false,
	resize:true,
	bgColor:'#efefef',
	colors:['#2f6e97','#e32c00','#e49400','#587b45','#88b5b8','#4572a7','#aa4643','#89a54e','#71588f','#4198af','#db843d','#93a9cf','#d19392','#b9cd96','#a99bbd'],
	baseColor:'#ddd',
	data:'/statics/plugins/fdchart/datas/data-line.js',
	initSize:0,
	callback:function() {}
   },options || {});
 
  var container = settings.container;
  
  container.addClass('chart-'+settings.type).css('background',settings.bgColor);
  
  var index = $('.fd-chart').index(this);
  var datas;
    
         if(typeof(settings.data)=='string') {
          $.getJSON(settings.data, function(data){
			datas = data[0];
		    startCanvas();
          });
        }else {
		  datas = settings.data;
          startCanvas();
        }
 
	
  function startCanvas() {
	  
	var w = settings.width =='100%' ? container.width() : settings.width;
    var h = settings.height =='100%' ? container.parent().height() : settings.height;
	
	container.css({
	  'background-image':'none',
	  width:w,
	  height:h
    });
	
	fdChartObj[index] = {
	  datas:datas,
	  settings:settings
	}
  
	 initFdPieChart(index,w,h);
   
  }
   
  
  return this;
}


var initFdPieChart = function(chartIndex,stageWidth,stageHeight,update) {
  
  var datas = fdChartObj[chartIndex].datas;
  var settings = fdChartObj[chartIndex].settings;
  var container = settings.container;
   	 
  var stage,labelContainer,titleContainer,tipContainer,YaxisLabelWidth,XaxisSpace;
  //var percentage = datas.percentage ? '% ' : ' ';
  var percentage = '%';
  
 // var _data = JSON.parse(storage.getItem(shenduThemeData));
  var _resultIndex = storage.has('result-index') ? storage.get('result-index') : 0;
   
  if(update) {
	  
    stage = fdChartObj[chartIndex].stage;
    stage.setSize(stageWidth,stageHeight);
    stage.removeChildren();

    labelContainer = $('.label-container',container);
	titleContainer = $('.title-container',container);
	tipContainer = $('.tip-container',container);
		 
  }else {
	 
    var stage = new Kinetic.Stage({
      container: container[0].id,
      width: stageWidth,
      height: stageHeight
	});
	
	fdChartObj[chartIndex].stage = stage;
	
	labelContainer = $('<div class="label-container"></div>').prependTo(container);
	titleContainer = $('<div class="title-container"></div>').appendTo(labelContainer);
	tipContainer = $('<div class="tip-container"></div>').appendTo(labelContainer);
 
  }
 
  initBase();
  initChart();
 
  //initBase
  function initBase() {
	  //draw title 
	  $.each(datas.values,function(i,n) {
		var color = getColor(i);
		if(!update && i==_resultIndex) {
	      titleContainer[0].innerHTML += '<span>&nbsp;<em style="background-color:'+color+'"></em><b data-color="'+color+'">您选择的结果</b></span>';
		}
	  });
	}
	

	function initChart() {
		
      var chartLayer = new Kinetic.Layer({id:'chartLayer'});
	  
	  var groupArr = [];
 
       var radius = stageHeight/2-20;

      $.each(datas.values,function(i,n) {
		  
        var color = getColor(i);
		
		groupArr.push(new Kinetic.Group({id:'group-'+i,alpha:0}));
		
		var startAngle = 0;
		var endAngle = 3.6*datas.values[0].value;
		
		if(i>0)  {
		    for(var index=1;index<=i;index++) {
		      startAngle += 3.6*(datas.values[index-1].value);
		      endAngle += 3.6*datas.values[index].value;
		    }
		  }
 
	    if(settings.showValue) {   
	      
	  	  var lineX1 =  stageWidth/2+Math.cos(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*radius;
	      var lineY1 = stageHeight/2 + 10+Math.sin(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*radius;
		  var lineX2 = stageWidth/2+Math.cos(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*(radius+5);
		  var lineY2 = stageHeight/2 + 10+Math.sin(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*(radius+5);
		  var lineX3 = lineX2+25*(lineX1>stageWidth/2 ? 1: -1);
		  
		  var pieX = Math.cos(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*5;
		  var pieY = Math.sin(Math.PI/180*(endAngle - (endAngle-startAngle)/2))*5;
			   
		  groupArr[i].add(new Kinetic.Line({
		    id:'line-'+i,
            points:[lineX1,lineY1,lineX2,lineY2,lineX3,lineY2],
            stroke:color,
            strokeWidth:1,
			alpha:1
          }));
		  
		   //tip start
		   var tip; 
		   if(!update) {
		     tip = $('<div class="tip tip-'+i+'">'+Math.round(n.value)+ percentage +'</div>').appendTo(labelContainer);
		   }else {
			 tip = $('.tip-'+i,labelContainer);
		   }
		   var lineYTip = lineY2 - 8;
		   var lineXTip = lineX2 + (lineX1>stageWidth/2 ? 30 : -(tip.width()+30));
		   tip.css({
		     left:lineXTip,
		     top:lineYTip
	       });
		   //tip end   
		 }
		 
		  //draw pie start
		  var pie = new Kinetic.Shape({
			drawFunc:function() {
			  var context = this.getContext();
			  context.beginPath();
		      context.moveTo(stageWidth/2,stageHeight/2+10);
		      context.arc(stageWidth/2,stageHeight/2+10,radius,startAngle*Math.PI/180,endAngle*Math.PI/180);
		      context.closePath();
		      this.stroke();
		      this.fill();
			},
			fill:color,
			alpha:(settings.active ? 0.6 : 1),
			stroke:color,
			strokeWidth: 1 
		  });
		  
		  if(settings.active) {

		    pie.on('click',function() {
		      if(typeof(n.url)=='string') {
			     
		     }else {
			    settings.callback(i,n.value);
			 }
		    }); 
			
			pie.on('touchstart',function() {
			container.addClass('pointer');
		 
		pie.transitionTo({
	      alpha:1,
		  x:pieX,
		  y:pieY,
	      duration:0.2,
	      easing:'ease-in-out'
	    });
		 
		tipContainer.html(Math.round(n.value) + percentage + ' ' + n.label).css({
		  'background':color,
		  'display':'block'
		});
 	  
	  });
	
		  pie.on('touchend',function() {
			container.removeClass('pointer');
			 
		pie.transitionTo({
	      alpha:0.6,
		  x:0,
		  y:0,
	      duration:0.2,
	      easing:'ease-in-out'
	    });
			 
			setTimeout(function() { tipContainer.hide(); },2000);
		  });
	
	 //	    var offsetX = container.offset().left;
		//    var offsetY = container.offset().top;
	 	    container.bind({
			  'touchmove':function(e) {
			    if(tipContainer.css('display')=='block') {
			      tipContainer.css({
					  top:0,
					  left:0
		       //     top:getTipPosY(e.pageY - offsetY,tipContainer.data('tipHeight')),
		         //   left:getTipPosX(e.pageX - offsetX,tipContainer.data('tipWidth'))
		          });
			    }
			  }
		    });
			  
		  }
		  groupArr[i].add(pie);
		  chartLayer.add(groupArr[i]);
		  //draw pie end
		  
		  
		  // animate start
	  if(settings.animate && !update) { 
	  if(settings.showValue) {
	 	  var values = $('.tip',container).hide();
		}
	  
	  setTimeout(function() {	 
		groupArr[i].transitionTo({
	      alpha:1,
	      duration:0.5,
	      easing:'ease-in-out'
	    });
		
		if(settings.showValue) {
			   values.fadeIn(500);
			}
		 },i*100);
	  }else {
		  groupArr[i].attrs.alpha=1;
	  }
		 
	  });
	    
	  stage.add(chartLayer);	

	}
	

	/* functions */
	function getTipPosX(x,tipWidth) {
 	  if(x > stageWidth - tipWidth) {
		return x - tipWidth + 10;  
	  }
	  return x+15;	
	}
	
	function getTipPosY(y,tipHeight) { 
	  if(y > stageHeight - tipHeight)
	    return stageHeight - tipHeight;
	  return y;	
	}
	
 
	function getColor(i) {
	  if(i>=settings.colors.length)
		return settings.colors[i%settings.colors.length];
	  return settings.colors[i];
	}
	
}