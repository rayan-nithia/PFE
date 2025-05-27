import React, { useState, useEffect } from 'react';
import { Todo, TodoCategory } from '../../../../types/Todo';
import { updateTodo } from '../../../../services/todoServices';

interface EditTodoModalProps {
  todo: Todo;
  tripId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTodo: Todo) => void;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  todo,
  tripId,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [editedTodo, setEditedTodo] = useState<Todo>(todo);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedTodo(todo);
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer un objet avec uniquement les champs modifiés
      const updateData: Partial<Todo> = {};
      
      if (editedTodo.title !== todo.title) updateData.title = editedTodo.title;
      if (editedTodo.category !== todo.category) updateData.category = editedTodo.category;
      if (editedTodo.price !== todo.price) updateData.price = editedTodo.price;
      if (editedTodo.description !== todo.description) updateData.description = editedTodo.description;
      if (editedTodo.date !== todo.date) updateData.date = editedTodo.date;

      const updatedTodo = await updateTodo(tripId, todo.id, updateData);
      onUpdate(updatedTodo);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-xs transition-opacity bg-[rgba(0,0,0,0.4)]" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <h2 className="text-xl font-semibold mb-4">Modifier l'activité</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={editedTodo.title}
                onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#51D782]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={editedTodo.category}
                onChange={(e) => setEditedTodo({ ...editedTodo, category: e.target.value as TodoCategory })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#51D782]"
              >
                <option value="RESTAURANT">Restaurant</option>
                <option value="ACCOMMODATION">Hébergement</option>
                <option value="ACTIVITY">Activité</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix
              </label>
              <input
                type="number"
                value={editedTodo.price || ''}
                onChange={(e) => setEditedTodo({ ...editedTodo, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#51D782]"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editedTodo.description || ''}
                onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#51D782]"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#005B70] text-white rounded-lg hover:bg-[#005B70]/80 disabled:opacity-50"
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 