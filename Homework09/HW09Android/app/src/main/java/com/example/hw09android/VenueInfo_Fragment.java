package com.example.hw09android;

import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link VenueInfo_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VenueInfo_Fragment extends Fragment implements OnMapReadyCallback {

    private GoogleMap maps;
    View view;
    String myStr;
    double lat, lng;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public VenueInfo_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment VenueInfo_Fragment.
     */
    // TODO: Rename and change types and number of parameters
    public static VenueInfo_Fragment newInstance(String param1, String param2) {
        VenueInfo_Fragment fragment = new VenueInfo_Fragment();
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
        System.out.println("OnCreateView EventDetailsActivity - VenueInfo");
        view = inflater.inflate(R.layout.fragment_venue_info_, container, false);

        setVenueInfoOnFragment();

        return view;
    }

    public void setVenueInfoOnFragment(){
        Bundle bundle = getArguments();
        if (bundle != null){
            myStr = bundle.getString("response");
        }
        System.out.println("Response in Venue fragment: " + myStr);
        TextView errorTextView = view.findViewById(R.id.ID_VD_error_TextView);
        LinearLayout linearLayoutMain = view.findViewById(R.id.ID_VenueDetails_LinearLayout);

        try {
            JSONObject jObject = new JSONObject(myStr);

            if (jObject.has("error")){
                //Client side API call failed
                errorTextView.setText("API call failed");
                errorTextView.setVisibility(View.VISIBLE);
                linearLayoutMain.setVisibility(View.GONE);
            }else{
                if(!jObject.has("Venue Info")){
                    //server side api fail
                    errorTextView.setText("Failed to get venue details");
                    errorTextView.setVisibility(View.VISIBLE);
                    linearLayoutMain.setVisibility(View.GONE);
                }else{
                    JSONObject eventInfo = new JSONObject(jObject.getString("Venue Info"));
                    JSONObject venueName = new JSONObject(jObject.getString("Event Info"));

            /*Iterator<?> keys = eventInfo.keys();
            while( keys.hasNext() ){
                if(keys.next().equals("error")){
                    System.out.println("Failed to get event details");
                    if(eventInfo.getString((String) keys.next()).equals("Failed to get venue details results")){
                        errorTextView.setText("No details available");
                    }else if(eventInfo.getString((String) keys.next()).equals("No details available")){

                    }
                    errorTextView.setVisibility(View.VISIBLE);
                    linearLayoutMain.setVisibility(View.GONE);
                    break;
                }
            }*/

                    if (eventInfo.has("error")){
                        System.out.println("Failed to get event details");
                        if(eventInfo.getString("error").equals("Failed to get venue details results")){
                            errorTextView.setText("Failed to get venue details results");
                        }else if(eventInfo.getString("error").equals("No details available")){
                            errorTextView.setText("No details available");
                        }
                        errorTextView.setVisibility(View.VISIBLE);
                        linearLayoutMain.setVisibility(View.GONE);
                    }else{
                        errorTextView.setVisibility(View.GONE);
                        linearLayoutMain.setVisibility(View.VISIBLE);
                        if (venueName.getString("Venue").equals("NoData")){
                            LinearLayout artistLinearLayout = view.findViewById(R.id.ID_VDetails_Name_Category);
                            artistLinearLayout.setVisibility(view.GONE);
                        }else{
                            TextView artistView = view.findViewById(R.id.ID_VD_Name_Value);
                            artistView.setText(venueName.getString("Venue"));
                        }

                        if (eventInfo.getString("Address").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_Address_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_Address_Value);
                            textView.setText(eventInfo.getString("Address"));
                        }

                        if (eventInfo.getString("City").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_City_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_City_Value);
                            textView.setText(eventInfo.getString("City"));
                        }

                        if (eventInfo.getString("PhoneNumber").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_PhoneNumber_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_PhoneNumber_Value);
                            textView.setText(eventInfo.getString("PhoneNumber"));
                        }

                        if (eventInfo.getString("OpenHours").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_OpenHours_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_OpenHours_Value);
                            textView.setText(eventInfo.getString("OpenHours"));
                        }

                        if (eventInfo.getString("GeneralRule").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_GeneralRule_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_GeneralRule_Value);
                            textView.setText(eventInfo.getString("GeneralRule"));
                        }

                        if (eventInfo.getString("ChildRule").equals("NoData")){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_ChildRule_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            TextView textView = view.findViewById(R.id.ID_VD_ChildRule_Value);
                            textView.setText(eventInfo.getString("ChildRule"));
                        }

                        if (Double.parseDouble(eventInfo.getString("Latitude")) == 0
                                && Double.parseDouble(eventInfo.getString("Longitude")) == 0){
                            LinearLayout linearLayout = view.findViewById(R.id.ID_VDetails_map_Category);
                            linearLayout.setVisibility(view.GONE);
                        }else{
                            lat = Double.parseDouble(eventInfo.getString("Latitude"));
                            lng = Double.parseDouble(eventInfo.getString("Longitude"));
                            SupportMapFragment mapFragment = (SupportMapFragment) getChildFragmentManager()
                                    .findFragmentById(R.id.map);
                            mapFragment.getMapAsync(this);
                        }
                    }
                }
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        maps = googleMap;

        maps.getUiSettings().setZoomControlsEnabled(true);
        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(lat, lng);
        maps.addMarker(new MarkerOptions()
                .position(sydney)
                .title("Venue"));
        maps.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        float zoomLevel = 15.0f;
        maps.moveCamera(CameraUpdateFactory.newLatLngZoom(sydney, zoomLevel));
    }
}