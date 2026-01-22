import { test, expect, request } from "@playwright/test";
import { validateHeaderName } from "node:http";
import { validateSchema } from "../utils/schema-validator";

test("schema validator", async ({ page, request }) => {
  const res = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags"
  );

  await validateSchema("tags", "GET_tags", await res.json());
});
