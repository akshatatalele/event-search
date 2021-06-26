package com.example.hw09android;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.text.Html;
import android.text.method.LinkMovementMethod;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

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
    String myStr;

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
        System.out.println("OnCreate EventDetailsActivity - EventInfo");
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_event_info_, container, false);
        System.out.println("OnCreateView EventDetailsActivity - EventInfo");

        setEventInfoOnFragment();
//        LinearLayout artistLinearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Artists);
//        TextView artistView = view.findViewById(R.id.ID_ED_Artist_Value);
//        artistView.setText("Maroon 5");
////        artistLinearLayout.setVisibility(view.GONE);
//        TextView venueView = view.findViewById(R.id.ID_ED_Venue_Value);
//        venueView.setText("Banc California Stadium");

        return view;
    }

    public void setEventInfoOnFragment(){
        Bundle bundle = getArguments();
        if (bundle != null){
            myStr = bundle.getString("response");
        }
        System.out.println("Response in Event fragment: " + myStr);
        TextView errorTextView = view.findViewById(R.id.ID_ED_Error_TextView);
        LinearLayout linearLayoutMain = view.findViewById(R.id.ID_EventDetails_LinearLayout);

        try {
            JSONObject jObject = new JSONObject(myStr);
            if (jObject.has("error")){
                //API call failed
                errorTextView.setText("API call failed");
                errorTextView.setVisibility(View.VISIBLE);
                linearLayoutMain.setVisibility(View.GONE);
            }else{
                JSONObject eventInfo = new JSONObject(jObject.getString("Event Info"));
            /*Iterator<?> keys = eventInfo.keys();
            while( keys.hasNext() ){
                if(keys.next().equals("error")){
                    System.out.println("Failed to get event details");
                    errorTextView.setVisibility(View.VISIBLE);
                    linearLayoutMain.setVisibility(View.GONE);
                    break;
                }
            }*/
                if (eventInfo.has("error")){
                    System.out.println("Failed to get event details");
                    errorTextView.setText("Failed to get event details");
                    errorTextView.setVisibility(View.VISIBLE);
                    linearLayoutMain.setVisibility(View.GONE);
                }else{
                    errorTextView.setVisibility(View.GONE);
                    linearLayoutMain.setVisibility(View.VISIBLE);
                    if (eventInfo.getString("Artist / Team").equals("")){
                        LinearLayout artistLinearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Artists);
                        artistLinearLayout.setVisibility(view.GONE);
                    }else{
                        TextView artistView = view.findViewById(R.id.ID_ED_Artist_Value);
                        artistView.setText(eventInfo.getString("Artist / Team"));
                    }

                    if (eventInfo.getString("Venue").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Venue);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        TextView textView = view.findViewById(R.id.ID_ED_Venue_Value);
                        textView.setText(eventInfo.getString("Venue"));
                    }

                    if (eventInfo.getString("Date").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Date);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        TextView textView = view.findViewById(R.id.ID_ED_Date_Value);
                        textView.setText(eventInfo.getString("Date"));
                    }

                    if (eventInfo.getString("Genres").equals("")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_Category);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        TextView textView = view.findViewById(R.id.ID_ED_Category_Value);
                        textView.setText(eventInfo.getString("Genres"));
                    }

                    if (eventInfo.getString("Price Ranges").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_PriceRange);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        TextView textView = view.findViewById(R.id.ID_ED_PriceRange_Value);
                        textView.setText(eventInfo.getString("Price Ranges"));
                    }

                    if (eventInfo.getString("Ticket Status").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_TicketStatus);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        TextView textView = view.findViewById(R.id.ID_ED_TicketStatus_Value);
                        textView.setText(eventInfo.getString("Ticket Status"));
                    }

                    if (eventInfo.getString("Buy Ticket At").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_BuyTicketAt);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        String html = "<a href = '" + eventInfo.getString("Buy Ticket At") + "'>Buy Ticket At</a>";
                        TextView textView = view.findViewById(R.id.ID_ED_BuyTicketAt_Value);
                        textView.setClickable(true);
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                            textView.setText(Html.fromHtml(html, Html.FROM_HTML_MODE_COMPACT));
                        }else{
                            textView.setText(Html.fromHtml(html));
                        }
                        textView.setMovementMethod(LinkMovementMethod.getInstance());
                        textView.setLinkTextColor(Color.BLUE);
                    }

                    if (eventInfo.getString("Seatmap").equals("NoData")){
                        LinearLayout linearLayout = view.findViewById(R.id.ID_EDetails_LinearLayout_SeatMap);
                        linearLayout.setVisibility(view.GONE);
                    }else{
                        String html = "<a href = '" + eventInfo.getString("Seatmap") + "'>View Seat Map Here</a>";
                        TextView textView = view.findViewById(R.id.ID_ED_SeatMap_Value);
                        textView.setClickable(true);
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                            textView.setText(Html.fromHtml(html, Html.FROM_HTML_MODE_COMPACT));
                        }else{
                            textView.setText(Html.fromHtml(html));
                        }
                        textView.setMovementMethod(LinkMovementMethod.getInstance());
                        textView.setLinkTextColor(Color.BLUE);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


}