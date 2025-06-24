import { Link } from "react-router-dom";

const UsersView = ({ users }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700"></th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Blogs Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap text-blue-600 hover:underline">
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                  {user.blogs.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersView;
