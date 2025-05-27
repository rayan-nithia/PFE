import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trip } from '../../../types/Trip';
import { Todo } from '../../../types/Todo';
import { getTrip } from '../../../services/tripServices';
import { getTodos } from '../../../services/todoServices';
import { TodoList } from './components/TodoList';
import TodoForm from './components/TodoForm';
import backgroundImage from '../../../assets/img/background.png';
export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const tripData = await getTrip(parseInt(id));
      setTrip(tripData);
      const todosData = await getTodos(parseInt(id));
      setTodos(todosData);
      setSelectedDate(new Date(tripData.startDate));
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTodoCreated = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
    setShowTodoForm(false);
  };

  const handleTodoDeleted = async () => {
    try {
      const todosData = await getTodos(parseInt(id!));
      setTodos(todosData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#51D782] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 mb-4">{error || 'Voyage non trouvé'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-[#005B70] text-white rounded-full hover:bg-[#005B70]/80 transition-colors"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const dates = [];
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec image de couverture */}
      <div 
        className="h-64 md:h-96 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-opacity-40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {trip.name}
            </h1>
            <p className="text-xl text-white opacity-90">
              {trip.destinations.join(' → ')} • {trip.travelersCount} voyageur(s)
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche : Informations du voyage */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Informations</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Type de voyage
                  </h3>
                  <p className="mt-2 text-gray-900 font-medium">
                    {trip.type === 'SIMPLE' ? 'Simple destination' : 'Multi-destinations'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Dates
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-900">
                      <span className="font-medium">Départ:</span>{' '}
                      {new Date(trip.startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Retour:</span>{' '}
                      {new Date(trip.endDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Destinations
                  </h3>
                  <div className="mt-2 space-y-2">
                    {trip.destinations.map((destination, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xl mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium">{destination}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne principale : Calendrier et activités */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Calendrier */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Calendrier</h2>
                  <button
                    onClick={() => setShowTodoForm(true)}
                    className="px-6 py-2 bg-[#005B70] text-white rounded-full hover:bg-[#005B70]/80 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle activité
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {dates.map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const hasTodos = todos.some(
                      todo => new Date(todo.date).toDateString() === date.toDateString()
                    );
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          p-3 rounded-xl transition-all transform hover:scale-105
                          ${isSelected ? 'bg-[#005B70] text-white shadow-lg' : 
                            hasTodos ? 'bg-[#005B70]/10 text-[#005B70]' : 'hover:bg-gray-100'}
                        `}
                      >
                        <span className="text-sm font-medium">{date.getDate()}</span>
                        {hasTodos && !isSelected && (
                          <div className="w-1.5 h-1.5 bg-[#005B70] rounded-full mx-auto mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formulaire d'activité */}
              {showTodoForm && (
                <div className="bg-white rounded-2xl shadow-lg">
                  <TodoForm
                    tripId={parseInt(id!)}
                    date={selectedDate!}
                    onTodoCreated={handleTodoCreated}
                    onClose={() => setShowTodoForm(false)}
                  />
                </div>
              )}

              {/* Liste des activités */}
              {selectedDate && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    Activités du {selectedDate.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h2>
                  <TodoList
                    todos={todos}
                    selectedDate={selectedDate}
                    tripId={parseInt(id!)}
                    travelersCount={trip.travelersCount}
                    onTodoDeleted={handleTodoDeleted}
                    onTodoUpdated={handleTodoUpdated}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 