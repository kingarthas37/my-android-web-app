$(function() {
  
  
  /* top nav control */
  var topNav = $('.top-nav');
  $('a',topNav).on({
	click:function() {
	  $('.cur',topNav).removeClass('cur');
	  $(this).addClass('cur');
	  switch($(this).index()) {
		case 0:
		 // location.href='home.html';
		break;
		case 1:
		//  location.href='list.html';
		break;
		case 2:
		//  location.href='list.html';
		break;  
	  }
	}  
  });
  /* top nav control */
  
  /* footer nav control */
  var footerNav = $('.footer-nav');
  $('a',footerNav).on({
	click:function() {
	  $('.cur',footerNav).removeClass('cur');
	  $(this).addClass('cur');
	}  
  });
  /* footer nav control */
  
 
  /* link btn active style control */
  $('.btn-tpl,a,#fbk-submit,.subject-list li').on({
	  touchstart:function() { 
		 $(this).addClass('active');  
	  },
	  touchend:function() { 
	     $(this).removeClass('active');
	  }
  });
  /* link btn active style control */
  	
});