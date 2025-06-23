import { useParams } from "react-router-dom";

const IndividualUserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((user) => user.id === id);
  if (!user) return <div>Couldn't find this user</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{user.name}</h2>
      <h3 className="text-xl font-semibold mb-3 text-gray-700">Added blogs</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default IndividualUserView;
