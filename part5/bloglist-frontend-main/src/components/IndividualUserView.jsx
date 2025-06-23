import { useParams } from "react-router-dom";

const IndividualUserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((user) => user.id === id);
  if (!user) return <div>Couldn't find this user</div>;

  return (
    <div>
      <h3>added blogs</h3>
      <h2>{user.name}</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default IndividualUserView;
