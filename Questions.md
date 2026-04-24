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

SOLID principle where we have used:
DEsign patterns which ensures your framework doesn't become a "spaghetti" mess as it grows.

Single Responsible Principle:
The Concept: A class should have only one reason to change.
Where we use it: Instead of having one "Utility" class that handles database connections, API calls, and UI actions, we split them.
Example: Your LoginPage class should only contain locators and actions for the Login page. It should not contain logic for database cleanup or generating test data.

Open/Closed Principle:
The Concept: Software entities should be open for extension but closed for modification.
Where we use it: When creating a "Base Reporter" or "Base Test" setup.
Example: If you want to add a new type of logging (e.g., sending results to Slack), you shouldn't have to modify your core test engine code. Instead, you create a new class that extends the base reporter. You extend the functionality without modifying the original tested code.

Liskov Substitution Principle (LSP):
The Concept: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
Where we use it: In our Page Factory.
Example: If your DashboardFactory returns a BasePage, then whether it returns an AdminDashboard or a UserDashboard, the test shouldn't break. Both subclasses must strictly follow the "contract" of the parent class. If BasePage has a clickLogout() method, both subclasses must implement it in a way that doesn't crash the test.

Interface Segregation Principle (ISP)
The Concept: No client should be forced to depend on methods it does not use.
Where we use it: Using TypeScript Interfaces.
xample: Instead of one massive Actions interface that has click(), uploadFile(), and dragAndDrop(), you might have smaller interfaces. A FileUploadPage only implements the CanUpload interface. This prevents a simple Login Page from being forced to carry unnecessary "File Upload" logic it doesn't need

Dependency Inversion Principle (DIP)
The Concept: High-level modules should not depend on low-level modules. Both should depend on abstractions.
Where we use it: Playwright Fixtures.
Example: Instead of hard-coding a new LoginPage inside your test (const login = new LoginPage()), you "inject" it via Playwright fixtures.
// The test doesn't 'own' the creation of the page, it just asks for it.
test('login test', async ({ loginPage }) => {
await loginPage.doSomething();
});
This allows you to swap out the implementation of loginPage (e.g., for different environments) without ever changing the test code itself.

What type of assertions used in the framework
expect(stautusCode()).toBeEqual(200) -- api test
expect(resBody.Users.length).tobeLessThanEqualTo(10)
expect(newUserResponse.errors).not.toHaveProperty("username"); -- api test

UI assertions too:
toBeVisibl()
tobeClickable()
toHaveText()
toEqual()

where we have used Oops concepts in the framework
Encapsulation -> The test doesn't need to know the implemention of the core functionality
it just test the software. All other methods are in different helper classes/Page classes
Inheritance also used, interfaces are implemented here..
Polymorphism also used: (overloading, overridding), PageFacotry returns Dashboard irrespective of it's type being Admin or just User
"I use OOP to ensure maintainability and reusability. By using Encapsulation to hide selectors, Inheritance to share common browser actions, and Polymorphism via the Factory pattern, I create a framework where the tests are decoupled from the UI implementation. This is what allowed me to scale frameworks to hundreds of tests without them becoming a maintenance nightmare."

what framework do we have used here:
fluent one: to chain the functions()
each function will return the class itself so it's easy to chain them all

coding principles/testing principles:
SRP: (Single Responsiblity principle)
DRY principle: DOn't repeat yourself
Reusablity:
Scalable:
Keep it Simple:
Maintaince: Keep it simple so it's easy to maintain.

Factory design pattern
Imagine an application where the Dashboard looks completely different for an Admin vs. a Standard User. Instead of checking if/else inside your tests, you use a Factory to return the correct Page Object.

1..Base Interface

// pages/BasePage.ts
export interface BasePage {
expectLoaded(): Promise<void>;
}

2..The Targetted page object

// pages/AdminDashboard.ts
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboard implements BasePage {
constructor(private page: Page) {}

    async expectLoaded() {
        await expect(this.page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
    }

    async deleteUser() { /* Admin specific action */ }

}

// pages/UserDashboard.ts
export class UserDashboard implements BasePage {
constructor(private page: Page) {}

    async expectLoaded() {
        await expect(this.page.getByText('Welcome back, User')).toBeVisible();
    }

}

The PageFactory:
This is the "Consultant" level code. It centralizes the logic of "which page am I on?"

// factories/DashboardFactory.ts
import { Page } from '@playwright/test';
import { AdminDashboard } from '../pages/AdminDashboard';
import { UserDashboard } from '../pages/UserDashboard';

export class DashboardFactory {
static async getDashboard(page: Page, userRole: 'ADMIN' | 'USER') {
switch (userRole) {
case 'ADMIN':
return new AdminDashboard(page);
case 'USER':
return new UserDashboard(page);
default:
throw new Error(`Role ${userRole} is not supported`);
}
}
}

Implement in test:

import { test } from '@playwright/test';
import { DashboardFactory } from './factories/DashboardFactory';

test('Verify Dashboard for Admin', async ({ page }) => {
await page.goto('/login');
// ... perform login ...

    // Use the Factory to get the right Page Object
    const dashboard = await DashboardFactory.getDashboard(page, 'ADMIN');

    // The test doesn't care which class it is, as long as it's a Dashboard
    await dashboard.expectLoaded();

});

TestDataBuilder pattern:
The Test Data Builder pattern is a "Consultant-level" design pattern used to create complex test data objects using a Fluent Interface (method chaining).

The Problem: The "Big Constructor"
Without a builder, creating a user for a test looks like this:

// Hard to read, hard to maintain
const user = new User("John", "Doe", "john@example.com", "Admin", true, "London", "UK");

The Solution: Test Data Builder
The builder allows you to specify only what matters for the current test, using defaults for everything else.

The Data Model:
export interface UserData {
firstName: string;
lastName: string;
email: string;
role: string;
isActive: boolean;
}

Builder class:

export class UserBuilder {
// Default values (The "Standard" user)
private user: UserData = {
firstName: 'Default',
lastName: 'User',
email: `test-${Math.random()}@squarcle.com`,
role: 'Standard',
isActive: true
};

    withAdminRole() {
        this.user.role = 'Admin';
        return this; // Returns 'this' for method chaining
    }

    withCustomEmail(email: string) {
        this.user.email = email;
        return this;
    }

    build(): UserData {
        return this.user;
    }

}

Implementation:

test('Admin user can access settings', async ({ page }) => {
// Fluent interface: Only specify what matters for THIS test
const adminUser = new UserBuilder()
.withAdminRole()
.withCustomEmail('manager@squarcle.com')
.build();

    await loginPage.login(adminUser);
    // ... assertions ...

});

"How do you handle complex test data dependencies in Playwright?"
Answers:
"I implement the Test Data Builder pattern. It allows me to use a fluent API to construct data objects with sensible defaults. This keeps my test scripts clean because I only define the attributes relevant to the specific test scenario. It also makes the framework more resilient to changes in the data model, as I only need to update the builder class rather than every individual test case."

Real world scenario for the same:

The Workflow:
Build: Create the data object using the UserBuilder.
Inject: Use an API POST request to create that user in the database.
UI Action: Navigate the browser directly to the login page to use that new user.

test('fast login with API setup', async ({ request, page }) => {
// 1. Create data object
const newUser = new UserBuilder().withAdminRole().build();

    // 2. Inject via API (Bypassing the UI for setup)
    await request.post('/api/users', { data: newUser });

    // 3. Perform the actual UI test
    await page.goto('/login');
    await page.fill('#user', newUser.email);
    // ...

});

Promises<> in TS:
A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.
It exists in one of three states:
Pending: Initial state, neither fulfilled nor rejected.
Fulfilled (Resolved): The operation completed successfully.
Rejected: The operation failed (e.g., a timeout or a 404 error).
// Explicitly defining a Promise that returns a string
const myCustomWait = (timeout: number): Promise<string> => {
return new Promise((resolve, reject) => {
// The Promise starts in the PENDING state here

    if (timeout < 0) {
      // Transition to REJECTED state
      reject(new Error("Timeout cannot be negative"));
    }

    setTimeout(() => {
      // Transition to FULFILLED state
      resolve("Operation Completed Successfully");
    }, timeout);

});
};

/\*\*

- A custom utility that polls a condition until it returns true.
- Demonstrates explicit Promise creation and state management.
  \*/
  async function waitForCondition(
  conditionName: string,
  timeout: number = 5000
  ): Promise<boolean> {
  return new Promise((resolve, reject) => {
  const start = Date.now();

      const check = () => {
        // Logic for Success (Fulfillment)
        if (someExternalCondition()) {
          console.log(`${conditionName} met!`);
          resolve(true);
          return;
        }

        // Logic for Failure (Rejection)
        if (Date.now() - start > timeout) {
          reject(new Error(`Timed out waiting for: ${conditionName}`));
          return;
        }

        // Logic for remaining PENDING
        setTimeout(check, 100);
      };

      check();

  });
  }

promise.allSettled() : it will wait for all promises to settled , either reject or fulfilled.
but it will not simply failed if any one of them is failed, it waits until the execution of
all tests are done.
Very useful for broswer closure scenarios..

Kubernates:
uses helm deployment::
connect to the ENV: in the .kube file, we will have the connection details.
check pod health (up , runnng, crashloop) --> kubectl -n feat1 get pods | egrep nitro
check pod logs --> kubectl -n feat1 logs nitro-api-chart-0 -c application
execute inisde a container(pod and execute a command) --> kubectl -n feat1 exec -it nitro-api-chart-0 -- sh
scale up or scale down a pod --> kubectl -n prp1 scale deploy ipt-xg3-graph-ui --replicas=1
kubectl -n prp1 scale deploy ipt-xg3-graph-ui --replicas=0
rollout/restart a pod --> kubectl -n feat1 rollout restart deploy/nitro-ui-chart
update config manager --> kubectl -n feat1 edit cm nitro-ui-chart-extra-config

valut login
vault login -method=ldap abhishek.sharma

vault list <path>

we followed a iterative approach for a release.
risk based testing
mini regression
critical path
route to live
critical path
carefull defining the
how to analyze what to automate - most critical path use cases to be automated first
along with frequent screens(most used screens) to be automated
what if we miss to automate something , how we handle it ? -->
we create a test only ticket and keep it in backlog and make sure to pull it in next sprint to
work on it
describe a time when you handled a complex project ?

AWS: Secret Manager, Lambda, S3 , IAMRoles, EC2 (Jenkins machine - cleanup etc)
Jenkins:
Some of code was not properly parametrized and also was in early phase and not parallelse
which caused propblem the way we run them in jenkins as it didn't clearly explain which
tye of devices-configs etc we're using, project was not properly parametrized., all removed all the hard coded dependencies from local property files and added them as
run time params, those were accepted as jenkins parameters and helped to properly create our
jenkins jobs. and also parallelise.
MOved all client secret keys secrets to AWS Secret MAnager
also maintained some of physical boxes worked as jenkins agents for real device testing.(we linked
mobile devices)
