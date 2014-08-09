document.addEventListener("deviceready", function() {
	
 	var textOrder= $('#text-order');
 	var noRegPanel = $('.no-reg-panel');
	var regPanel = $('.reg-panel');
	var orderNum = $('#order-num');	
	
	
	//显示是否已经订阅
	if(storage.has('data-orderid')) {
	  orderNum.text(storage.get('data-orderid'));
	  regPanel.show();
	}else {
	  noRegPanel.show();
	}
	
	//如果手机注册，则直接显示手机号
	if(storage.has('data-passport-phone')) {
	  textOrder.val(storage.get('data-passport'));
	}
	
    var btnOrder= $('#btn-order').click(function() {
	  if(checkNetwork(true)) {
	    textOrder.checkValue({
	      match:function() {
	 
			 var uid = storage.has('data-userid') ? storage.get('data-userid') : '';
			 var cid = storage.has('uuid') ? storage.get('uuid') : '';
			 var phone = textOrder.val();
			 
			 a.showLoading('订阅','正在订阅，请稍后...');
			 
			 $.getJSON('http://'+ siteUrl +'/qiaohu/android.aspx?action=SubscriptionAdd&uid='+uid+'&Phone='+phone+'&cid='+cid+ '&jsoncallback=?',function(json){
		 		
	 	        if(json.success==1) {
				  a.showToast('订阅成功，感谢您的支持！');
		          storage.set('data-orderid',phone).save();
				  btnOrder.off();
 			 	  setTimeout(function() { 
			 	    location.href= 'home.html';
				  },2000);
		        }else if(json.success==2) {  
				  a.showToast('您订阅的手机号已被注册，请输入新的手机号，谢谢！');
				}else {
				  a.showToast('订阅失败，请重新尝试！');
				}
				
				a.closeLoading();
				
	    	  });
			 
		  },
	      unMatch:function(err) {
	         a.showToast(err);
	      }
	    });
	  }
	});
 
	
	$('#btn-order-cancel').click(function() {
 		$.getJSON('http://'+ siteUrl +'/qiaohu/android.aspx?action=SubscriptionDel&Phone='+storage.get('data-orderid')+'&jsoncallback=?',function(json){
  		  if(json.success==1) {
		      storage.remove('data-orderid').save();
			  a.showToast('您已取消订阅，感谢您的支持！');
			  $(this).off();
			  setTimeout(function() { 
			     location.href= 'home.html';
			  },2000);
		  } else {
			a.showToast('取消订阅失败，请重新尝试！');
		  }
	    });
	});
	
	
	$('header .back a').click(function() {
 	   location.href= 'home.html';
    });
	
	 //go back 
    document.addEventListener('backbutton',function() {
	   if(!backbuttonState())  return;	 
	   location.href = 'home.html';
	}, false);
	
},false);