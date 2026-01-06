import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="p-4 bg-gray-700">
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Home
          </Link>
        </li>
        
      </ul>
    </nav>
  );
}
