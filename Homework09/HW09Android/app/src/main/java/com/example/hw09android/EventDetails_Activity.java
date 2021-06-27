package com.example.hw09android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class EventDetails_Activity extends AppCompatActivity {

    TabLayout tabLayout;
    ViewPager2 viewPager2;
    EventDetailsFragmentAdapter eventDetailsFragmentAdapter, adapter;
    RequestQueue requestQueue;
    ObjectMapper objectMapper = new ObjectMapper();
    EventTable eventDataModel;

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

        Intent intent = getIntent();
        String eventDataModelStr = intent.getStringExtra("eventDetails");
        System.out.println(eventDataModelStr.toString());
        try {
            eventDataModel = objectMapper.readValue(eventDataModelStr, EventTable.class);
            System.out.println(eventDataModel.ID);
            getEventDetails(eventDataModel.ID);
        } catch (IOException e) {
            e.printStackTrace();
        }

        mTopToolbar = (Toolbar) findViewById(R.id.drawer);
        setSupportActionBar(mTopToolbar);
        getSupportActionBar().setTitle(eventDataModel.Name);

        tabLayout = findViewById(R.id.ID_eventDetails_tablayout);
        viewPager2 = findViewById(R.id.ID_eventDetails_ViewPager);

//        eventDetailsFragmentAdapter = new EventDetailsFragmentAdapter(getSupportFragmentManager(), getLifecycle());
//        viewPager2.setAdapter(eventDetailsFragmentAdapter);

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

    private void getEventDetails(String id){
        System.out.println("BEFORE API CALL");
        requestQueue = Volley.newRequestQueue(this);
        String requestURL = "http://10.0.2.2:8080/api/get-event-details/{\"id\":\"" + id + "\"}";
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, requestURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Bundle bundle = new Bundle();
                        bundle.putString("response", String.valueOf(response));
                        FragmentManager fragmentManager = getSupportFragmentManager();
                        eventDetailsFragmentAdapter = new EventDetailsFragmentAdapter(fragmentManager, getLifecycle(), bundle);
                        viewPager2.setAdapter(eventDetailsFragmentAdapter);
                        System.out.println("AFTER API CALL");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                Bundle bundle = new Bundle();
                bundle.putString("response", String.valueOf("{\"error\":\"API Call Failed\"}"));
                FragmentManager fragmentManager = getSupportFragmentManager();
                eventDetailsFragmentAdapter = new EventDetailsFragmentAdapter(fragmentManager, getLifecycle(), bundle);
                viewPager2.setAdapter(eventDetailsFragmentAdapter);
            }
        });

        requestQueue.add(request);

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

        SharedPreferences sharedPreferences = this.getSharedPreferences("favorite", Context.MODE_PRIVATE);
        String eventToCheck = eventDataModel.ID;
        if (sharedPreferences.contains(eventToCheck)) {
            menu.findItem(R.id.favorite_filled).setVisible(true);
            menu.findItem(R.id.favorite_border).setVisible(false);
        }else{
            menu.findItem(R.id.favorite_filled).setVisible(false);
            menu.findItem(R.id.favorite_border).setVisible(true);
        }


        /*if (eventDataModel.isFavorite == true){
            menu.findItem(R.id.favorite_filled).setVisible(true);
            menu.findItem(R.id.favorite_border).setVisible(false);
        }
        else if (eventDataModel.isFavorite == false){
            menu.findItem(R.id.favorite_filled).setVisible(false);
            menu.findItem(R.id.favorite_border).setVisible(true);
        }*/
        return true;
    }

   @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
       SharedPreferences sharedPreferences = this.getSharedPreferences("favorite", Context.MODE_PRIVATE);
       SharedPreferences.Editor sharedPrefChange = sharedPreferences.edit();
       String eventToCheck = eventDataModel.ID;

       if (id == R.id.favorite_border) {
            menu.findItem(R.id.favorite_border).setVisible(false);
            menu.findItem(R.id.favorite_filled).setVisible(true);
           try {
               sharedPrefChange.putString(eventToCheck, eventDataModel.ID+objectMapper.writeValueAsString(eventDataModel));
               sharedPrefChange.apply();
           } catch (IOException e) {
               e.printStackTrace();
           }
            return true;
        }

        if (id == R.id.favorite_filled) {
            menu.findItem(R.id.favorite_border).setVisible(true);
            menu.findItem(R.id.favorite_filled).setVisible(false);
            sharedPrefChange.remove(eventToCheck);
            sharedPrefChange.commit();
            return true;
        }

        if (id == R.id.twitter) {
            Toast.makeText(EventDetails_Activity.this, "Twitter clicked", Toast.LENGTH_LONG).show();
            //"https://twitter.com/intent/tweet?text=Check+out+" + this.eventDetails.Name + "+located+at+" + this.eventDetails.Venue + ".&hashtags=CSCI571EventSearch"
            String twitter_url = "https://twitter.com/intent/tweet?text=Check+out+" + eventDataModel.Name + "+located+at+" + eventDataModel.Venue + ".&hashtags=CSCI571EventSearch";
            Uri uriUrl = Uri.parse(twitter_url);
            Intent launchBrowser = new Intent(Intent.ACTION_VIEW, uriUrl);
            startActivity(launchBrowser);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}