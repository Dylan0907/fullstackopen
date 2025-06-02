import CreateBlog from "../../src/components/CreateBlog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("<CreateBlog /> calls the event handler when a new blog is created", async () => {
  const addBlog = vi.fn();
  const user = userEvent.setup();
  render(<CreateBlog addBlog={addBlog} />);

  const createButton = screen.getByText("create");

  const title = screen.getByLabelText("Title");
  await user.type(title, "My life story");

  const author = screen.getByLabelText("Author");
  await user.type(author, "Sam");

  const url = screen.getByLabelText("URL");
  await user.type(url, "www.youtube.com");

  await user.click(createButton);
  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "My life story",
      author: "Sam",
      url: "www.youtube.com"
    })
  );
});
