document.addEventListener("deviceready", function() {
	
	var labPhone = $('.label-phone');
	var labEmail = $('.label-email');
	var textPhone = $('#text-phone');
	var textEmail = $('#text-email');
	
	var textPwd = $('#text-pwd');
	
	if(storage.has('data-orderid')) {
	  textPhone.val(storage.get('data-orderid'));
	}
	 
	var tabToggle = $('.tab-toggle');
	$('a',tabToggle).each(function(i,n) {
	  
	  $(n).on({
		touchstart:function() {
		  $(n).addClass('active');  
	    },
	    touchend:function() {
		 $(n).removeClass('active');
	    },
	    click:function() {
		 $('.active',tabToggle).removeClass('active');
		 $(n).addClass('active');
		 
		 if(i==0) {
 			 labPhone.show();
			 textPhone.show().addClass('check-input');
			 labEmail.hide();
			 textEmail.hide().removeClass('check-input');
	     }else {
 			 labPhone.hide();
			 textPhone.hide().removeClass('check-input');
			 labEmail.show();
			 textEmail.show().addClass('check-input');
		 }
		 
	    }	  
	  });	
		
	});
	
	
	//登录
	$('#lnk-login').click(function() {
	  location.href = 'login.html';
	});
	
	
	//注册
	$('#btn-reg').click(function() {
 	  if(!checkNetwork(true)) return false;
 	  var checked = true;
	  $('.check-input').each(function(i,n) {
 		   if(!checked) return false;
	     
		   $(n).checkValue({
	         unMatch:function(err) { 
	           a.showToast(err);
			   checked = false;
			 }
	       });
		  
	  });
	   
	  if(checked) {
		
		var nickName = storage.has('data-nickname') ? storage.get('data-nickname') : '';
		var passport = $('.check-input').eq(0).val();
		var password = textPwd.val();		
		
		a.showLoading('注册','正在注册，请稍后...');
 		$.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=MemberAdd&Nickname='+ nickName +'&PassWord='+ password +'&Passport='+ passport +'&jsoncallback=?',function(json){
  		  if(json.success > 0) {
		 	
			if($('.check-input').attr('texttype')=='phone'){
			  storage.set('data-passport-phone',true).save();
			}
			
		    storage.set('data-passport',passport).set('data-uid',json.success).save();
			a.showToast('注册成功！');
 			
			setTimeout(function() {
 			  location.href = 'login.html';
			},2000);
			
		  } else if(json.success==-1) {
			  a.showToast('对不起，您的账号已被注册，请检查后重新注册，谢谢！');
		  } else if (json.success==0) {
			  a.showToast('注册失败，请重新尝试！');
		  }
		  
		  a.closeLoading();
	    });
		  
	  }
	  
	});
	
	
	$('header .back a').click(function() {
	  a.closeAppPage('false');
    });
	
	 //go back 
    document.addEventListener('backbutton',function() {
	  if(!backbuttonState())  return;
	  a.closeAppPage('false');
    }, false);
	
},false);