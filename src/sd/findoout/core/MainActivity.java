package sd.findoout.core;

import org.apache.cordova.DroidGap;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;
import android.app.ProgressDialog;
import android.content.Intent;
import android.telephony.TelephonyManager;
import java.util.UUID;
import com.baidu.mobstat.StatService;

public class MainActivity extends DroidGap
{
  private Handler handler = new Handler();
  private ProgressDialog loading;

  public void onCreate(Bundle paramBundle)
  {
    super.onCreate(paramBundle);
    super.init();
    this.appView.addJavascriptInterface(new AndroidBridge(),"android"); 
    this.appView.loadUrl("file:///android_asset/index.html");
  }

 
  private class AndroidBridge
  {
     
    @SuppressWarnings("unused")
   	public void showLoading(final String arg1,final String arg2) {
   		  handler.post(new Runnable(){
   			public void run() {
   			  loading = ProgressDialog.show(MainActivity.this, arg1, arg2, true, false);  
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
   			 if(arg.equals("theme.html")){
   			   startActivity(new Intent(MainActivity.this,PageTheme.class));
   			 } else if(arg.equals("login.html")){
   			   startActivityForResult(new Intent(MainActivity.this,PageAccount.class),0);
   			 }
   			}
   		  });
   	}
    
    @SuppressWarnings("unused")
   	public void getUuid(final String arg) {
   		  handler.post(new Runnable(){
   			public void run() {
   			TelephonyManager localTelephonyManager = (TelephonyManager)getBaseContext().getSystemService("phone");
   		    String str1 = "" + localTelephonyManager.getDeviceId();
   		    String str2 = "" +localTelephonyManager.getSimSerialNumber();
   		    String str3 = new UUID(android.provider.Settings.Secure.getString(getContentResolver(), android.provider.Settings.Secure.ANDROID_ID).hashCode(), str1.hashCode() << 32 | str2.hashCode()).toString();
   		    appView.loadUrl("javascript:getUuid('" + str3 + "')");
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