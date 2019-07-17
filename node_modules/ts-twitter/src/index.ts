import got from "got";
import { Tweet, IUserTimelineOptions, User, IUserLookup, TweetSearchResult, ITweetSearch } from "./interfaces";

export {
  IUserTimelineOptions,
  ITweetSearch,
  ITimelineOptions,
  IHomeTimelineOptions,
  IUserLookup,
  Tweet,
  TweetEntities,
  Hashtag,
  EntitiesMedia,
  Sizes,
  Large,
  URL,
  UserMention,
  TweetExtendedEntities,
  QuotedStatus,
  Place,
  Attributes,
  BoundingBox,
  User,
  UserEntities,
  Description,
  RetweetedStatus,
  RetweetedStatusExtendedEntities,
  Media1,
  TweetSearchResult,
  SearchMetadata,
  
} from "./interfaces";

export class Twitter {
  _twitter_api: string = "https://api.twitter.com/1.1/";
  _oauth2_url: string = "https://api.twitter.com/oauth2/token";
  client_id: string;
  client_secret: string;
  application_key?: string;
  application_secret?: string;
  access_token?: string;

  constructor(
    client_id?: string,
    client_secret?: string,
    application_key?: string,
    application_secret?: string,
    access_token?: string
  ) {
    if (!client_id) throw "Client_id must be defined";
    if (!client_secret) throw "client_secret must be defined";
    this.client_id = client_id;
    this.client_secret = client_secret;
    if (application_key) this.application_key = application_key;
    if (application_secret) this.application_secret = application_secret;
    if (access_token) {
      this.access_token = access_token;
    } else this.GetOAuthToken();
  }

  /**
   * Get any array of twwets based in an api call
   * You can pass query parameters ad the parameters argument
   * @param url
   * @param parameters
   */
  async getTweetsFromApi(url: string, parameters: any): Promise<Array<Tweet>> {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    let body = await this.getFromApi(url, parameters);

    let content: Array<Tweet> = JSON.parse(body);
    return content;
  }

  async getUserTimeline(
    parameters: IUserTimelineOptions
  ): Promise<Array<Tweet>> {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    let body = await this.getFromApi("statuses/user_timeline", parameters);

    let content: Array<Tweet> = JSON.parse(body);
    return content;
  }
  async getStatusesShow(
    parameters: any
  ): Promise<Array<Tweet>> {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    let body = await this.getFromApi("statuses/show", parameters);

    let content: Array<Tweet> = JSON.parse(body);
    return content;
  }

  async getUsersLookup(parameters: IUserLookup): Promise<Array<User>> {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    let body = await this.getFromApi("users/lookup", parameters);
    let content: Array<User> = JSON.parse(body);
    return content;
  }

  async getUser(parameters: IUserLookup): Promise<User> {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    let body = await this.getFromApi("users/show", parameters);
    let content: User = JSON.parse(body);
    return content;
  }

  async searchTweets(parameters: ITweetSearch): Promise<TweetSearchResult>
  {
    if (!this.access_token) {
      await this.GetOAuthToken();
    }
    const url = "search/tweets";
    let body = await this.getFromApi(url, parameters);
    let content: TweetSearchResult = JSON.parse(body);
    return content;
  }

  

  async GetOAuthToken(): Promise<string | undefined> {
    var userIdEncoded = Buffer.from(
      `${encodeURI(this.client_id)}:${encodeURI(this.client_secret)}`
    ).toString("base64");
    try {
      let postResult = await got.post(`${this._oauth2_url}`, {
        headers: {
          Authorization: `Basic ${userIdEncoded}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });
      this.access_token = JSON.parse(postResult.body).access_token;
      return this.access_token;
    } catch (err) {
      throw err;
    }
  }

  private async getFromApi(url: string, parameters: object): Promise<string> {
    var result = await got.get(`${this._twitter_api}${url}.json`, {
      headers: { Authorization: `Bearer ${this.access_token}` },
      query: parameters
    });
    return result.body;
  }
}
