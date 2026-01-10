import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";
import { APILogger } from "../utils/logger";
import { createToken } from "../helpers/createToken";
import articleRequestPayload from "../requests-objects/POST-article.json";

//import faker for random data generatr.. we can use ton's of lib tbh based on our use cases
//this is just one of them
import { faker } from "@faker-js/faker";

let authToken: string;
test.beforeAll("Token", async ({ api, config }) => {
  authToken = await createToken(api, config.userEmail, config.userPassword);
});

test("Test Data Generation", async ({ api }) => {
  const articlePayload = JSON.parse(JSON.stringify(articleRequestPayload));

  //faker have diff options.. so we can use this method for title..
  articlePayload.article.title = faker.lorem.sentences(3);
  console.log("new payload is: " + articlePayload);

  const createArticleResponse = await api
    .path("/articles")
    .header({ Authorization: authToken })
    .body(articlePayload)
    .postRequest(201);

  //expect(createArticleResponse.article.title).toEqual("Test Two Test1");

  const slugId = createArticleResponse.article.slug;

  console.log("slug id: " + slugId);
});
