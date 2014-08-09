document.addEventListener("deviceready", function() {
   
	//database tb_user topnum
	try {
	  var db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);  
 	  
	    db.transaction(function (tx) { 
	      tx.executeSql('CREATE TABLE IF NOT EXISTS download (id unique,topnum INTEGER)',[],function(tx,result){
		    tx.executeSql('INSERT INTO download (topnum) VALUES ('+ topnum +')');
	      });
	    });
	 
		db.transaction(function (tx) { 
	      tx.executeSql('select topnum from download',[],function(tx,result){
		    topnum = result.rows.item(0).topnum;
 	      });
	    });
	  
	}catch(e) {}
	
	
	var downloadList = $('.download-list');
	 
	var btnDownload = $('#btn-download').click(function() {
	 
		var btn = $(this);
 		
		if(!checkNetwork(true)) return false;
	 	
		//如果没有登录，跳转至登录
		if(!storage.has('data-passport')) {
		  navigator.notification.confirm(
		       '只有注册用登录户才能进行下载操作，是否马上注册或登录？', 
		       function(button) {  
		        if(button==2){
				   storage.set('backpage','download.html').save();
		           a.newActivity('login.html');
		         }
		       },  
               '提醒','否,是');
		  return false;
		}
		
		downloadList.empty();
		
		var uid = storage.has('data-uid') ? storage.get('data-uid') : '';
 		var cid = storage.has('uuid') ? storage.get('uuid') : '';
		
 	  	a.showLoading('下载','正在下载，请稍后...');
		
  		$.getJSON('http://'+ siteUrl + '/qiaohu/android.aspx?action=Download&topnum='+topnum+'&uid='+uid+'&cid='+ cid +'&jsoncallback=?',function(data){
	 
		 if(data.success==0) {
			a.showToast('下载失败，请稍后再试！');
		 }else if(data.success==-1) {
			setTimeout(function() {
			  a.showToast('您已下载完全部的题库，我们会每期更新测试题，请持续关注我们！');
			  btnDownload.addClass('disabled').attr('disabled',true);
			  $('.btn').after('<p class="c-gray t-c">暂无更新！</p>');
			},1000);
		 }else {
		    var db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);  
		    db.transaction(function (tx) { 
			  $.each(data.success,function(i,n) {
				
 				tx.executeSql('select tid from '+ dbset.tb_test + ' where tid='+n.tid,[],function(tx,result){
		 		  if(result.rows.length == 0) {
				    tx.executeSql('INSERT INTO '+ dbset.tb_test +' (tid,recommend,title,tag,tagstate,countscore,resultcount,detail,themes,results) VALUES ('+n.tid+','+n.recommend+',"'+n.title+'","'+n.tag+'",'+n.tagstate+','+ n.countscore +','+ n.resultcount +',"'+ n.detail +'","'+ n.themes +'","'+ n.results +'")');
				  }else {
				    tx.executeSql('update ' + dbset.tb_test + ' set tid='+n.tid + ',recommend='+n.recommend+',title='+n.title + ',tag='+n.tag + ',tagstate=' + n.tagstate + ',countscore='+ n.countscore + ',resultcount=' + n.resultcount + ',detail=' + n.detail +',themes=' + n.themes + ',results=' + n.results + ' where tid='+n.tid);
				  }
			    });
				
				setTimeout(function() { 
				  downloadList.append('<li class="theme-title">已下载：'+ n.title +'</li>');
				},200*(i+1));
		 	 
              });
	        });
			
		    setTimeout(function() {
		      a.showToast('下载完成，本次共更新'+ $('li',downloadList).length +'道测试题，您可在最新测试题列表中查看！');
		    },1100);
			
			topnum = parseInt(topnum)+5;
			db.transaction(function (tx) {
			  tx.executeSql('update download set topnum='+ topnum + ' where topnum='+(topnum-5));
			});
			 
		 }
		 
		 setTimeout(function() {
		   a.closeLoading();
		 },1000);
 		  
	   });
		
	});
	 
	$('header .back a').click(function() {
 	  location.href = 'home.html';
    });
	
	 //go back 
    document.addEventListener('backbutton',function() {
	   if(!backbuttonState())  return false;
	   location.href = 'home.html';
	}, false);
	
},false);