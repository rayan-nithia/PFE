import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trip } from '../../types/Trip';
import { getTrips, deleteTrip } from '../../services/tripServices';
import backgroundImage from '../../assets/img/background.png';
import { PlusIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError('Erreur lors du chargement des voyages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    navigate('/trips/create');
  };

  const handleViewTrip = (tripId: number) => {
    navigate(`/trips/${tripId}`);
  };

  const handleDeleteTrip = async (tripId: number) => {
    const tripToDelete = trips.find(trip => trip.id === tripId);
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le voyage "${tripToDelete?.name}" ?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteTrip(tripId);
        setTrips(trips.filter(trip => trip.id !== tripId));
      } catch (error) {
        console.error('Erreur lors de la suppression du voyage:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#51D782] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadTrips}
          className="px-4 py-2 bg-[#005B70] text-white rounded-full hover:bg-[#005B70]/80 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center h-[300px] bg-cover bg-center p-5"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      <h1 className="text-3xl font-bold text-white">Plannifiez votre voyage pour ne rien oublier !</h1>
          <Link
            to={'/trips/create'}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005B70] hover:bg-[#005B70]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005B70]"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nouveau Voyage
          </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes Voyages</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{trip.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {trip.destinations.join(' → ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">{trip.travelersCount} voyageurs</span>
                  </div>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-[#005B70] bg-[#005B70]/10 hover:bg-[#005B70]/20"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
