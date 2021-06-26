package com.example.hw09android;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class EventListRecyclerViewAdapter extends RecyclerView.Adapter<EventListRecyclerViewAdapter.ViewHolder> {

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
        holder.eventName.setText(eventTableList.get(position).Name);
        holder.eventVenue.setText(eventTableList.get(position).Venue);
        holder.eventDate.setText(eventTableList.get(position).Date);
    }

    @Override
    public int getItemCount() {
        return eventTableList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView eventIcon ;
        TextView eventName, eventVenue, eventDate;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            eventIcon = itemView.findViewById(R.id.ID_EL_Icon);
            eventName = itemView.findViewById(R.id.ID_EL_Name);
            eventVenue = itemView.findViewById(R.id.ID_EL_Venue);
            eventDate = itemView.findViewById(R.id.ID_EL_Date);
        }
    }
}
