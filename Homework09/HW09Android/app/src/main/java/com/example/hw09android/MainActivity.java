package com.example.hw09android;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    RequestQueue requestQueue;
    TabLayout tabLayout;
    ViewPager2 viewPager2;
    SearchFravoriteFragmentAdapter searchFravoriteFragmentAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tabLayout = findViewById(R.id.ID_SearchForm_tablayout);
        viewPager2 = findViewById(R.id.ID_SearchForm_ViewPager);

        searchFravoriteFragmentAdapter = new SearchFravoriteFragmentAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager2.setAdapter(searchFravoriteFragmentAdapter);

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
        Button btn = (Button)findViewById(R.id.button2);
        btn.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(MainActivity.this, EventDetails_Activity.class);
                        startActivity(intent);
                        requestQueue = Volley.newRequestQueue(MainActivity.this);
//                        String requestURL = "https://homework08.wl.r.appspot.com/api/get-event-details/{\"id\":\"vvG1IZ4zCXpxU9\"}";
                        String requestURL = "http://10.0.2.2:8080/api/get-event-details/{\"id\":\"vvG1IZ4zCXpxU9\"}";

                        getEventDetails(requestURL);

                    }
                }
        );
    }

    private void getEventDetails(String requestURL){
        System.out.println("BEFORE API CALL");
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, requestURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
//                        System.out.println(response);
                        System.out.println("MainActivity response: " + response);
                        // set Fragmentclass Arguments
                        EventInfo_Fragment eventInfo_fragment = new EventInfo_Fragment();
                        new Handler().post(new Runnable() {
                            public void run() {
                        FragmentTransaction fragmentTransaction = getSupportFragmentManager()
                                .beginTransaction();
                        Bundle bundle = new Bundle();
                        bundle.putString("response", String.valueOf(response));
                        eventInfo_fragment.setArguments(bundle);
                        fragmentTransaction.replace(R.id.flFragment_event, eventInfo_fragment).commitAllowingStateLoss();
                            }
                        });

                        ArtistInfo_Fragment artistInfo_fragment = new ArtistInfo_Fragment();
                        new Handler().post(new Runnable() {
                            public void run() {
                                FragmentTransaction fragmentTransaction = getSupportFragmentManager()
                                        .beginTransaction();
                                Bundle bundle = new Bundle();
                                bundle.putString("response", String.valueOf(response));
                                artistInfo_fragment.setArguments(bundle);
                                fragmentTransaction.replace(R.id.flFragment_event, artistInfo_fragment).commitAllowingStateLoss();
                            }
                        });

                        VenueInfo_Fragment venueInfo_fragment = new VenueInfo_Fragment();
                        new Handler().post(new Runnable() {
                            public void run() {
                                FragmentTransaction fragmentTransaction = getSupportFragmentManager()
                                        .beginTransaction();
                                Bundle bundle = new Bundle();
                                bundle.putString("response", String.valueOf(response));
                                venueInfo_fragment.setArguments(bundle);
                                fragmentTransaction.replace(R.id.flFragment_event, venueInfo_fragment).commitAllowingStateLoss();
                            }
                        });
                        System.out.println("AFTER API CALL");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });

        requestQueue.add(request);

    }
}