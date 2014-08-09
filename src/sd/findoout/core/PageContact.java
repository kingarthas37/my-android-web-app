package sd.findoout.core;

import org.apache.cordova.DroidGap;
import android.app.ProgressDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.baidu.mobstat.StatService;

public class PageContact extends DroidGap
{
  private Handler handler = new Handler();
  private ProgressDialog loading;

  public void onCreate(Bundle paramBundle)
  {
    super.onCreate(paramBundle);
    super.init();
    this.appView.addJavascriptInterface(new AndroidBridge(), "android");
    this.appView.loadUrl("file:///android_asset/contact.html");
  }
  
  private class AndroidBridge
  { 
 
	  
	  
	  @SuppressWarnings("unused")
	   	public void newActivity(final String arg) {
	   		  handler.post(new Runnable(){
	   			public void run() {
	   			  startActivityForResult(new Intent(PageContact.this,PageAccount.class),0);
	   			}
	   		  });
	   	}
	  
	  @SuppressWarnings("unused")
	  public void goSms(final String arg) {
		handler.post(new Runnable(){
		  public void run() {
		  
			    Uri uri = Uri.parse("smsto:");    
                Intent intent = new Intent(Intent.ACTION_SENDTO,uri); 
                intent.putExtra("sms_body", arg);
                startActivity(intent);    
			  
		  /*Intent it = new Intent(Intent.ACTION_VIEW);     
		  it.putExtra("sms_body", arg);     
		  it.setType("text/plain");     
		  startActivity(it);
		  */
	     }
	   });
	 }    
	
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
   			  loading = ProgressDialog.show(PageContact.this, arg1, arg2, true, false);  
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
  }
  
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
	  switch (resultCode) {  
	   case RESULT_OK:
		 appView.loadUrl("javascript:reloadPage()");  
	   break;
	  default:
	   break;
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