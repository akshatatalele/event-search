package com.example.hw09android;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.text.Html;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.util.Linkify;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ArtistInfo_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ArtistInfo_Fragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    String myStr;

    public ArtistInfo_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ArtistInfo_Fragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ArtistInfo_Fragment newInstance(String param1, String param2) {
        ArtistInfo_Fragment fragment = new ArtistInfo_Fragment();
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
        System.out.println("OnCreateView EventDetailsActivity - ArtistInfo");
        view = inflater.inflate(R.layout.fragment_artist_info_, container, false);

        try {
            createArtistsView();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return view;
    }

    public void createArtistsView() throws JSONException {

        Bundle bundle = getArguments();
        if (bundle != null){
            myStr = bundle.getString("response");
        }
        System.out.println("Response in Artist fragment: " + myStr);
        TextView errorTextView = view.findViewById(R.id.ID_AD_error_TextView);
        TableLayout tableLayout = view.findViewById(R.id.ID_VDetails_TableLayout);

        JSONObject jObject = new JSONObject(myStr);
        if (jObject.has("error")){
            //client side API call failed
            errorTextView.setText("API call failed");
            errorTextView.setVisibility(View.VISIBLE);
            tableLayout.setVisibility(View.GONE);
        }else{
            if(!jObject.has("Artists Info")){
                //server side api fail
                errorTextView.setText("Failed to get artist details");
                errorTextView.setVisibility(View.VISIBLE);
                tableLayout.setVisibility(View.GONE);
            }else{
                JSONObject eventInfo = new JSONObject(jObject.getString("Artists Info"));

                if (eventInfo.has("error")){
                    if (eventInfo.getString("error").equals("Failed to get artist details results")){
                        errorTextView.setText("Failed to get artist details results");
                    }else if (eventInfo.getString("error").equals("No details available")){
                        errorTextView.setText("No details available");
                    }
                    errorTextView.setVisibility(View.VISIBLE);
                    tableLayout.setVisibility(View.GONE);
                }else if (eventInfo.has("NoArtist")){
                    errorTextView.setText("No Artists");
                    errorTextView.setVisibility(View.VISIBLE);
                    tableLayout.setVisibility(View.GONE);
                }else{
                    errorTextView.setVisibility(View.GONE);
                    tableLayout.setVisibility(View.VISIBLE);
                    Iterator<String> keys = eventInfo.keys();

                    while(keys.hasNext()) {
                        String key = keys.next();
                        JSONObject artist = new JSONObject(eventInfo.getString(key));
                        if (artist.has("error")){
                            //Artists name: No details
                            TextView errortextview = new TextView(this.getContext());
                            errortextview.setText(key + ": No Details");
                            errortextview.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
                            errortextview.setTranslationX(0);

                            LinearLayout linearLayout = new LinearLayout(this.getContext());
                            linearLayout.setOrientation(LinearLayout.HORIZONTAL);
                            linearLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
                            linearLayout.addView(errortextview);

                            LinearLayout rowLinearLayout = createVerticalLinearLayout();
                            rowLinearLayout.addView(linearLayout);

                            TableRow artist1 = createTableRow();
                            artist1.addView(rowLinearLayout);

                            tableLayout.addView(artist1);

                        }else{

                            LinearLayout rowLinearLayout = createVerticalLinearLayout();

                            if(!key.equals("NoData")){
                                rowLinearLayout.addView(createHorizontalLinearLayout("Name", key));
                            }

                            if(!artist.getString("Followers").equals(0)){
                                rowLinearLayout.addView(createHorizontalLinearLayout("Followers", artist.getString("Followers")));
                            }

                            if (!artist.getString("Popularity").equals(0) ){
                                rowLinearLayout.addView(createHorizontalLinearLayout("Popularity", artist.getString("Popularity")));
                            }

                            if (!artist.getString("CheckAt").equals("")){
                                String spotifyURL = artist.getString("CheckAt");
                                rowLinearLayout.addView(createHorizontalLinearLayout("Spotify", "<a href = '" + spotifyURL + "'>Spotify</a>"));
                            }

                            TableRow artist1 = createTableRow();
                            artist1.addView(rowLinearLayout);


                            tableLayout.addView(artist1);
                        }
                        System.out.println(artist);
                    }

                }
            }
        }
    }

    public TextView createLabelTextView(String labelName){
        TextView textView = new TextView(this.getContext());
        textView.setText(labelName);
        textView.setLayoutParams(new RelativeLayout.LayoutParams(500, RelativeLayout.LayoutParams.WRAP_CONTENT));
        textView.setTranslationX(0);
        return textView;
    }

    public TextView createValueTextView(String labelName){
        TextView textView = new TextView(this.getContext());
        textView.setText(labelName);
        textView.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
        return textView;
    }

    public LinearLayout createHorizontalLinearLayout(String label, String value){
        LinearLayout linearLayout = new LinearLayout(this.getContext());
        linearLayout.setOrientation(LinearLayout.HORIZONTAL);
        linearLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
        linearLayout.addView(createLabelTextView(label));

        TextView link = new TextView(this.getContext());
        if (label == "Spotify"){

            link.setClickable(true);
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                link.setText(Html.fromHtml(value, Html.FROM_HTML_MODE_COMPACT));
            }else{
                link.setText(Html.fromHtml(value));
            }
            link.setMovementMethod(LinkMovementMethod.getInstance());
            link.setLinkTextColor(Color.BLUE);
            linearLayout.addView(link);
        }else{
            linearLayout.addView(createValueTextView(value));
        }


        return linearLayout;
    }

    public LinearLayout createVerticalLinearLayout(){
        LinearLayout linearLayout = new LinearLayout(this.getContext());
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        return linearLayout;
    }

    public TableRow createTableRow(){
        TableRow tableRow = new TableRow(this.getContext());
        tableRow.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
        return tableRow;
    }
}