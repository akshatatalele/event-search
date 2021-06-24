package com.example.hw09android;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link EventInfo_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventInfo_Fragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    View view;
    RequestQueue requestQueue;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public EventInfo_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventInfo_Fragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventInfo_Fragment newInstance(String param1, String param2) {
        EventInfo_Fragment fragment = new EventInfo_Fragment();
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
        view = inflater.inflate(R.layout.fragment_event_info_, container, false);
        System.out.println("OnCreateView EventDetailsActivity - EventInfo");
        requestQueue = Volley.newRequestQueue(this.getContext());
        String requestURL = "https://homework08.wl.r.appspot.com/api/get-event-details/{\"id\":\"vvG1IZ4zCXpxU9\"}";

        getEventDetails(requestURL);
//        LinearLayout artistLinearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Artists);
//        TextView artistView = view.findViewById(R.id.ID_ED_Artist_Value);
//        artistView.setText("Maroon 5");
////        artistLinearLayout.setVisibility(view.GONE);
//        TextView venueView = view.findViewById(R.id.ID_ED_Venue_Value);
//        venueView.setText("Banc California Stadium");

        return view;
    }

    private void getEventDetails(String requestURL){
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, requestURL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println(response);
                    }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    error.printStackTrace();
                }
            });

        requestQueue.add(request);

    }
}