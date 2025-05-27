import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../../../services/tripServices';
import { TripType } from '../../../types/Trip';
import backgroundImage from '../../../assets/img/background.png';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'SIMPLE' as TripType,
    destinations: [''],
    startDate: '',
    endDate: '',
    travelersCount: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'travelersCount') {
      const numValue = parseInt(value);
      if (numValue >= 1) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, ''],
    }));
  };

  const removeDestination = (index: number) => {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, destinations: newDestinations }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const filteredDestinations = formData.destinations.filter(dest => dest.trim() !== '');
      if (filteredDestinations.length === 0) {
        throw new Error('Au moins une destination est requise');
      }

      const tripData = {
        ...formData,
        destinations: filteredDestinations,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      const trip = await createTrip(tripData);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du voyage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#51D782] to-[#45C070] text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Créer un nouveau voyage
          </h1>
          <p className="text-xl text-green-100">
            Commencez à planifier votre prochaine aventure
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              {/* Nom du voyage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du voyage
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Été en Italie"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Type de voyage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de voyage
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="SIMPLE">Simple destination</option>
                    <option value="MULTIPLE">Plusieurs destinations</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Destinations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Destinations
                </label>
                <div className="space-y-4">
                  {formData.destinations.map((destination, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={destination}
                            onChange={(e) => handleDestinationChange(index, e.target.value)}
                            required
                            placeholder={`Destination ${index + 1}`}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200"
                          />
                          {formData.destinations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDestination(index)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.type === 'MULTIPLE' && (
                    <button
                      type="button"
                      onClick={addDestination}
                      className="inline-flex items-center text-[#51D782] hover:text-[#45C070] font-medium transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajouter une destination
                    </button>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Nombre de voyageurs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de voyageurs
                </label>
                <input
                  type="number"
                  name="travelersCount"
                  value={formData.travelersCount}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#51D782] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="mt-12 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#005B70] text-white rounded-xl hover:bg-[#005B70]/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Création en cours...
                  </div>
                ) : (
                  'Créer le voyage'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 