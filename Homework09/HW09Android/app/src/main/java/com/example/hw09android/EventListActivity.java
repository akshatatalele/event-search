package com.example.hw09android;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
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
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_list);

        String getEventListRequestParam = getIntent().getExtras().getString("searchFormInput");

        System.out.println("In EventListActivity "+getEventListRequestParam);

        getEventListResponse(getEventListRequestParam);
    }

    public void getEventListResponse(String requestParam){

        String requestURL = "http://10.0.2.2:8080/api/get-event-list/"+requestParam.replaceAll("=", ":");
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

                            eventsListAdapter = new EventListRecyclerViewAdapter(eventResponseList, EventListActivity.this);
                            eventsListRecyclerView.setAdapter(eventsListAdapter);
                            System.out.println("EventListActivity - END");
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
                System.out.println(jObject1.getString("Event"));
                eventTable.setName(jObject1.getString("Event"));
                eventTable.setCategory(jObject1.getString("Category"));
                eventTable.setVenue(jObject1.getString("Venue"));
                eventTable.setIsFavorite(false);

                System.out.println(eventTable.toString());
                eventResponseList.add(eventTable);
            }
        }

    }
}