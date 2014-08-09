document.addEventListener('deviceready', function() {
	
  //clear theme record
  //storage.remove('theme-point').remove('themesid').remove('count-score').save();
   storage.remove('send-result').remove('send-accuracy').save();
	
	var curTid = storage.get('cur-tid');
	
	var title = $('h1');
	var resultCount = $('.resultcount');
	var recommend = $('.recommend');
	var detailContent = $('.detail-box-content');
	 
	//sql detail
    try {
	  
      db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);
	  db.transaction(function (tx) {
		  
	    tx.executeSql('SELECT title,recommend,countscore,resultcount,detail,themes,results FROM '+dbset.tb_test + ' where tid='+ curTid,[],function(tx,result){
		 
		  var item = result.rows.item(0);
		  
		  if(item.countscore==1) {
		     $('.show-score').show();
			 $('.show-count').hide();
		  }
 		   
		  title.html(item.title);
		  resultCount.html(item.resultcount);
		  recommend.html(item.recommend);
		  detailContent.html(item.detail);
		   
 		  //save detail,themes,results to storage
		  storage.set('count-score',item.countscore).set('cur-title',item.title).set('result-count',item.resultcount).set('cur-themes',getThemesFormat(item.themes)).set('cur-results',getResultsFormat(item.results)).save();
		     
        });
	  });
  
  }catch(e) {}
  
  
  //event
  $('.btn-start').click(function() {
     location.href = 'theme.html';
  });
  
  $('header .back a').click(function() {
 	 navigator.app.backHistory();
  });
  
  function getThemesFormat(themes) {
    return JSON.parse(themes.replace(/\'/g,'\"'));
  }
  
  function getResultsFormat(results) {
	return JSON.parse(results.replace(/\'/g,'\"'));
  }
  
  
  $('header .back a').click(function() {
 	   a.closeAppPage('false');
    });
   
  //go back 
    document.addEventListener('backbutton',function() {
	  if(!backbuttonState()) return;	 
 	  a.closeAppPage('false');
	}, false);
  	
},false);