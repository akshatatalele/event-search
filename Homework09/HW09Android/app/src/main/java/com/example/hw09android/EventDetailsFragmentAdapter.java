package com.example.hw09android;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class EventDetailsFragmentAdapter extends FragmentStateAdapter {

    public EventDetailsFragmentAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position)
        {
            case 1 :
                return new ArtistInfo_Fragment();
            case 2 :
                return new VenueInfo_Fragment();
        }

        return new EventInfo_Fragment();
    }

    @Override
    public int getItemCount() {
        return 3;
    }
}
