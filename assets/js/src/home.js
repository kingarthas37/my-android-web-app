document.addEventListener("deviceready", function() {
   
  /* home page ui*/
  var winHeight = $(global).height();
  $('.swipe').height(winHeight-275);
  $('.slider-item a').height((winHeight-275)/3-15);
  
  var tagPos = ((winHeight-275)/3-15-56)/2;
  if(tagPos > 0) {
    $('.slider-item i').css('margin-top',tagPos);
  }
  
  $('.logo').click(function() {
	var ref = window.open('http://wap.findoout.com', '_system', 'location=no');
  });
  
  var sliderPage = $('.slider-page');
  var slider = new TouchSlider({
    id:'slider',
	auto:-1,
	before:function(i) { 
	  $('.cur',sliderPage).removeClass('cur');
	  $('span',sliderPage).eq(i).addClass('cur');
	}
  });
  
  $('.top-news a').on({
	click:function() {
	  storage.set('cur-tid',$(this).attr('data-tid')).save();
      a.newActivity('theme.html');
	},
	touchstart:function() { $(this).addClass('active'); },
	touchend:function() { $(this).removeClass('active'); }  
  });
  
  $('.slider-item span a').on({
	touchstart:function() { $(this).addClass('active'); },
	touchend:function() { $(this).removeClass('active'); }  
  });
  
   /* home page ui*/
   
   
  //top nav cur class
  storage.set('cur-list-type',0).save();
   var topNav = $('.top-nav');
   $('a',topNav).each(function(i,n) {
 	    $(n).click(function() {
		  if(i==0) {
 	        location.href = 'home.html';
		  }else {
		    storage.set('cur-list-type',i).save();
			storage.remove('cur-tag').remove('cur-tag-name').save();
		    location.href = 'list.html';
	 	  }
		});
    });
   
   
   
  /* tag */
   //tag标签
  var tags=[],tagsFilter=[];
  
  //tag事件处理
  $('.slider-item a').click(function() {
    storage.set('cur-tag',$(this).attr('data-tag')).set('cur-tag-name',$('em',this).text()).save();
 	location.href = 'list.html';
  });
  
  //生成tag count
  function createTagCount(tags){
    $.each(tags,function(i,n) {  
      if(!tagsFilter[n]) tagsFilter[n]=0;
	    tagsFilter[n]++;
	  });
	  //填充tag count
	  $('.slider-item span').each(function(i,n) {
	    $('b',n).text(tagsFilter[i]);  
	  });
  }
 /* tag */
  
  
  //database
  try {
      var db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);
	  db.transaction(function (tx) {
	    tx.executeSql('SELECT tag FROM '+dbset.tb_test,[],function(tx,result){
 		  for(var i=0;i<result.rows.length;i++) {
			//tag
			var _tag = result.rows.item(i).tag;
			var tag = _tag.substring(1,_tag.length-1);
			tag = tag.split('|');
			var newTag = [];
			$.each(tag,function(i,n){
			  newTag.push(n-9);	
			});
		    tags = $.merge(tags,newTag);
 		  }
		  
	      //生成tag count
		  createTagCount(tags);
 		  
        });
	  });
  }catch(e) {}
  
  
    //exit 
    document.addEventListener('backbutton',function() {
		
		 if(!backbuttonState()) {
		    return;	 
		 }
		
		 navigator.notification.confirm(
		   '确认要退出吗？', 
		   function(button) { 
		     if(button==2){
		       navigator.app.exitApp(); 
		     }
		   },  
           '提醒',        
           '取消,确认');
	}, false);
  
},false);