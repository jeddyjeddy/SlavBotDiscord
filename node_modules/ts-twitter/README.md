# TS Twitter [![Build Status](https://travis-ci.org/Nepomuceno/ts-twitter.svg?branch=master)](https://travis-ci.org/Nepomuceno/ts-twitter)

An oppinionated twitter library for query (in the future interact) with twitter

```typescript
import { Twitter } from "ts-twitter";

let twitter = new Twitter(
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET
);

twitter.getUserTimeline({ screen_name: "gbico" })
  .then(tweets => {
    console.info(tweets);
});

twitter.searchTweets({ q: "@gbico" })
    .then(function (t) {
    console.info(t);
})
    .catch(function (e) {
    console.info(e);
});
```

## Installation

```sh
npm install ts-twitter --save
yarn add ts-twitter
```

## Goals

The goal fot this app it is to implment all the call that you can do with application only in twitter. ( Because honestly no one should be requiring oAuth 1.0a still today but the oAuth 2.0 protocol of twitter works only with Application only authentication)

According to twitter [this](https://developer.twitter.com/en/docs/basics/authentication/overview/application-only) it is what should and whould not be possible with this Auth, the item stiked out are not implemented yet by this library:

### Your app will be able to, for example

- Pull user timelines;
- ~~Access friends and followers of any account;~~
- ~~Access lists resources;~~
- Search in Tweets;
- Retrieve any user information;

### And it will not be able to

- Post Tweets or other resources;
- Connect to Streaming endpoints;
- Search for users;
- Use any geo endpoint;
- Access Direct Messages or account credentials;

## Contributing

### Generating new version

```bash
npm version patch -m "Version %s - {your version annotation}"
git push origin master --tags
npm publish
```
