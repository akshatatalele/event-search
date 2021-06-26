package com.example.hw09android;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SearchForm_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SearchForm_Fragment extends Fragment implements AdapterView.OnItemSelectedListener{

    View view;
    ObjectMapper objectMapper =new ObjectMapper();
    private Handler handler;
    private AutoCompleteAdapter autoCompleteAdapter;
    AppCompatAutoCompleteTextView autoCompleteTextView;
    LocationManager locationManager;
    LocationListener locationListener;
    double currLatitude;
    double currLongitude;
    private static final int TRIGGER_AUTO_COMPLETE = 100;
    private static final long AUTO_COMPLETE_DELAY = 300;
    TextView keywordValidationTextView, locationValidationTextView, distanceTextView, otherLocationTextView;
    Spinner categorySpinner, unitsSpinner;
    RadioGroup radioGroup;
    RadioButton currLocationRadio, otherLocationRadio;
    Button searchButton, clearButton;
    Map userInput=new HashMap();

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public SearchForm_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment SearchForm_Fragment.
     */
    // TODO: Rename and change types and number of parameters
    public static SearchForm_Fragment newInstance(String param1, String param2) {
        SearchForm_Fragment fragment = new SearchForm_Fragment();
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
        view = inflater.inflate(R.layout.fragment_search_form_, container, false);
        System.out.println("Search Form Fragment: On Create View");

        locationManager = (LocationManager) this.getActivity().getSystemService(Context.LOCATION_SERVICE);
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                currLatitude = location.getLatitude();
                currLongitude = location.getLongitude();
//                System.out.println("Latitude " + currLatitude);
//                System.out.println("Longitude " + currLongitude);
            }
            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        };

        if (ContextCompat.checkSelfPermission(this.getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        } else {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
        }

        // Keyword validation text - set visible false
        keywordValidationTextView = view.findViewById(R.id.ID_SF_keywordValidation_label);
        keywordValidationTextView.setVisibility(View.GONE);

        // Other location validation text - set visible false
        locationValidationTextView = view.findViewById(R.id.ID_SF_locValidation_label);
        locationValidationTextView.setVisibility(View.GONE);

        autoCompleteTextView = view.findViewById(R.id.ID_SF_Autocomplete_textview);
        System.out.println("Keyword: " + autoCompleteTextView.getText().toString());

        autoCompleteAdapter =new AutoCompleteAdapter(this.getContext(), android.R.layout.simple_dropdown_item_1line);
//        keywordAutoCompleteTextView.setThreshold(2);
//        keywordAutoCompleteTextView.setAdapter(autoCompleteAdapter);
        autoCompleteTextView.addTextChangedListener(
                new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                    }

                    @Override
                    public void onTextChanged(CharSequence s, int start, int before, int count) {
                        System.out.println("In method Ontext change");
                        handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                        handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE,
                                AUTO_COMPLETE_DELAY);
                    }

                    @Override
                    public void afterTextChanged(Editable s) {

                    }
                }
        );

        handler = new Handler(new Handler.Callback() {
            @Override
            public boolean handleMessage(Message msg) {
                if (msg.what == TRIGGER_AUTO_COMPLETE) {
                    System.out.println("In method handleMessage change");
                    if (!TextUtils.isEmpty(autoCompleteTextView.getText())) {
                        System.out.println(autoCompleteTextView.getText().toString());
                    }
                }
                return false;
            }
        });

        //Category
        categorySpinner = view.findViewById(R.id.ID_SF_Category_spinner);
        ArrayAdapter<CharSequence> categoryAdapter = ArrayAdapter.createFromResource(this.getContext(), R.array.category_array, android.R.layout.simple_spinner_item);
        categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_item);
        categorySpinner.setAdapter(categoryAdapter);
        categorySpinner.setOnItemSelectedListener(this);

        // Distance
        distanceTextView = view.findViewById(R.id.ID_SF_Distance_edittext);

        // Units
        unitsSpinner = view.findViewById(R.id.ID_SF_Units_spinner);
        ArrayAdapter<CharSequence> distanceAdapter = ArrayAdapter.createFromResource(this.getContext(), R.array.distance_array, android.R.layout.simple_spinner_item);
        distanceAdapter.setDropDownViewResource(android.R.layout.simple_spinner_item);
        unitsSpinner.setAdapter(distanceAdapter);
        unitsSpinner.setOnItemSelectedListener(this);

        // From
        radioGroup = view.findViewById(R.id.ID_SF_location_radioGroup);
        currLocationRadio = view.findViewById(R.id.ID_SF_currLoc_radio);
        otherLocationRadio = view.findViewById(R.id.ID_SF_otherLoc_radio);

        // Other location textview
        otherLocationTextView = view.findViewById(R.id.ID_SF_otherLoc_edittext);
        otherLocationTextView.setEnabled(false);

        currLocationRadio.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        otherLocationTextView.setText("");
                        otherLocationTextView.setEnabled(false);
                        locationValidationTextView.setVisibility(View.GONE);
                    }
                }
        );

        otherLocationRadio.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        otherLocationTextView.setEnabled(true);
                    }
                }
        );

        searchButton = view.findViewById(R.id.ID_SF_search_button);

        clearButton = view.findViewById(R.id.ID_SF_clear_button);

        clearButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        clear();
                    }
        });

        searchButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        Integer keywordLen = autoCompleteTextView.getText().toString().length();
                        if (!Integer.valueOf(0).equals(keywordLen)) {
                            String keyword = autoCompleteTextView.getText().toString();
                            userInput.put("\"Keyword\"", "\""+keyword+"\"");
                        } else {
                            keywordValidationTextView.setVisibility(View.VISIBLE);
                            Toast.makeText(getActivity(), "Please fix all fields with errors", Toast.LENGTH_SHORT).show();
                        }

                        String category = categorySpinner.getSelectedItem().toString();
                        if (category != null) {
                            userInput.put("\"Category\"", "\""+category+"\"");
                        }

                        Integer distanceLength = distanceTextView.getText().toString().length();
                        if (!Integer.valueOf(0).equals(distanceLength)) {
                            userInput.put("\"Distance\"", Integer.parseInt(distanceTextView.getText().toString()));
                        } else {
                            userInput.put("\"Distance\"", 10);
                        }

                        Integer unitsLen = unitsSpinner.getSelectedItem().toString().length();
                        if (!Integer.valueOf(0).equals(unitsLen)) {
                            String units = unitsSpinner.getSelectedItem().toString();
                            if (units.equals("Miles")){
                                userInput.put("\"Units\"", "\"miles\"");
                            }else{
                                userInput.put("\"Units\"", "\"km\"");
                            }
                        }

                        if (currLocationRadio.isChecked()) {
                            userInput.put("\"radio\"", "\"\"");
                            userInput.put("\"LatLong\"", "\""+currLatitude+","+currLongitude+"\"");
                        } else if (otherLocationRadio.isChecked()) {
                            userInput.put("\"radio\"", "\"location\"");

                            Integer otherLocationLength = otherLocationTextView.getText().toString().length();
                            if (!Integer.valueOf(0).equals(otherLocationLength)) {
                                String otherLocation = otherLocationTextView.getText().toString();
                                userInput.put("\"LatLong\"", "\""+otherLocation+"\"");
                            } else {
                                locationValidationTextView.setVisibility(View.VISIBLE);
                            }
                        }

//                        if(keywordValidationTextView.getVisibility())
                        System.out.println("Request url "+ userInput.toString());
                        Intent intent = new Intent(getActivity(),EventListActivity.class);
                        intent.putExtra("searchFormInput",userInput.toString());
                        startActivity(intent);
                    }
                }
        );


        return view;
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        String string = parent.getItemAtPosition(position).toString();
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    public void clear() {
        keywordValidationTextView.setVisibility(View.GONE);
        locationValidationTextView.setVisibility(View.GONE);
        autoCompleteTextView.setText("");
        categorySpinner.setSelection(0);
        distanceTextView.setText("");
        currLocationRadio.setChecked(true);
        otherLocationTextView.setText("");
        otherLocationTextView.setEnabled(false);
    }
}