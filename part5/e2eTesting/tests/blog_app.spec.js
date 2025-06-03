const { test, expect, beforeEach, describe } = require("@playwright/test");
const { title } = require("process");
const blog = {
  title: "My life story",
  author: "Sam",
  url: "www.youtube.com"
};
const blogs = [
  blog,
  { title: "How I grow up", author: "Aragorn", url: "www.google.com" },
  {
    title: "I ate the whole thing",
    author: "Nina",
    url: "www.yahoo.com"
  }
];
describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Sam the Cat",
        username: "SamTheMaster",
        password: "SamTheMaster"
      }
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("SamTheMaster");
      await page.getByLabel("password").fill("SamTheMaster");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Sam the cat logged in")).toBeVisible();
    });
    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("SamTheMaster");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    async function createBlog(page, { title, author, url }) {
      await page.getByRole("button", { name: "New Blog" }).click();
      await page.getByLabel(/title/i).fill(title);
      await page.getByLabel(/author/i).fill(author);
      await page.getByLabel(/url/i).fill(url);
      await page.getByRole("button", { name: "create" }).click();
    }

    beforeEach(async ({ page }) => {
      //log in the User A
      await page.getByLabel("username").fill("SamTheMaster");
      await page.getByLabel("password").fill("SamTheMaster");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, blog);
      await expect(
        page.getByText(`A new blog You're not going to need it! by Sam the Cat`)
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, blog);

      // View and like
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "Like" }).click();

      await expect(page.locator(".blog__likes")).toHaveText("likes 1");
    });

    test("the user that created the blog can delete it", async ({ page }) => {
      // Create a blog
      await createBlog(page, blog);
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "remove" }).click();
      await expect(page.getByText(blog.title)).not.toBeVisible();
    });

    test("only the creator can see the remove button", async ({
      page,
      request
    }) => {
      // Create a blog as User A
      await createBlog(page, blog);

      // Log out as User A
      await page.getByRole("button", { name: /logout/i }).click();

      // create a User B
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Aragorn the dog",
          username: "AragornTheFool",
          password: "AragornTheFool"
        }
      });

      // Log in as a different user (User B)
      await page.getByLabel("username").fill("AragornTheFool");
      await page.getByLabel("password").fill("AragornTheFool");
      await page.getByRole("button", { name: "login" }).click();

      // Try to view the blog
      await page.getByRole("button", { name: "view" }).click();

      // Assert remove button is not visible
      await expect(page.getByRole("button", { name: "remove" })).toHaveCount(0);
    });

    test.only("the blogs are arranged in the order according to the likes", async ({
      page
    }) => {
      test.setTimeout(60000);
      for (const blog of blogs) {
        await createBlog(page, blog);
      }
      for (const blog of blogs) {
        await page
          .getByText(blog.title)
          .locator("..")
          .getByRole("button", { name: "view" })
          .click();
      }
      await expect(page.getByText(blog.title)).toBeVisible();
    });
  });
});
