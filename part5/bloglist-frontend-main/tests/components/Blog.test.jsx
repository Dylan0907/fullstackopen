import Blog from "../../src/components/Blog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
const blog = {
  author: "sam the cat",
  title: "My life story",
  likes: 7,
  url: "www.youtube.com",
  user: {
    name: "Sam",
    username: "SamTheCat"
  }
};

const mockUser = {
  name: "Sam",
  username: "SamTheCat"
};

describe("<Blog />", () => {
  let container;
  const mockHandler = vi.fn();
  let user;
  beforeEach(() => {
    user = userEvent.setup();
    container = render(
      <Blog blog={blog} user={mockUser} handleLikes={mockHandler} />
    ).container;
  });
  test("renders some content (title & author) by default", () => {
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("sam the cat");
    expect(div).toHaveTextContent("My life story");
    expect(div).not.toHaveTextContent("www.youtube.com");
    expect(div).not.toHaveTextContent(7);
  });

  test("the blog's URL and number of likes are shown when the button has been clicked", async () => {
    const button = screen.getByText("view");

    await user.click(button);
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("www.youtube.com");
    expect(div).toHaveTextContent(7);
  });

  test("if the like button is clicked twice, the event hander is called also twice", async () => {
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const likeButton = screen.getByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
