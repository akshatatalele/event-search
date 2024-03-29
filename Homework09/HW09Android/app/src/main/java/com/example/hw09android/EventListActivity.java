package com.example.hw09android;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.text.Html;
import android.view.View;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

public class EventListActivity extends AppCompatActivity {

    ObjectMapper objectMapper = new ObjectMapper();
    RequestQueue requestQueue;
    List<EventTable> eventResponseList = new ArrayList<>();
    private RecyclerView eventsListRecyclerView;
    private RecyclerView.Adapter eventsListAdapter;
    private RecyclerView.LayoutManager eventsListLayoutManager;

    @Override
    protected void onRestart() {
        super.onRestart();
        setContentView(R.layout.activity_event_list);

        ActionBar actionBar;
        actionBar = getSupportActionBar();
        actionBar.setTitle(Html.fromHtml("<font color=\"black\">Event Search</font>"));

        String getEventListRequestParam = getIntent().getExtras().getString("searchFormInput");

        System.out.println("In EventListActivity OnRestart "+getEventListRequestParam);

        getEventListResponse(getEventListRequestParam);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_list);

        ActionBar actionBar;
        actionBar = getSupportActionBar();
        actionBar.setTitle(Html.fromHtml("<font color=\"black\">Search Results</font>"));

        final Drawable upArrow = getResources().getDrawable(R.drawable.baseline_arrow_back_24);
        upArrow.setColorFilter(getResources().getColor(R.color.black), PorterDuff.Mode.SRC_ATOP);
        getSupportActionBar().setHomeAsUpIndicator(upArrow);

        String getEventListRequestParam = getIntent().getExtras().getString("searchFormInput");

        System.out.println("In EventListActivity OnCreate "+getEventListRequestParam);

        getEventListResponse(getEventListRequestParam);
    }

    public void getEventListResponse(String requestParam){

        String requestURL = "https://homework08.wl.r.appspot.com/api/get-event-list/"+requestParam.replaceAll("=", ":");
        System.out.println(requestURL);
        requestQueue = Volley.newRequestQueue(EventListActivity.this);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, requestURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println("EventListActivity response: " + response);
                        try {
                            parseEventListResponse(response.toString());
                            eventsListRecyclerView = (RecyclerView) findViewById(R.id.ID_EventList_recyclerView);
                            eventsListRecyclerView.hasFixedSize();

                            eventsListLayoutManager = new LinearLayoutManager(EventListActivity.this);
                            eventsListRecyclerView.setLayoutManager(eventsListLayoutManager);

                            eventsListAdapter = new EventListRecyclerViewAdapter(eventResponseList, EventListActivity.this, "search");
                            eventsListRecyclerView.setAdapter(eventsListAdapter);
                            System.out.println("EventListActivity - END " + eventResponseList);
                        } catch (IOException | JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                        try {
                            parseEventListResponse("{\"error\":\"API call failed\"}");
                        } catch (IOException e) {
                            e.printStackTrace();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
        });



        requestQueue.add(request);
    }

    public void parseEventListResponse(String response) throws IOException, JSONException {
        eventResponseList.clear();
        HashMap<String, String> map = new HashMap<String, String>();
        JSONObject jObject = new JSONObject(response);
        TextView errorTextView = findViewById(R.id.ID_EL_error_textview);
        RecyclerView recyclerView = findViewById(R.id.ID_EventList_recyclerView);
        if (jObject.has("error")){
            if(jObject.getString("error").equals("API call failed")){
                errorTextView.setText("API call failed");
                errorTextView.setVisibility(View.VISIBLE);
                recyclerView.setVisibility(View.GONE);
            }else if(jObject.getString("error").equals("Failed to get event details")){
                errorTextView.setText("Failed to get event list");
                errorTextView.setVisibility(View.VISIBLE);
                recyclerView.setVisibility(View.GONE);
            }else if(jObject.getString("error").equals("No records")){
                errorTextView.setText("No Records");
                errorTextView.setVisibility(View.VISIBLE);
                recyclerView.setVisibility(View.GONE);
            }
        } else{
            errorTextView.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            Iterator<?> keys = jObject.keys();
            List details = new ArrayList();
            while( keys.hasNext() ){
                String value = jObject.getString((String)keys.next());
                details.add(value.toString());
            }

            for (int i = 0; i<details.size(); i++){
                JSONObject jObject1 = new JSONObject((String) details.get(i));
                EventTable eventTable = new EventTable();
                eventTable.setID(jObject1.getString("ID"));
                eventTable.setDate(jObject1.getString("Date"));
                eventTable.setName(jObject1.getString("Event"));
                eventTable.setCategory(jObject1.getString("Category"));
                eventTable.setVenue(jObject1.getString("Venue"));
                eventTable.setIsFavorite(false);

//                System.out.println("event: "+i+" "+eventTable.toString());
                eventResponseList.add(eventTable);
            }
        }
        System.out.println("event response list: "+eventResponseList);
    }
}