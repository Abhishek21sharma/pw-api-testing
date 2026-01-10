import { test, expect, request } from "@playwright/test";

test("get test tags", async ({ request }) => {
  const res = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags"
  );

  const tagRes = await res.json();

  expect(res.status()).toEqual(200);

  expect(tagRes.tags[0]).toEqual("Test");

  expect(tagRes.tags.length).toBeLessThanOrEqual(10);

  console.log(await res.json());
  console.log(JSON.stringify(await res.json()));
});

test("post request", async ({ request }) => {
  //post needs a body as well
  const tokenRes = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: { user: { email: "Abhi21sharma@test.com", password: "abhi@test" } },
    }
  );

  const tokenResJSON = await tokenRes.json();

  const token = tokenResJSON.user.token;
  //console.log(tokenResJSON.user.token);

  //creating new article --> it needs token in header
  await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      title: "Article 1",
      description: "Nothing ",
      body: "Hey! this is my test article",
      tagList: [],
    },
    headers: {
      //Authorization: `Token ${token}`,
      Authorization: token,
    },
  });
});
