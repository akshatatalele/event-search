package com.example.hw09android;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class SearchFravoriteFragmentAdapter extends FragmentStateAdapter {

    public SearchFravoriteFragmentAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position)
        {
            case 1 :
                return new Favorites_Fragments();
        }

        return new SearchForm_Fragment();
    }

    @Override
    public int getItemCount() {
        return 2;
    }
}
