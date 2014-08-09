document.addEventListener("deviceready", function() {
  
  //active event
  var themeList = $('.subject-list ul');
  themeList.delegate('li','touchstart',function() {
    $(this).addClass('active');	  
  });
  themeList.delegate('li','touchend',function() {
    $(this).removeClass('active');	  
  });
  
  /* bind data */
  //bind title
  $('h1').html(storage.get('cur-title'));
 
  //create themes
  var themes = storage.get('cur-themes');
  
  var themeCount = $('.theme-count');
  var procressBar  = $('.procress .bar');
  var themeTitle = $('h3');
  
  var themeId = 0;
  var themePoint = 0;
  var themeLen = themes.length;
  var themesid = '';  //themes id send to service all theme record
  
  var themeNextActive = true;
   
  createTheme(themeId);
  
  themeList.delegate('.item','click',function() {
	
	  var el = $(this);
   
	  if(themeNextActive) { 
	  
		themeNextActive = false;
		
	    themesid += '['+ themeTitle.attr('data-tid') +',' + el.attr('data-selectid')+','+ el.attr('data-point') +'],';
		themePoint += parseInt(el.attr('data-point'));
		var skip = parseInt(el.attr('data-skip'));
		 
	    if(skip ==0) {
		  themeId++;
		}else if(skip==-1) { 
		  themeId = themeLen;
		}else {
		  themeId = skip-1;
		}
		
	    setTimeout(function() {
		  themeNextActive = true;
		  if(themeId == themeLen) {  
			storage.set('theme-point',themePoint).set('themesid',themesid.substring(0,themesid.length-1)).save();
		    location.href = 'result.html';
		  } else {
			createTheme(themeId);
		  }
		 },200);
		 
	  }
	  
  });
  
   
  function createTheme(id) { 
	themeList.empty();
    themeCount.text(id+1 + '/' + themeLen);
    procressBar.width((id+1)/themeLen*100+'%');
    themeTitle.html(themes[id].title).attr('data-tid',themes[id].themeid);
    $.each(themes[id].theme,function(i,n) {
      themeList.append('<li><a href="javascript:void(0)" class="item" data-point="'+ n[1] +'" data-skip="' + n[2] + '" data-selectid="'+ n[3] +'">' + n[0] + '</a></li>');
    }); 
  }
  
  function backDetail() {
	  if(themeId>0) {
	   navigator.notification.confirm(
		   '您正在进行测试中，如果返回将重新开始测试，确认要返回吗？', 
		   function(button) { 
		     if(button==2){
		       navigator.app.backHistory();
		     }
		   },  
           '提醒',        
           '取消,确认');
	} else {
		navigator.app.backHistory();
	}
  }
  
  //event
  $('header .back a').click(function() {
    backDetail();  	 
  });
  
  //go back 
  document.addEventListener('backbutton',function() {
    if(!backbuttonState()) return;	 
	backDetail();
  }, false);
  	
},false);