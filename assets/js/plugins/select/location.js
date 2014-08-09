var selLocationObjNormal ={
  data:null,
  loadData:function() {}
};

$.fn.connSelLocation = function(options) {
	
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
	selLocationObjNormal.data = data[0];
	selLocationObjNormal.loadData(container);
	settings.onComplete();
  });
  
  return this;
}

 
selLocationObjNormal.loadData = function(container) {
	
	var province = $("select",container).eq(0);
	var city = $("select",container).eq(1);
	var district = $("select",container).eq(2);
	
    $.each(selLocationObjNormal.data.province,function(i,n) {
      province.append("<option value=" + n.value + ">" + n.label + "</option>");
    });
  
    province.change(function() {
      container.data('currentIndex',this.selectedIndex);
	
	  city.empty().append("<option value='0'>市</option>");
	  district.empty().append("<option value='0'>区</option>");
	
      if( container.data('currentIndex') != 0) {  
	    $.each(selLocationObjNormal.data.city[container.data('currentIndex')-1],function(i,n) {
	      city.append("<option value=" + n.value + ">" + n.label + "</option>");
	    });
	  }
	  
	  container.data('fun1')(this,this[this.selectedIndex].value);
    });
  
    city.change(function() {
  	 var index = this.selectedIndex;
	 district.empty().append("<option value='0'>区</option>");
	
     if(index != 0) {
	   $.each(selLocationObjNormal.data.district[container.data('currentIndex')-1][index-1],function(i,n) {
	     district.append("<option value=" + n.value + ">" + n.label + "</option>");
	   });
	 }
	 
	 container.data('fun2')(this,this[this.selectedIndex].value);
	 
    });
	
	district.change(function() {
      container.data('fun3')(this,this[this.selectedIndex].value);
	});
	
	if(container.data('current')) {
	  for(var i=0;i<=2;i++) {  
        $("select:eq("+ i +") option[value="+ container.data('current')[i] +"]",container)[0].selected=true;
		$("select:eq("+ i +")",container).trigger("change");
	  }
    }
}