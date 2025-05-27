import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trip } from '../types/Trip';
import { getTrips } from '../services/tripServices';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
        }
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    loadTrips();
  }, [location.pathname]);

  const loadTrips = async () => {
    try {
      const tripsData = await getTrips();
      setTrips(tripsData);
    } catch (error) {
      console.error('Erreur lors du chargement des voyages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('fr-FR', { month: 'short' })} ${d.getFullYear()}`;
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  const calculateTotalCost = (trip: Trip) => {
    if (!trip.todos || !Array.isArray(trip.todos)) return 0;
    return Number(
      trip.todos.reduce((total, todo) => {
        const price = todo.price ? Number(todo.price) : 0;
        return isNaN(price) ? total : total + price;
      }, 0)
    );
  };

  return (
    <div className="w-64 bg-gray-50 h-screen p-4 fixed left-0 top-0">
      {/* En-tête du profil */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          👤
        </div>
        <div>
          <h2 className="font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : 'Chargement...'}
          </h2>
          <p className="text-sm text-gray-500">Jeune voyageur</p>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-auto text-gray-400 hover:text-gray-600"
          title="Se déconnecter"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>

      {/* Bouton Nouveau Voyage */}
      <button
        onClick={() => navigate('/trips/create')}
        className="w-full bg-[#005B70] text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#005B70]/80"
      >
        <span>+</span> Nouveau voyage
      </button>

      {/* Section Voyages */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 mb-3">Mes derniers voyages</h3>
        <div className="space-y-3">
          {trips.slice(0, 3).map((trip) => (
            <button
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
                location.pathname === `/trips/${trip.id}` ? 'bg-gray-200' : ''
              }`}
            >
              <div className="text-left flex-1">
                <div className="font-medium">{trip.destinations[0]}</div>
                <div className="text-xs text-gray-500">
                  {calculateDuration(trip.startDate, trip.endDate)}, {formatDate(trip.startDate)}
                </div>
                <div className="text-xs font-medium text-green-600 mt-1">
                  Budget: {calculateTotalCost(trip).toFixed(2)} €
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section Général */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-3">GENERAL</h3>
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
            location.pathname === '/dashboard' ? 'bg-gray-200' : ''
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Dashboard</span>
        </button>
      </div>
    </div>
  );
} 