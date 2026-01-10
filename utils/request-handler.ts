//fluent interface design
//in this approch each method returns 'this' , which is class instance itself, this after each method
//we can still have access to all other methods of the class

import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  //look carefuly , here we added a ? after baseURL since we are not initiallising it
  //and also we are not assiginig it in constructor
  //? means : // Adding '?' makes it string | undefined OR we would say as optional, it can have value Or it can not have value at same time
  //By using private baseURL?: string;,
  // TypeScript understands that it's okay for the variable to be empty
  //  until the .url() method is called.
  // This also ensures your ?? operator in getUrl() correctly falls back to the defaultBaseURL.
  private baseURL?: string; //  private baseURL: string; (before code)
  //or it can be write in this way
  //private baseURL: string | undefined; --> see no questionmark here but explicitly mentioned as undefined
  private defaultBaseURL: string;
  private apiPath: string = "";
  private queryParam: object = {};
  //private apiHeaders: options = {} ; //instead of this we can use Record<>, so that 'request' : apiHeaders will accept this
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};

  //after adding worker scope, we are updating this field
  private defaultAuthToken: string;

  private clearAuthFlag?: boolean;

  //request fixture from playwright test is of type APIRequestContext
  //it's similar to page of type Page

  //from later lectures --> updating this to handle logger as well..

  //here 4th argument is optional as it's declared already..
  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    //after adding worker scope for token.. we can add that as default param here..
    authToken: string = ""
  ) {
    this.request = request;
    this.defaultBaseURL = apiBaseUrl; //it's not hard code the defaultBaseURL..

    this.logger = logger;

    this.defaultAuthToken = authToken;
  }

  url(url: string) {
    this.baseURL = url;
    return this; //this will return the instnace of the class itself
  }

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  param(params: object) {
    this.queryParam = params;
    return this;
  }

  header(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }

  body(body: object) {
    this.apiBody = body;
    console.log(this.apiBody);
    return this;
  }

  //if we want to test some scenarios with not added clearAuth flag..

  clearAuth() {
    this.clearAuthFlag = true;
    return this;
  }
  //creating a getRequest method here.. so that we can handle all here only

  async getRequest(statusCode: number) {
    const url = this.getUrl();
    //capturing logs..
    this.logger.logRequest("GET", url, this.apiHeaders);
    const response = await this.request.get(url, {
      headers: this.apiHeaders, //headers are optional for get request sometimes..
    });

    //cleaning the fields after API call.. so that will be reset again and available for new
    //call
    this.cleanupFields();

    const actualStatus = response.status();
    const responseJSON = await response.json();

    //response logs
    this.logger.logResponse(actualStatus, responseJSON);

    //assertion below will be replaced with detailed assertions and log tracing in the reporter..
    //expect(actualStatus).toEqual(statusCode);

    this.statusCodeValidator(actualStatus, statusCode, this.getRequest);

    return responseJSON;
  }

  //need a token as well for this ..
  async postRequest(statusCode: number) {
    const url = this.getUrl();
    //post method call here
    const response = await this.request.post(url, {
      data: this.apiBody,
      headers: this.apiHeaders, //headers are optional for get request sometimes..
    });

    const responseJSON = await response.json();

    expect(response.status()).toEqual(statusCode);

    return responseJSON;
  }

  //custome method responsible to create URL

  //as part of framework design, let's convert getURl to a private method and it will be used
  //from some other method internally from this class, and let it return the
  //complete URL

  private getUrl() {
    //default class/pkg from JS file:: new URL()

    //there is this logic in JS..
    //when we use ?? (need to read about this concept) in a expresession
    //so if first value is undefined or Null, then it will use the second value

    //so, this means: if baseURL is null
    //then use defaultBaseURl
    //otherwise use the first value

    //how baseURL can be null or not defined.. ?
    //in the smokeTest.spec file: if we don't use api.url().getURL() and directly use
    //api.getURL() , so this meathod still works in that case
    const url = new URL(
      `${this.baseURL ?? this.defaultBaseURL}${this.apiPath}`
    );

    //now form query param..

    //lets findout all keys and values from this object..and use for - of loop

    //now use internal method of URL class to append each param to it
    for (const [k, v] of Object.entries(this.queryParam))
      url.searchParams.append(k, v);

    return url.toString();
  }

  //printing the error in the report..

  //create a private statuscode validator method
  //so idea is if status code doesn't match to expected
  //only then , log the details, or only then print the details..

  private statusCodeValidator(
    actualStatus: number,
    expectedStatus: number,
    callingMethod: Function
  ) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      //print something to reporter... customer errors to report...
      //these are some of error handling mechanisms ..
      const error = new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}\n\nRecent API activity \n${logs}`
      );

      //actual method which will capture the stackTrace..
      Error.captureStackTrace(error, callingMethod);
      throw error;
    }
  }

  private getHeaderS() {
    if (!this.clearAuthFlag) {
      // here || is otherwise, like else condition, looks like it's not JAva || or condition ..
      this.apiHeaders["Authorization"] =
        this.apiHeaders["Authorization"] || this.defaultAuthToken;
    }
    return this.apiHeaders;
  }

  //clean - restore the state of the data when a API request is made..

  private cleanupFields() {
    this.apiBody = {};
    this.apiHeaders = {};
    this.baseURL = undefined;
    this.apiPath = "";
    this.queryParam = {};
    this.clearAuthFlag = false;
    //now call this method at the end of each API call..
  }
}
