const express = require('express');
const router = express.Router();
let urls = {
  WEATHER_URL_FOREST_FALLS : "https://api.darksky.net/forecast/ac1931cc0f5d341f98134f67ef9e417e/34.0877,-116.9290",
  AUTH_SERVER : "https://aaronrenfroe.com/fohoapp/shepard.php",
  UPDATE_Family_SERVER : "https://aaronrenfroe.com/fohoapp/glen.php",
  UPDATE_Meds_Test : "https://foho-app-aaronr-90.c9users.io/CT/CamperMedsTests.php",
  UPDATE_Store_Cards_Test : "http://foho-app-aaronr-90.c9users.io/CT/StoreCards.php",
  Card_Balances_URL : "https://aaronrenfroe.com/fohoapp/SCBalances.php",
  Media_Links_URL : "https://foho-app-aaronr-90.c9users.io/CT/ct_mediaLinks.php",
  Scheduled_Posts_URL :  "https://aaronrenfroe.com/fohoapp/fetch_posts.php",
  Flicker : {
    OAUTH_TOKEN : "72157677783077924-9cf86ca021e041be",
    OAUTH_SECRET : "ef00faa21b3ff0f1",
    USER_ID : "54184317%40N03",
    USERNAME : "Forest%20Home"
  }
}

router.get('/api/info', (req, res) => {
  res.send(urls);
})

module.exports = router;
/*
    // *********************************************************
    // --------------------URLS---------------------------------
    // *********************************************************
    //-----------Weather------------ // "34.0877","y":"-116.92902"
    public static let WEATHER_URL_FOREST_FALLS = "https://api.darksky.net/forecast/ac1931cc0f5d341f98134f67ef9e417e/34.0877,-116.9290"
    // ----------Login server-------
    public static let AUTH_SERVER = "https://aaronrenfroe.com/fohoapp/shepard.php"
    //public static let AUTH_SERVER = "https://foho-app-aaronr-90.c9users.io/CT/ct_athentication.php"
    
    // --------pull to update----------
    //---------Family Members and Itineraries----------
    public static let UPDATE_Family_SERVER = "https://aaronrenfroe.com/fohoapp/glen.php"
    //public static let UPDATE_Family_Test_Server = "http://foho-app-aaronr-90.c9users.io/CT/UpdateFamilyAndItineraries.php"
    
    //---------Medication Records----------
    //public static let UPDATE_Meds_Test = "https://foho-app-aaronr-90.c9users.io/CT/CamperMedsTests.php"
    public static let UPDATE_Meds_Test = "https://aaronrenfroe.com/fohoapp/CamperMeds.php"
    
    //---------Store Card Transactions----------
    //public static let UPDATE_Store_Cards_Test = "http://foho-app-aaronr-90.c9users.io/CT/StoreCards.php"
    public static let UPDATE_Store_Cards_Test = "https://aaronrenfroe.com/fohoapp/StoreCards.php"
    
    //---------Store Card Transactions----------
    public static let Card_Balances_URL = "https://aaronrenfroe.com/fohoapp/SCBalances.php"
    //public static let Card_Balances_URL = "https://foho-app-aaronr-90.c9users.io/CT/SCBalances.php"
    
    //--------- Media Links ----------
    //public static let Media_Links_URL = "https://foho-app-aaronr-90.c9users.io/CT/ct_mediaLinks.php"
    public static let Media_Links_URL = "https://aaronrenfroe.com/fohoapp/media_links.php"
    //public static let Media_Links_URL = "http://aaronrenfroe.com/fohoapp/ct_mediaLinks.php"
    //public static let Media_Links_URL = "http://aaronrenfroe.com/fohoapp/test_media_links.php"
    
    //----------BLOG JSON URL----------
    //public static let Blog_Url = "https://foho-app-aaronr-90.c9users.io/CT/get_json_fh_blog.php"
    public static let Blog_Url =  "https://aaronrenfroe.com/fohoapp/fetch_blogs.php"
    
    //----------POST JSON URL----------
    //public static let Scheduled_Posts_URL =
    public static let Scheduled_Posts_URL =  "https://aaronrenfroe.com/fohoapp/fetch_posts.php" //
    //public static let Scheduled_Posts_URL =  "https://aaronrenfroe.com/fohoapp/BrucePosts.php" // pulls all scheduled posts
    //public static let Scheduled_Posts_URL =  "https://young-forest-79599.herokuapp.com/api/posts/for"
    //public static let Scheduled_Posts_URL =  "http://localhost:3000/api/posts/for"
    
    
    // --------- Flickr API BASE-------
    
    public static let FLICKR_OAUTH_TOKEN = "72157677783077924-9cf86ca021e041be"
    public static let FLICKR_OAUTH_SECRET = "ef00faa21b3ff0f1"
    public static let FLICKR_USER_ID = "54184317%40N03"
    public static let FLICKR_USERNAME = "Forest%20Home"

    */

    