package sd.findoout.core;


import org.apache.cordova.DroidGap;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.baidu.mobstat.StatService;

public class PageTheme extends DroidGap
{
  private Handler handler = new Handler();
  private ProgressDialog loading;

  public void onCreate(Bundle paramBundle)
  {
	  super.onCreate(paramBundle);
	  super.init();
	  this.appView.addJavascriptInterface(new AndroidBridge(),"android"); 
	  this.appView.loadUrl("file:///android_asset/detail.html");
  }

  
  private class AndroidBridge
  {
 
    
    @SuppressWarnings("unused")
	public void closeAppPage(final String arg) {
		  handler.post(new Runnable(){
			public void run() {
			   finish();
		    }
		  });
	}
    
    @SuppressWarnings("unused")
   	public void showLoading(final String arg1,final String arg2) {
   		  handler.post(new Runnable(){
   			public void run() {
   			  loading = ProgressDialog.show(PageTheme.this, arg1, arg2, true, false);  
   		    }
   		  });
   	}
    
    @SuppressWarnings("unused")
   	public void closeLoading() {
   		  handler.post(new Runnable(){
   			public void run() {
   				loading.dismiss();
   		    }
   		  });
   	}
    
    @SuppressWarnings("unused")
   	public void showToast(final String arg) {
   		  handler.post(new Runnable(){
   			public void run() {
   				Toast.makeText(getApplicationContext(), arg, Toast.LENGTH_LONG).show();
   			}
   		  });
   	}
    
    @SuppressWarnings("unused")
   	public void newActivity(final String arg) {
   		  handler.post(new Runnable(){
   			public void run() {
   			 if(arg.equals("contact.html")){
   		  	   startActivity(new Intent(PageTheme.this,PageContact.class));
   			 }
   			}
   		  });
   	}
     
 
  }
 
  
  public void onPause()
  {
    super.onPause();
    StatService.onPause(this);
  }

  public void onResume()
  {
    super.onResume();
    StatService.onResume(this);
  }
}