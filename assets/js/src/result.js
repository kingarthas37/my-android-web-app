document.addEventListener("deviceready", function() {
  
  var sn = getSN();
  
  /* star */
  var resultStar = $('.result-star');
    
  if(storage.get('count-score')==1) {
	$('.btn-count').hide();  
  }
  
  $('.point',resultStar).each(function(i,n) {
	  
	$(n).on({
	  click:function() {

		$(n).prevAll().addClass('light');
		$(n).addClass('light');
		$('a',resultStar).off();
		 
	    try {
  	      if(checkNetwork()) {
		    if(!storage.has('send-accuracy')) {
			  var uid = storage.has('data-uid') ? storage.get('data-uid') : '';
 		      var uuid = storage.get('uuid');
	  		  var tid = storage.get('cur-tid');   
	 	      $.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=AccuracyAdd&cid='+uuid+'&tid='+tid+'&uid='+ uid +'&value='+ (i+1) +'&sn='+sn+'&jsoncallback=?',function(json){
	 	        if(json.success==1) {
				  a.showToast('评价成功！');
		          storage.set('send-accuracy',(i+1)).save();
		        }
	    	  });
		    }
   	      }else {
			a.showToast('评价成功！');  
		  }
  		}catch(e) {}
		
	  }
	});
	  
  });
  
  $('.left-point',resultStar).click(function() {
	 $('.point:first',resultStar).click();
  });
  
  $('.right-point',resultStar).click(function() {
	 $('.point:last',resultStar).click();
  });
  
  
  if(storage.has('send-accuracy')) {
    for(var i=0;i<storage.get('send-accuracy');i++) {
	   $('.point',resultStar).eq(i).addClass('light');
	}
	$('a',resultStar).off();
  }
  
  
  /* result bind */
   var textResult = $('.result-content');

   var results = storage.get('cur-results');
   var themePoint = storage.get('theme-point');
   var countScore = storage.get('count-score');
   
   
	//bind result
	if(themePoint !=null && themePoint != 'undefined') {
	  $.each(results,function(i,n) {
	    if(themePoint >= n[0] && themePoint <= n[1]) {
		  textResult.html('<p>测试结果：</p>'+  (countScore == 1 ? '<p>（得分：'+ themePoint +'）</p>': '') +  n[2]);
		  storage.set('result-index',i).set('result-id',n[4]).save();
		  return false;
	    }
      });
	}
	
	
  //send json data
  try {
   if(checkNetwork()) {
	if(!storage.has('send-result')) {
		
	  var uid = storage.has('data-uid') ? storage.get('data-uid') : '';
	  var cid = storage.has('uuid') ? storage.get('uuid') : '';
	  var uuid = storage.get('uuid');
	  var tid = storage.get('cur-tid');
	  var themesid = storage.get('themesid');
	  //var score = countScore == 1 ? themePoint : 0;
	  var score = themePoint;
	  var evaluateid = storage.get('result-id');
 
	  $.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=DoQuestionAdd&cid='+uuid+'&tid='+tid+'&uid='+ uid +'&themesid='+ themesid +'&score='+ score +'&evaluateid='+ evaluateid +'&sn='+ sn +'&jsoncallback=?',function(json){ 
	  if(json.success==1) {
		   storage.set('send-result',true).save();
 	  }
	  });
	}
   }
  }catch(e) {}
  
	
  //event
  $('.btn-count').click(function() {
	 location.href = 'count.html';
  });
  
  $('.btn-restart').click(function() {
	 location.href = 'detail.html';
  });
  
   $('.btn-share').click(function() {
	  a.newActivity('contact.html');
  });
   
  
  $('.btn-back,header .back a').click(function() {
	  a.closeAppPage('false');
  });
  
  //go back 
  document.addEventListener('backbutton',function() {
	if(!backbuttonState())  return;
	a.closeAppPage('false');
  }, false);
  
  
  //sn
  function getSN() {
    var char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var vchar = '';
    for(var i=0;i<6;i++) {
	 vchar += char[parseInt(Math.random()*27)];
    }
    var date = new Date();
    var yy = date.getFullYear().toString().substring(2,4);
    var MM = getStr(date.getMonth()+1);
    var dd = getStr(date.getDate());
    var HH = getStr(date.getHours());
    var mm = getStr(date.getMinutes());
    var ss = getStr(date.getSeconds());
    var hh = getStr(HH >12 ? (HH-12) : HH);
    return (yy + MM + dd + HH + mm + ss + hh + vchar);  
  }
  
  function getStr(str) {
    return str.toString().length == 2 ? str : '0'+str;
  }
  
});