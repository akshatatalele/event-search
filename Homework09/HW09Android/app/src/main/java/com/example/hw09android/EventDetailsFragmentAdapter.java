package com.example.hw09android;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class EventDetailsFragmentAdapter extends FragmentStateAdapter {

    Bundle bundle;
    public EventDetailsFragmentAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle, Bundle bundle) {
        super(fragmentManager, lifecycle);
        this.bundle = bundle;
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        System.out.println("Create Fragment: " + position);

        switch (position)
        {
            case 1 :
                ArtistInfo_Fragment artistInfo_fragment = new ArtistInfo_Fragment();
                artistInfo_fragment.setArguments(bundle);
                return artistInfo_fragment;
            case 2 :
                VenueInfo_Fragment venueInfo_fragment = new VenueInfo_Fragment();
                venueInfo_fragment.setArguments(bundle);
                return venueInfo_fragment;
        }

        EventInfo_Fragment eventInfo_fragment = new EventInfo_Fragment();
        eventInfo_fragment.setArguments(bundle);
        return eventInfo_fragment;


    }

    @Override
    public int getItemCount() {
        return 3;
    }
}
