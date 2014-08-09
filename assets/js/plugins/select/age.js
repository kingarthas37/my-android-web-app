var selAgeObjNormal ={
  data:null,
  loadData:function() {}
};

$.fn.connSelAge = function(options) {
	
  var settings = $.extend({
	data:null,
	current:null,
	onComplete:function(){},
	fun1:function() {},
	fun2:function() {},
	fun3:function() {}
  },options || {});
  
  var container = this;
  
  container.data({
    'current':settings.current,
	'currentIndex':0,
	'callBackVal':[],
	'fun1':settings.fun1,
	'fun2':settings.fun2,
	'fun3':settings.fun3
  });
  
  $.getJSON(settings.data,function(data) {
	selAgeObjNormal.data = data[0];
	selAgeObjNormal.loadData(container);
	settings.onComplete();
  });

  return this;
}


selAgeObjNormal.loadData = function(container) {
	
	var year = $("select",container).eq(0);
	var month = $("select",container).eq(1);
	var day = $("select",container).eq(2);
	
    $.each(selAgeObjNormal.data.yearNormal,function(i,n) {
        year.append("<option value=" + n + ">" + n + "</option>");
    });
	   
   year.change(function() {
	   
	  selAgeObjNormal.normalIndex =  this.selectedIndex;
	  
	  month.empty().append("<option value='0'>月</option>");
	  day.empty().append("<option value='0'>日</option>");
	  
	  if(selAgeObjNormal.normalIndex != 0) {  
	    $.each(selAgeObjNormal.data.month,function(i,n) {
	      month.append("<option value=" + n + ">" + n + "</option>");
	    });
	  }
	  
	  container.data('fun1')(this,this[this.selectedIndex].value);
	  
   });
   
      month.change(function() {
      var index = this.selectedIndex;
	
	  day.empty().append("<option value='0'>日</option>");
	
      if(index != 0) {
	    $.each(selAgeObjNormal.data.day[index-1],function(i,n) {
	      day.append("<option value=" + n + ">" + n+ "</option>");
	    });
	
	    if(index == 2 && $("option",year)[year[0].selectedIndex].value%4==0) {
	      day.append("<option value=29>29</option>");
	    }  
	  }
	  
	  container.data('fun2')(this,this[this.selectedIndex].value);
    });
	
	day.change(function() {
	  container.data('fun3')(this,this[this.selectedIndex].value);
	});
	
	if(container.data('current')) {
	  for(var i=0;i<=2;i++) {  
        $("select:eq("+ i +") option[value="+ container.data('current')[i] +"]",container)[0].selected=true;
		$("select:eq("+ i +")",container).trigger("change");
	  }
    }
   
}