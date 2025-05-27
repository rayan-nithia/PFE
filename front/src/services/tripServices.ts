import { Trip } from '../types/Trip';

const API_URL = 'http://localhost:3000';

export async function getTrips(): Promise<Trip[]> {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log

    const response = await fetch(`${API_URL}/trips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Response status:', response.status); // Debug log
      throw new Error('Erreur lors de la récupération des voyages');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getTrip(id: number): Promise<Trip> {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log

    const response = await fetch(`${API_URL}/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Response status:', response.status); // Debug log
      throw new Error('Erreur lors de la récupération du voyage');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createTrip(tripData: Omit<Trip, 'id' | 'todos' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Trip> {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log

    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      console.error('Response status:', response.status); // Debug log
      throw new Error('Erreur lors de la création du voyage');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export const deleteTrip = async (tripId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/trips/${tripId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du voyage');
  }
}; 