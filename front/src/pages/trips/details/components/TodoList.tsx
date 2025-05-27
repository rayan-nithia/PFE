import React, { useState } from 'react';
import { Todo } from '../../../../types/Todo';
import { deleteTodo } from '../../../../services/todoServices';
import { EditTodoModal } from './EditTodoModal';

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
  tripId: number;
  travelersCount: number;
  onTodoDeleted?: () => void;
  onTodoUpdated?: (updatedTodo: Todo) => void;
}

const categoryTranslations: Record<string, string> = {
  RESTAURANT: 'Restaurant',
  ACCOMMODATION: 'Hébergement',
  ACTIVITY: 'Activité'
};

const categoryIcons: Record<string, string> = {
  RESTAURANT: '🍽️',
  ACCOMMODATION: '🏨',
  ACTIVITY: '🎯'
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedDate,
  tripId,
  travelersCount,
  onTodoDeleted,
  onTodoUpdated
}) => {
  const [showPerPerson, setShowPerPerson] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = todos.filter(todo => {
    const todoDate = new Date(todo.date);
    return todoDate.toDateString() === selectedDate.toDateString();
  });

  const calculateDailyTotal = () => {
    return filteredTodos.reduce((total, todo) => {
      const price = todo.price ? Number(todo.price) : 0;
      return isNaN(price) ? total : total + price;
    }, 0);
  };

  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(tripId, todoId);
      if (onTodoDeleted) {
        onTodoDeleted();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    if (onTodoUpdated) {
      onTodoUpdated(updatedTodo);
    }
  };

  const totalAmount = calculateDailyTotal();
  const perPersonAmount = totalAmount / travelersCount;

  return (
    <div className="space-y-6">
      {/* Résumé financier */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Résumé financier</h3>
            <div className="text-2xl font-bold text-green-600">
              {totalAmount.toFixed(2)} €
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowPerPerson(!showPerPerson)}
              className="flex items-center gap-3"
            >
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${
                showPerPerson ? 'bg-blue-500' : 'bg-gray-200'
              }`}>
                <div className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  showPerPerson ? 'translate-x-6' : 'translate-x-0.5'
                } top-0.5`} />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Coût par personne
              </span>
            </button>
            {showPerPerson && (
              <div className="text-lg font-semibold text-blue-600">
                {perPersonAmount.toFixed(2)} € <span className="text-sm font-normal">/ pers.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des activités */}
      {filteredTodos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune activité prévue</h3>
          <p className="text-gray-500">
            Ajoutez votre première activité pour cette journée !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{todo.title}</h3>
                  <p className="text-sm text-gray-500">
                    {categoryTranslations[todo.category]}
                  </p>
                  {todo.description && (
                    <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="text-[#51D782] hover:text-[#45C070]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {todo.price && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">
                    {showPerPerson
                      ? `${(todo.price / travelersCount).toFixed(2)}€ / pers`
                      : `${todo.price}€`}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          tripId={tripId}
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdate={handleUpdateTodo}
        />
      )}
    </div>
  );
};
