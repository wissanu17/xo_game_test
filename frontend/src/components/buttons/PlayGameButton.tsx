import { Link } from 'react-router-dom'; // Using Link from react-router-dom for navigation

const PlayGameButton: React.FC = () => {
  return (
    <Link
      to="/play"
      className="inline-block py-3 px-6 bg-green-400 text-gray-900 rounded-lg font-bold text-lg shadow-lg shadow-green-400/30 hover:bg-green-500 transition-colors"
    >
      Play Now
    </Link>
  );
};

export default PlayGameButton;
