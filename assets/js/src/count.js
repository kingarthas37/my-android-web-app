document.addEventListener('deviceready', function() {
  
  var resultArr = []; 
  var results = storage.get('cur-results');
  var resultCount = 0;
  var resultIndex = storage.get('result-index');
 
  $('.person-count').text(storage.get('result-count'));
   
  //get result
  $.each(results,function(i,n) {
	resultCount += n[3];  
  });
  
  $.each(results,function(i,n) {
	  var result = (storage.get('count-score') == 1 ? '（得分：'+ storage.get('theme-point') +'）': '') + n[2];
	  result = result.replace(/<[^>]+>/g,'');
	  if(result.length >=100) {
	     result = result.substring(0,100);
		 result += '...';
	  }
	   
   	  resultArr.push({"value":n[3]/resultCount*100,"label":result,"url":false});
   });
   
   //create pie
   $('#chart-pie').showFdChart({
	  type:'pie',
 	  showValue:true,
	  data:{
  	   'count':resultCount,
 	   'values':resultArr
	  }
  });
  
  //event
  $('.btn-restart').click(function() {
	  location.href = 'detail.html';
  });
  
  $('.btn-back,header .back a').click(function() {
	 navigator.app.backHistory();
  });
  
   //go back 
  document.addEventListener('backbutton',function() { 
	
	if(!backbuttonState()) {
		    return;	 
		 }
	
	location.href = 'result.html';
  }, false);
  	
},false);