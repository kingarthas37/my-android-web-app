document.addEventListener("deviceready", function() {
	 
	 a.showLoading('加载','正在加载，请稍后...');
	 setTimeout(function() {
	   a.closeLoading();	 
	 },3000);
	 
	 var options = new ContactFindOptions();
 
	 options.multiple=true; 
     var fields = ['displayName','phoneNumbers'];
     navigator.contacts.find(fields, onSuccess, onError, options);
 
	var contactList = $('ul');
	
    function onSuccess(contacts) {  
	  a.closeLoading();
	  for (var i=0; i<contacts.length; i++) {
		if(i==0) { $('.btn').show();   }
        contactList.append('<li data-phone="'+ contacts[i].phoneNumbers[0].value +'"><input type="checkbox"/>'+ contacts[i].displayName +'</li>');
      }
	 
    }

    function onError(contactError) {
      navigator.notification.alert('读取好友列表失败！');
    }
	
	contactList.delegate('li','click',function(){
	   var ckb = $('input',this)[0];
       if(ckb.checked) {
		  $(this).removeClass('active');
		  ckb.checked = false;
	   }else {
		  $(this).addClass('active');
		  ckb.checked = true;
	   }
    });
	
	//编辑短信
	$('.lnk-sms').click(function() {
	  a.goSms('我邀请您参与测试题：'+ storage.get('cur-title') +'，点击http://wap.findoout.com/' + storage.get('cur-tid')+'/，赶快开始测试吧！');	
	});
	
	contactList.delegate(':checkbox','click',function(){
	  var li = $(this).parent();
	  if(li.hasClass('active')) {
		this.checked = true;  
	  }else {
		this.checked = false;  
	  }
     });
    
	$('.btn-share').click(function() {
	  if(!checkNetwork(true)) return false;
	  
	  if($('li.active',contactList).length==0) {
		navigator.notification.alert('请您选择至少一位好友！');
		return false;  
	  }
	  
	  var uid = storage.has('data-uid') ? storage.get('data-uid') : '';
 	  var uuid = storage.get('uuid');
	  var tid = storage.get('cur-tid');
	  
	  var phones = '';
	  var names = '';
	  $('li.active',contactList).each(function(i,n) {
	    phones += $(n).attr('data-phone') + ',';
		names += $(n).text() + ',';  
	  });
	  phones = phones.substring(0,phones.length-1);
	  phones = phones.replace(/\+86/g,'');
	  names = names.substring(0,names.length-1);
	  
 	  a.showLoading('分享','正在分享，请稍后...');
	  $.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=AppShare&tid='+ tid +'&uid='+uid+'&cid='+uuid+'&phone='+phones+'&name='+ names +'&jsoncallback=?',function(json){
		 if(json.success==1) {
			 a.showToast('分享成功！');
			 setTimeout(function() {
			   a.closeLoading();	 
			 },1000);
			 setTimeout(function() {
		  	   a.closeAppPage();
			 },2000);
		 }else {
			 a.showToast('分享失败，请重新发送！');
	     }
	  });
	  
	});
	
	var ckbBack = $('.ckb-back').click(function() {
		if(!checkNetwork(true)) return false;
		//如果没有登录，跳转至登录
		if(this.checked && !storage.has('data-passport')) {
		 
		  navigator.notification.confirm(
		       '只有注册用登录户才能进行下载操作，是否马上注册或登录？', 
		       function(button) { 
		         if(button==2){
				   storage.set('backpage','contact.html').save();
		           a.newActivity('login.html');
		         }
		       },  
               '提醒','否,是');
 		  }
		 
	});
	
	if(storage.has('data-passport')) {
	  	ckbBack.attr('checked',true);
	}
	
	
	$('header .back a').click(function() {
 	   a.closeAppPage('false');
    });
	
	 //go back 
    document.addEventListener('backbutton',function() {
	  if(!backbuttonState())  return;
	  a.closeAppPage('false');
	}, false);
	
},false);