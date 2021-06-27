package com.example.hw09android;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Favorites_Fragments#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Favorites_Fragments extends Fragment {

    ObjectMapper objectMapper = new ObjectMapper();
    List<EventTable> eventFavoriteList = new ArrayList<>();
    private RecyclerView eventsListRecyclerView;
    private RecyclerView.Adapter eventsListAdapter;
    private RecyclerView.LayoutManager eventsListLayoutManager;
    View view;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Favorites_Fragments() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Favorites_Fragments.
     */
    // TODO: Rename and change types and number of parameters
    public static Favorites_Fragments newInstance(String param1, String param2) {
        Favorites_Fragments fragment = new Favorites_Fragments();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_favorites__fragments, container, false);
        eventFavoriteList.clear();
        SharedPreferences sharedPreferences = getContext().getSharedPreferences("favorite", Context.MODE_PRIVATE);
        Map<String, ?> allEntries = sharedPreferences.getAll();
        if(allEntries.size() != 0){
            view.findViewById(R.id.ID_FL_error_textview).setVisibility(View.GONE);
            for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
                EventTable eventTable = new EventTable();
                try {
                    JSONObject jsonObject = new JSONObject((String) entry.getValue());
                    eventTable.setID(jsonObject.getString("id"));
                    eventTable.setName(jsonObject.getString("name"));
                    eventTable.setDate(jsonObject.getString("date"));
                    eventTable.setCategory(jsonObject.getString("category"));
                    eventTable.setVenue(jsonObject.getString("venue"));
                    eventTable.setIsFavorite(jsonObject.getBoolean("isFavorite"));
                    eventFavoriteList.add(eventTable);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            eventsListRecyclerView = (RecyclerView) view.findViewById(R.id.ID_FavList_recyclerView);
            eventsListRecyclerView.hasFixedSize();

            eventsListLayoutManager = new LinearLayoutManager(this.getContext());
            eventsListRecyclerView.setLayoutManager(eventsListLayoutManager);

            eventsListAdapter = new EventListRecyclerViewAdapter(eventFavoriteList, this.getContext(), "favorite");
            eventsListRecyclerView.setAdapter(eventsListAdapter);
        }else{
            view.findViewById(R.id.ID_FavList_recyclerView).setVisibility(View.GONE);
            view.findViewById(R.id.ID_FL_error_textview).setVisibility(View.VISIBLE);
        }


        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        eventFavoriteList.clear();
        SharedPreferences sharedPreferences = getContext().getSharedPreferences("favorite", Context.MODE_PRIVATE);
        Map<String, ?> allEntries = sharedPreferences.getAll();
        if(allEntries.size() != 0){
            view.findViewById(R.id.ID_FL_error_textview).setVisibility(View.GONE);
            for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
                EventTable eventTable = new EventTable();
                try {
                    JSONObject jsonObject = new JSONObject((String) entry.getValue());
                    eventTable.setID(jsonObject.getString("id"));
                    eventTable.setName(jsonObject.getString("name"));
                    eventTable.setDate(jsonObject.getString("date"));
                    eventTable.setCategory(jsonObject.getString("category"));
                    eventTable.setVenue(jsonObject.getString("venue"));
                    eventTable.setIsFavorite(jsonObject.getBoolean("isFavorite"));
                    eventFavoriteList.add(eventTable);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            eventsListRecyclerView = (RecyclerView) view.findViewById(R.id.ID_FavList_recyclerView);
            eventsListRecyclerView.hasFixedSize();

            eventsListLayoutManager = new LinearLayoutManager(this.getContext());
            eventsListRecyclerView.setLayoutManager(eventsListLayoutManager);

            eventsListAdapter = new EventListRecyclerViewAdapter(eventFavoriteList, this.getContext(), "favorite");
            eventsListRecyclerView.setAdapter(eventsListAdapter);
        }else{
            view.findViewById(R.id.ID_FavList_recyclerView).setVisibility(View.GONE);
            view.findViewById(R.id.ID_FL_error_textview).setVisibility(View.VISIBLE);
        }
    }
}