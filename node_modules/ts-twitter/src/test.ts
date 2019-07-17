import { Twitter } from "./index";
import * as dotenv from "dotenv";
dotenv.load();

let twitter = new Twitter(
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET
);
twitter.getStatusesShow({ id: "994380549216133120", tweet_mode: "extended" })
  .then(t => {
    console.info(t);
    
  }).catch(err => console.info(err));

/*
twitter.getUserTimeline({ screen_name: "similola", exclude_replies: false, count: 3000 })
  .then(t => {
    console.log(t.length);
  }) ;

twitter.searchTweets({q:"@gbico"})
  .then(t => {
    console.info(t);
  })
  .catch(e => {
    console.info(e);
  })

  twitter.GetOAuthToken()
  .then(t => {
    console.log(t);
  });
  */
