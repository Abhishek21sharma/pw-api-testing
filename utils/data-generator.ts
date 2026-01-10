import articleRequestPayload from "../requests-objects/POST-article.json";
import { faker } from "@faker-js/faker";

//look if it's a function.. how can we export it..
//so best thing about TS is we don't have to work like class and objects alwayas..
//though it's always best practices..
//but sometimes we have just config files which we want to export etc
//or just a normal function
//so always good to know how to import such in your code..

export function getRandomArticle() {
  //const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload));
  //since like above we can't see the obejcts when we press . so best is to deal with this
  //using the way defined below..

  const articleRequest = structuredClone(articleRequestPayload);
  //so now if we press . , it will show the onjects under this json..
  articleRequest.article.title = faker.lorem.sentence(3);
  articleRequest.article.description = faker.lorem.sentence(7);
  articleRequest.article.body = faker.lorem.paragraph(8);

  return articleRequest;
}
