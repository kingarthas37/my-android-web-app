document.addEventListener("deviceready", function() {
	
 	
	var loginPanel = $('.login-panel');
	var noLoginPanel = $('.no-login-panel');
	
	var textPassport = $('#text-passport');
	var textPwd = $('#text-pwd');
 
	
	var user = $('#user');
	
	//显示是否已登录;
	if(storage.has('data-passport')) {
 	  loginPanel.show();
	  user.text(storage.get('data-passport'));
	  
	  //如果有返回需要登录记录则返回
	  if(storage.has('backpage')) {
	 	var backPage  = storage.get('backpage');
		setTimeout(function() {
		 	storage.remove('backpage').save();
			a.closeAppPage('true');    
 		},3000);
	  }
	  
	}else {
	  noLoginPanel.show();
	}
	
	//登录
	$('#btn-login').click(function() {
	  
	  if(!checkNetwork(true)) return false;
	  
 	  var checked = true;
	  $('.check-input').each(function(i,n) {
 		  if(!checked) return false;
		  if(n.value=='') {
			a.showToast('请输入'+ n.title);
			checked = false;  
		  }
	  });
	   
	  if(checked) {
		var passport = textPassport.val();
		var password = textPwd.val();
		
		a.showLoading('登录','正在登录，请稍后...');
		
  		$.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=Login&PassWord='+ password +'&Passport='+ passport +'&jsoncallback=?',function(json){
   		  if(json.success > 0) {
			 storage.set('data-passport',passport).set('data-uid',json.success).save();
			 a.showToast('登录成功！');
			 setTimeout(function() {
		  	   location.href= 'login.html';
			 },2000);
		  } else if(json.success==-1) {
			  a.showToast('您输入的账号或密码有误，请重新输入');
		  } else if (json.success==0) {
			  a.showToast('登录失败，请重新尝试');
		  }
		  
		  a.closeLoading();
		  
	    });
	  }
	  
	});
	
	
	//注册用户
	$('#lnk-reg').click(function() {
		location.href = 'reg.html';
	});
	
	//注销登录
	 $('#btn-unlogin').click(function() {
	  	storage.remove('data-passport').remove('data-passport-phone').save();
		a.showToast('您已注销账户，感谢您的支持！');
		$(this).off();
		setTimeout(function() { 
		  a.closeAppPage('true');
		},2000);
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