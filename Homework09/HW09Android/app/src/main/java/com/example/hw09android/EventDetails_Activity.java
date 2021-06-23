package com.example.hw09android;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;
import androidx.viewpager2.widget.ViewPager2;

import android.os.Bundle;

import com.google.android.material.tabs.TabLayout;

public class EventDetails_Activity extends AppCompatActivity {

    TabLayout tabLayout;
    ViewPager2 viewPager2;
    EventDetailsFragmentAdapter eventDetailsFragmentAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_details);

        tabLayout = findViewById(R.id.ID_eventDetails_tablayout);
        viewPager2 = findViewById(R.id.ID_eventDetails_ViewPager);

        eventDetailsFragmentAdapter = new EventDetailsFragmentAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager2.setAdapter(eventDetailsFragmentAdapter);

//        tabLayout.addTab(tabLayout.newTab().setText("Event"));
//        tabLayout.addTab(tabLayout.newTab().setText("Artist"));
//        tabLayout.addTab(tabLayout.newTab().setText("Venue"));

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

    }
}