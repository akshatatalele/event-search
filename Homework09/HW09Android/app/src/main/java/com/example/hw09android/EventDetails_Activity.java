package com.example.hw09android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONObject;

public class EventDetails_Activity extends AppCompatActivity {

    TabLayout tabLayout;
    ViewPager2 viewPager2;
    EventDetailsFragmentAdapter eventDetailsFragmentAdapter;
    private Toolbar mTopToolbar;
    private Menu menu;
    final int[] ICONS = new int[]{
            R.drawable.info_outline,
            R.drawable.artist,
            R.drawable.venue
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        System.out.println("OnCreate EventDetailsActivity");
        setContentView(R.layout.activity_event_details);

        mTopToolbar = (Toolbar) findViewById(R.id.drawer);
        setSupportActionBar(mTopToolbar);
        getSupportActionBar().setTitle("Event Name");

        tabLayout = findViewById(R.id.ID_eventDetails_tablayout);
        viewPager2 = findViewById(R.id.ID_eventDetails_ViewPager);

        eventDetailsFragmentAdapter = new EventDetailsFragmentAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager2.setAdapter(eventDetailsFragmentAdapter);

        tabLayout.addOnTabSelectedListener(
                new TabLayout.OnTabSelectedListener() {
                    @Override
                    public void onTabSelected(TabLayout.Tab tab) {
                        viewPager2.setCurrentItem(tab.getPosition());
                    }

                    @Override
                    public void onTabUnselected(TabLayout.Tab tab) {

                    }

                    @Override
                    public void onTabReselected(TabLayout.Tab tab) {

                    }
                }
        );

        viewPager2.registerOnPageChangeCallback(
                new ViewPager2.OnPageChangeCallback() {
                    @Override
                    public void onPageSelected(int position) {
                        tabLayout.selectTab(tabLayout.getTabAt(position));
                    }
                }
        );

        setTabIcons();

    }

    public void setTabIcons(){
        for (int i = 0; i < 3; i++){
            tabLayout.getTabAt(i).setIcon(ICONS[i]);
        }
    }

    public void setSupportActionBar(Toolbar mTopToolbar) {
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        this.menu = menu;
        menu.findItem(R.id.favorite_filled).setVisible(false);
        return true;
    }

   @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
       if (id == R.id.favorite_border) {
//            menu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.heart_fill_white));
            Toast.makeText(this, "Added to Favorites", Toast.LENGTH_SHORT).show();
            menu.findItem(R.id.favorite_border).setVisible(false);
            menu.findItem(R.id.favorite_filled).setVisible(true);
            return true;
        }
        if (id == R.id.favorite_filled) {
            Toast.makeText(EventDetails_Activity.this, "Removed from Favorites", Toast.LENGTH_LONG).show();
            menu.findItem(R.id.favorite_border).setVisible(true);
            menu.findItem(R.id.favorite_filled).setVisible(false);
            return true;
        }
        if (id == R.id.twitter) {
            Toast.makeText(EventDetails_Activity.this, "Twitter clicked", Toast.LENGTH_LONG).show();
            String url = "http://www.google.com";
            Uri uriUrl = Uri.parse(url);
            Intent launchBrowser = new Intent(Intent.ACTION_VIEW, uriUrl);
            startActivity(launchBrowser);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}