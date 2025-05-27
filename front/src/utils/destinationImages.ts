// Utilisation de l'API d'importation dynamique de Vite
const images: Record<string, string> = import.meta.glob('../assets/images/destinations/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default'
});

// Log pour déboguer
console.log('Images trouvées:', images);

// Fonction pour obtenir une image aléatoire
export const getRandomDestinationImage = (): string => {
  const imageUrls = Object.values(images);
  console.log('URLs des images:', imageUrls);
  
  if (imageUrls.length === 0) {
    console.warn('Aucune image trouvée dans le dossier destinations');
    return '';
  }
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  const selectedImage = imageUrls[randomIndex];
  console.log('Image sélectionnée:', selectedImage);
  
  return selectedImage;
};

// Fonction pour obtenir l'image d'une destination
export const getDestinationImage = (): string => {
  const imagePath = getRandomDestinationImage();
  return imagePath;
}; 