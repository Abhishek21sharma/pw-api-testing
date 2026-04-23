Trying to add some of JS/TS questions + playwright questions here...
difference between == and ===
'5' == 5 : true
'5' === 5 : false (strict type check) : mostly used in automation

How to handle asynchronius code:
using Promise (.then() and .catch() ) and most importantly using async/await in automation

What is interface and how it is different from types
Interfaces in TS is used to define the shape of object where-as
types are used to define anything (unions , primitive, object )
Interfaces can be merged , Types can not

Advantage of TS over JS :
static type, checks error at compile type only

Arrow function and how they handle 'this' : Function with shorter syntax
they don't have their own this , they inhert from parent

null vs undefined : undefined -> variable is declared but value is not assigned to it
null -> it means an empty object or no value

Promise.all() --> it takes array of promises and return a single promise that resolves when
all have resolved. Useful for firing multiple API requests simultaneously.

<<--------PLAYWRIGHT----------->>
Browser: a physical instance : Chromium, Firefox
Context: An isolated incognito session
Page: Individual tab within a context

Explain: Auto-Waiting in playwright ->
it does check for isVisible(), stable , enable before
performing actions like click and thus reduce the background noise of using 'sleep' etc

locators: they are better than selectors as they are lazy in nature and only finds the elements
when an action is called.

Important and try this use case: How to handle Multiple Tabs or Pop-Ups :
Use context.waitForEvent('page') , this will capture the new tab object.

Playwright API testing: Using 'request' from playwright/test pkg.

check how to handle authentication in playwright:
do a login once and save the authentication state in seperate json file
and call this in another project (the above one can be done just once per regression etc)

Fixtures: these are ENV pieces passed to test method like page or request fixtures. we can create
our own custom fixtures too

Framework Based:
How to handle flaky tests -> Find out the root cause of failures, page slowness or something else
add expect.poll() or increase the wait on some of pages which often fails , check the race conditions in trace viewer and use 'retries' mechanism

How to run in parallel: Use playwright.config.ts and add workers full or 4
each worker runs it in own process

How to structure playwright config to run tests in diff ENVs:
in the USE block , for baseURL add the conditional based approch and use the ENV variables
use: { baseURL: process.env.STAGING ? 'https://stg.com' : 'https://dev.com' }

How to generate the default report:
reporter: 'html' in the config file
npx playwright show-report

Visual Regression testing:
First take screenshoot of the page or let the software takes it and playwright compares it with the base Image it has in first place:
expect(page).toHaveScreenshot()

What is sharding:
A way to split a large test suite across multiple machines in CI/CD to finish execution faster.

Explain which framework or design pattern you have used:
Have used: PoM based Pattern for UI tests
Have used: fluent based Pattern for API tests (all method for a class returns the class itself using 'this' keyword)

Shadow Dom HAndling: Playwright locators penetrate Shadow DOM by default, so you don't need special handling like in Selenium.

iFrames: page.frameLocator('selector') to focus on the frame and then chain your actions.

Locator chaining: Very powerful and core principle of playwright

Playwright with Github actions:
see the official Playwright GitHub Action, install dependencies with npx playwright install --with-deps, and upload the playwright-report as an artifact

SOLID principle where we have used

What type of assertions used in the framework

where we have used Oops concepts in the framework
