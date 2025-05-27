import { Todo } from '../types/Todo';

const API_URL = 'http://localhost:3000';

export async function getTodos(tripId: number): Promise<Todo[]> {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/todos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des ToDos');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getTodo(tripId: number, todoId: number): Promise<Todo> {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du ToDo');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createTodo(tripId: number, todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Todo> {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du ToDo');
    }

    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function deleteTodo(tripId: number, todoId: number): Promise<void> {
  try {
    console.log('Suppression du ToDo:', { tripId, todoId }); // Debug log
    const response = await fetch(`${API_URL}/trips/${tripId}/todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      console.error('Response status:', response.status); // Debug log
      throw new Error('Erreur lors de la suppression du ToDo');
    }
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export const updateTodo = async (tripId: number, todoId: number, todoData: Partial<Todo>) => {
  console.log('Données envoyées:', { tripId, todoId, todoData }); // Pour le débogage
  
  const response = await fetch(`${API_URL}/trips/${tripId}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(todoData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur de la réponse:', errorData);
    throw new Error(errorData.message || 'Erreur lors de la mise à jour');
  }

  return response.json();
}; 