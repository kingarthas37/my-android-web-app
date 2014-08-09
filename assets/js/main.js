var global = window,storage,nav,a = global.android;

//数据库配置
var dbset = {
	name:'fd',
	tb_test:'test',
	version:'1.0',
	display_name:'findoout',
	size:10485760
  };

//  var siteUrl = '192.168.1.149:8025';
  var siteUrl = 'www.findoout.com';
 
//输入框打开状态
var openInput = false;

//下载标志位
var topnum=132;

//all
document.addEventListener("deviceready", function() {
	
  storage  = getStorage('sd');
  
  //hover control
  $('.top-nav a,.btn-tpl,header a,#fbk-submit,a.lnk').on({
	touchstart:function() {
	  $(this).addClass('active');	
	},
	touchend:function() {
	  $(this).removeClass('active');
	}	
  });
  
  //footer nav control  
  var footerNav = $('.footer-nav');
  $('a',footerNav).each(function(i,n) {
	$(n).click(function() {
		
	  if(!$(n).hasClass('cur')) {
	
		switch(i) {
		  case 0:
		    location.href = 'home.html';
 		  break;
		  
		  case 1:
		    location.href = 'download.html';
		  break;
		  
		  case 2:
		    location.href = 'order.html';
		  break;
		  
		  case 3:
		    a.newActivity('login.html');
		  break;	
		}
	  
	  }
	});
  });
  
   
  
   
  
  //feedback
  var fbkText = '输入您的意见及建议';
  var fbkInput = $('#fbk-input').on({
	focus:function() {
	  if(this.value == fbkText) {
		this.value='';
 	  }
	},
	blur:function() {
	  if(this.value=='') {
		this.value = fbkText;
 	  }
	}  
  });
  
  $('#fbk-submit').click(function() {
	  
	if(!checkNetwork(true)) return;
	  
	if(fbkInput.val()== '' || fbkInput.val()==fbkText) {
	  a.showToast('请输入您的意见及建议！');
 	}else {
	   try {
		 a.showLoading('意见反馈','正在提交，请稍后...');
         $.getJSON('http://'+ siteUrl +'/advicesubmit/ajax/default.aspx?action=Add&content=' + escape(fbkInput.val()) + '&title=[app]'+ document.title +'&jsoncallback=?',function(data) {  
		  if(data.state==1) {
		    a.showToast('提交成功，感谢您的宝贵建议！');
			fbkInput.val(fbkText);
		  } else if (data.state==0) {
			a.showToast('您提交的内容过少，请填写大于2个字符的内容！');	 
		  }else {
			a.showToast('提交失败，请检查网络后重新提交，谢谢！');	 
		  }
		  a.closeLoading();
		});
	   }catch(e) {}
	}
  });
  
   
   
   //文本框焦点后点返回控制
   $('.text-tpl').on({
	 focus:function() {
	   openInput = true;	
	   $(this).addClass('active');
	 },
	 blur:function() {
	   openInput = false;
	   $(this).removeClass('active');
	 }   
   });
   
   
   $(document).ajaxError(function(){ a.closeLoading(); });
 	
},false);
  
  

//stroage操作
getStorage = function(name) {
    var ls = localStorage, lo = ls.getItem(name) || '{}';
    try {
        lo = JSON.parse(lo);
        lo = Object(lo) === lo ? lo : {};
    } catch(e) {
        lo = {};
    }
    return {  
        has: function(attr) {
            return !!lo[attr];
        },
        get: function(attr) {
            return lo[attr];
        },
        set: function(attr, val) {
            lo[attr] = val;
            return this;
        },
        remove: function(attr) {
            delete lo[attr];
            return this;
        },
        clear: function() {
            lo = {};
            return this;
        },
        save: function() {
            if(this.size() > 0) {
                ls.setItem(name, JSON.stringify(lo));
            } else {
                ls.removeItem(name);
            }
            return this;
        },
        size: function() {
            return Object.keys(lo).length;
        },
        toJSON: function() {
            var o = {}, i;
            for(i in lo) {
                o[i] = lo[i];
            }
            return o;
        },
        toString: function() {
            return JSON.stringify(lo);
        }
    };
};

 

function checkNetwork(show) {
  if(navigator.network.connection.type != 'none') {
    return true;
  }else {
    if(show) {
	  a.showToast('请连接您的网络并重试，谢谢！');
	}
    return false;	
  }
}

function backbuttonState() {
  if(openInput) {
	openInput = false;
    return false;
  }
  return true;
}

function reloadPage() {
  location.href = location.href;	  
}