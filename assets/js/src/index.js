document.addEventListener('deviceready', function() {
 
  if(!storage.has('first-load')) {
	 
    try {	 
 
	$.getJSON('datas/data-init.js',function(data) {
  
      var db = openDatabase(dbset.name,dbset.verison,dbset.display_name,dbset.size);  
	  db.transaction(function (tx) {  
        tx.executeSql('DROP TABLE IF EXISTS '+dbset.tb_test);
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+ dbset.tb_test +' (id unique,tid INTEGER,recommend INTEGER,title TEXT,tag Text,tagstate INTEGER,countscore INTEGER,resultcount INTEGER,detail TEXT,themes TEXT,results TEXT)',[],function(tx,result){
		 
	 	 $.each(data,function(i,n) {
		   tx.executeSql('select tid from '+ dbset.tb_test + ' where tid='+n.tid,[],function(tx,result){
		     if(result.rows.length==0) {
				 
			   tx.executeSql('INSERT INTO '+ dbset.tb_test +' (tid,recommend,title,tag,tagstate,countscore,resultcount,detail,themes,results) VALUES ('+n.tid+','+n.recommend+',"'+n.title+'","'+n.tag+'",'+n.tagstate+','+ n.countscore +','+ n.resultcount +',"'+ n.detail +'","'+ n.themes +'","'+ n.results +'")');
			 }
		   });
         });
	 
		});
		
	  });
	
	//  setTimeout(function() {
	    location.href = 'home.html';
   //   },1000);
	  
	});
	
	//get uuid
	if(!storage.has('uuid')) {
	  a.getUuid('a');
	}
    
	storage.set('first-load',true).save();
	
  } catch(e) {}
	   
  }else {
    setTimeout(function() {
	  location.href = 'home.html';
	},3000);
  }
  
},false);


function getUuid(id) { 
  storage.set('uuid',id).save();
}