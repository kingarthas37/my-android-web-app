document.addEventListener("deviceready", function() {
   
   var themeList = $('.theme-list ul');
   
   var more = $('.more');
   
   var loadCount = 0;  //更多加载点击累计次数，控制limit ,offset
    
   //top nav cur class
   var topNav = $('.top-nav');
   var curListType = storage.has('cur-list-type') ? storage.get('cur-list-type') : 0;
   $('a',topNav).eq(curListType).addClass('cur');
   $('a',topNav).each(function(i,n) {
	  $(n).click(function() {
  	      storage.set('cur-list-type',i).save();
		  if(i==0) {
		    location.href = 'home.html';
		  }else {
			storage.remove('cur-tag').remove('cur-tag-name').save();
		    location.href = 'list.html';
		  }
	  });
   });
   
   //cur list sql order
   var sqlOrderList = '';
   switch(curListType) {
	case 1:
 	  sqlOrderList = ' order by id desc';
	break;
	case 2:
 	  sqlOrderList = ' order by resultcount desc';
	break;   
  }
  
  //cur tag sql
  var sqlTag = storage.has('cur-tag') ? ' where tag like "%|'+ storage.get('cur-tag') +'|%"' : '';
  if(storage.has('cur-tag')) {
	$('header .text').text(storage.get('cur-tag-name'));  
  }
  
  //select theme
  try {
    db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);
  }catch(e) {}
  
  createDbList(loadCount);
  
  function createDbList(count) {
	var limit = 20;
	var offset = count*20;
	try {
		
	    db.transaction(function (tx) {
	      tx.executeSql('SELECT tid,tag,tagstate,title,resultcount FROM '+dbset.tb_test +  sqlTag + sqlOrderList +  ' limit '+limit+' offset '+offset,[],function(tx,result){
		  var row = result.rows;
		  if(row.length==0) {
		 
		      navigator.notification.confirm(
		       '测试题已全部导入，是否从云端下载最新题库？', 
		       function(button) { 
		         if(button==2){
		           location.href = 'download.html';
		         }else {
				    more.off().removeClass('loading').addClass('disabled');	 
			  	 }
		       },  
               '提醒','否,是');
			   return false;  
		  }
		  
		  for(var i=0;i<row.length;i++) { 
			  themeList.append('<li class="theme-title cf" data-tid="'+ row.item(i).tid +'"><a href="javascript:void(0)"  tag="'+ row.item(i).tagstate +'">'+ row.item(i).title +'</a><em>'+ row.item(i).resultcount +'</em></li>');
		  }
		  more.removeClass('loading');
		   
        });
	  });
		
	}catch(e) {}	  
  }
  
   
  
  themeList.delegate('li','click',function(){
    storage.set('cur-tid',$(this).attr('data-tid')).save();
    a.newActivity('theme.html');
  });
  
 
  themeList.delegate('li','touchstart',function(){
    $(this).addClass('active');
  });
  
  themeList.delegate('li','touchend',function(){
    $(this).removeClass('active');
  });
 
  
  //more click
  more.on({
    touchstart:function() { more.addClass('active'); },
	touchend:function() { more.removeClass('active'); },
	click:function() {
	   more.addClass('loading');
	  setTimeout(function() {
		 loadCount++;
         createDbList(loadCount);
	  },100);	
	}
  });
  
    //bind theme-title click
  $('header .back a').click(function() {
	  storage.set('cur-list-type',0).save();
 	  navigator.app.backHistory();
  });
 
    //go back 
    document.addEventListener('backbutton',function() {
		if(!backbuttonState())  return false;	 
	    navigator.app.backHistory();
	}, false);
  
},false);



Array.prototype.unique = function (el) { 
  for(var i=0;i<this.length;i++) {
	if(this[i]== el)
	  return false;	
  }
  this.push(el);
  return true;
}