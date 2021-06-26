package com.example.hw09android;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.squareup.picasso.Picasso;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.List;

public class EventListRecyclerViewAdapter extends RecyclerView.Adapter<EventListRecyclerViewAdapter.ViewHolder> {

    ObjectMapper objectMapper = new ObjectMapper();
    List<EventTable> eventTableList;
    Context context;

    public EventListRecyclerViewAdapter(List<EventTable> eventTableList, Context context) {
        this.eventTableList = eventTableList;
        this.context = context;
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

        if(eventTableList.get(position).Name.length() >= 35){
            String newName = eventTableList.get(position).Name.substring(0, 32) + "...";
            holder.eventName.setText(newName);
        }else{
            holder.eventName.setText(eventTableList.get(position).Name);
        }
        holder.eventVenue.setText(eventTableList.get(position).Venue);
        holder.eventDate.setText(eventTableList.get(position).Date);
        if(eventTableList.get(position).Category.contains("Music")){
            Glide.with(context).load(R.drawable.music_icon).into(holder.eventIcon);
        }
        else if(eventTableList.get(position).Category.contains("Film")){
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

        holder.relativeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, EventDetails_Activity.class);
                try {
                    System.out.println("Event List from adapter" + eventTableList.get(position).toString());
                    intent.putExtra("eventData", objectMapper.writeValueAsString(eventTableList.get(position)));
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

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            eventIcon = itemView.findViewById(R.id.ID_EL_Icon);
            eventName = itemView.findViewById(R.id.ID_EL_Name);
            eventVenue = itemView.findViewById(R.id.ID_EL_Venue);
            eventDate = itemView.findViewById(R.id.ID_EL_Date);
            relativeLayout = itemView.findViewById(R.id.one_line_event_item_layout);
        }
    }
}
