import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";
import { APILogger } from "../utils/logger";
import { createToken } from "../helpers/createToken";
//look how we import and update some value and then send that as a payload while making the post request
import articleRequestPayload from "../requests-objects/POST-article.json";

let authToken: string;
test.beforeAll("Token", async ({ api, config }) => {
  authToken = await createToken(api, config.userEmail, config.userPassword);
});

test("Create article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .header({ Authorization: authToken })
    .body(articleRequestPayload)
    .postRequest(201);

  expect(createArticleResponse.article.title).toEqual("Test Two Test1");

  const slugId = createArticleResponse.article.slug;

  console.log("slug id: " + slugId);
});

test("update payloads and make post request article", async ({ api }) => {
  //look here::
  //if we import a json file, it's inbuilt in js that, we can directly use . and nav through the json
  //like beloe and assing it to a new value and also no need to save, the rest of the
  //payload remain as it is , only this will be updated and also no need to save the file
  //as well. all handled by JS internally . BOOM feature..
  articleRequestPayload.article.title = "This is new Title";
  //however since here we are directly working on the payload
  //so what will happen is, this will updte the title for the complete payload
  //so the scope of the 'title' here is global coz we're direclty
  //updating the imported objects.

  //so what is the problem, with this approach::
  //issue is: BEST approach is , make a copy of the object in each test
  //this will seperate each object and break the global dependency
  //this way, each test is unique
  //look below test to see how we do it
  const createArticleResponse = await api
    .path("/articles")
    .header({ Authorization: authToken })
    .body(articleRequestPayload)
    .postRequest(201);

  //expect(createArticleResponse.article.title).toEqual("Test Two Test1");

  const slugId = createArticleResponse.article.slug;

  console.log("slug id: " + slugId);
});

test("update payloads BEST APPROACH", async ({ api }) => {
  //look here how we create a seperate copy of the imported file and then further update it
  const articlePayload = JSON.parse(JSON.stringify(articleRequestPayload));
  //VERY IMPORTANT above
  //..
  //one minnor thing is , it is not showing the objects (json hirerachy) here as we type .
  //how do we fix that ..?
  //mmm maybe adding a type for this constant
  //type can be added in the end as well like : const abc = val as string
  //or with this notaton as well const var : string = val

  //oh got the solution in the video itself, pls see util file: data-generator.ts...
  articlePayload.article.title = "This is new Title2";

  const createArticleResponse = await api
    .path("/articles")
    .header({ Authorization: authToken })
    .body(articlePayload)
    .postRequest(201);

  //expect(createArticleResponse.article.title).toEqual("Test Two Test1");

  const slugId = createArticleResponse.article.slug;

  console.log("slug id: " + slugId);
});
