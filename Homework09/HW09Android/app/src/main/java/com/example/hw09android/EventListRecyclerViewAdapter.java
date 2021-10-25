package com.example.hw09android;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.squareup.picasso.Picasso;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

public class EventListRecyclerViewAdapter extends RecyclerView.Adapter<EventListRecyclerViewAdapter.ViewHolder> {

    RequestQueue requestQueue;
    ObjectMapper objectMapper = new ObjectMapper();
    List<EventTable> eventTableList;
    Context context;
    String listType;
    View view;

    public EventListRecyclerViewAdapter(List<EventTable> eventTableList, Context context, String listType) {
        this.eventTableList = eventTableList;
        this.context = context;
        this.listType = listType;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.one_event_details, parent, false);
        ViewHolder eventViewHolder = new ViewHolder(view);
        return eventViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull EventListRecyclerViewAdapter.ViewHolder holder, int position) {

        holder.eventName.setText(eventTableList.get(position).Name);
        holder.eventVenue.setText(eventTableList.get(position).Venue);
        holder.eventDate.setText(eventTableList.get(position).Date);

        if(eventTableList.get(position).Category.contains("Film")){
            Glide.with(context).load(R.drawable.film_icon).into(holder.eventIcon);
        }
        else if(eventTableList.get(position).Category.contains("Arts & Theatre")){
            Glide.with(context).load(R.drawable.art_icon).into(holder.eventIcon);
        }
        else if(eventTableList.get(position).Category.contains("Sports")){
            Glide.with(context).load(R.drawable.ic_sport_icon).into(holder.eventIcon);
        }
        else if(eventTableList.get(position).Category.contains("Miscellaneous")){
            Glide.with(context).load(R.drawable.miscellaneous_icon).into(holder.eventIcon);
        }
        else if(eventTableList.get(position).Category.contains("Music")){
            Glide.with(context).load(R.drawable.music_icon).into(holder.eventIcon);
        }

        SharedPreferences sharedPreferences = context.getSharedPreferences("favorite", Context.MODE_PRIVATE);

        if(sharedPreferences.contains(eventTableList.get(position).ID)){
            eventTableList.get(position).isFavorite = true;
            holder.favoriteButton.setBackgroundResource(R.drawable.heart_fill_red);
        }else{
            eventTableList.get(position).isFavorite = false;
            holder.favoriteButton.setBackgroundResource(R.drawable.heart_outline_black);
        }

        holder.favoriteButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        SharedPreferences sharedPreferences = context.getSharedPreferences("favorite", Context.MODE_PRIVATE);
                        SharedPreferences.Editor sharedPrefChange = sharedPreferences.edit();
                        String eventToCheck = eventTableList.get(position).ID;
                        eventTableList.get(position).setIsFavorite(!eventTableList.get(position).isFavorite);

                        if (sharedPreferences.contains(eventToCheck)) {
                            holder.favoriteButton.setBackgroundResource(R.drawable.heart_outline_black);
                            sharedPrefChange.remove(eventToCheck);
                            sharedPrefChange.commit();
                            if(listType == "favorite"){
                                eventTableList.remove(position);
                            }
                            notifyDataSetChanged();

                        } else {
                            holder.favoriteButton.setBackgroundResource(R.drawable.heart_fill_red);
                            try {
                                sharedPrefChange.putString(eventToCheck, objectMapper.writeValueAsString(eventTableList.get(position)));
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                            sharedPrefChange.apply();
                        }
                    }
                }
        );

        holder.relativeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Intent intent = new Intent(context, EventDetails_Activity.class);
                try {
                    intent.putExtra("eventDetails", objectMapper.writeValueAsString(eventTableList.get(position)));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                context.startActivity(intent);
            }
        });

    }

    @Override
    public int getItemCount() {
        return eventTableList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView eventIcon ;
        TextView eventName, eventVenue, eventDate;
        RelativeLayout relativeLayout;
        ImageButton favoriteButton;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            eventIcon = itemView.findViewById(R.id.ID_EL_Icon);
            eventName = itemView.findViewById(R.id.ID_EL_Name);
            eventVenue = itemView.findViewById(R.id.ID_EL_Venue);
            eventDate = itemView.findViewById(R.id.ID_EL_Date);
            relativeLayout = itemView.findViewById(R.id.one_line_event_item_layout);
            favoriteButton = itemView.findViewById(R.id.ID_EL_Favorite_button);

        }
    }
}
