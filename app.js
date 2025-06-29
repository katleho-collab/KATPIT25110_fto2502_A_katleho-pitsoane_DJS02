import './podcastpreview.js';
import { podcasts, genres, seasons } from './data.js';

// DOM Elements
const podcastContainer = document.getElementById('podcast-container');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal');

// State
let selectedGenre = 'all';
let sortOrder = 'most-recent';

/**
 * Get filtered and sorted list of podcasts.
 * @returns {Array} - Filtered and sorted podcasts array.
 */
function getFilteredPodcasts() {
  let filteredPodcasts = [...podcasts];
  if (selectedGenre !== 'all') {
    filteredPodcasts = filteredPodcasts.filter(podcast => 
      podcast.genres.includes(Number(selectedGenre))
    );
  }
  if (sortOrder === 'most-recent') {
    filteredPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  } else if (sortOrder === 'oldest') {
    filteredPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
  }
  return filteredPodcasts;
}

/**
 * Render podcast previews using the custom component.
 * @param {Array} podcasts - Array of podcast objects to display.
 */
function renderPodcasts(podcasts) {
  podcastContainer.innerHTML = '';
  podcasts.forEach(podcast => {
    const preview = document.createElement('podcast-preview');
    preview.setAttribute('data-id', podcast.id);
    preview.setAttribute('data-image', podcast.image);
    preview.setAttribute('data-title', podcast.title);
    const genresText = podcast.genres.map(id => genres.find(g => g.id === id).title).join(', ');
    preview.setAttribute('data-genres', genresText);
    preview.setAttribute('data-seasons', podcast.seasons);
    preview.setAttribute('data-updated', podcast.updated);
    podcastContainer.appendChild(preview);
  });
}

/**
 * Render filtered podcasts based on current filters.
 */
function renderFilteredPodcasts() {
  const filtered = getFilteredPodcasts();
  renderPodcasts(filtered);
}

/**
 * Opens the modal with podcast details.
 * @param {string} podcastId - ID of the podcast to show.
 */
function openModal(podcastId) {
  const podcast = podcasts.find(p => p.id === podcastId);
  if (!podcast) return;
  const seasonDetails = seasons.find(s => s.id === podcastId).seasonDetails;
  const genreNames = podcast.genres.map(id => genres.find(g => g.id === id).title);

  document.getElementById('modal-title').textContent = podcast.title;
  document.getElementById('modal-image').src = podcast.image;
  document.getElementById('modal-image').alt = podcast.title;
  document.getElementById('modal-description').textContent = podcast.description;
  document.getElementById('modal-genres').innerHTML = genreNames.map(name => `<span class="genre-tag">${name}</span>`).join(' ');
  document.getElementById('modal-updated').textContent = new Date(podcast.updated).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const modalSeasonsList = document.getElementById('modal-seasons-list');
  modalSeasonsList.innerHTML = '';
  seasonDetails.forEach(season => {
    const seasonDiv = document.createElement('div');
    seasonDiv.classList.add('season');
    seasonDiv.innerHTML = `<span>${season.title}</span><span>${season.episodes} episodes</span>`;
    modalSeasonsList.appendChild(seasonDiv);
  });

  modal.classList.remove('hidden');
}

/**
 * Closes the modal.
 */
function closeModal() {
  modal.classList.add('hidden');
}

// Filter and sort listeners
document.getElementById('genre-filter').addEventListener('change', () => {
  selectedGenre = document.getElementById('genre-filter').value;
  renderFilteredPodcasts();
});

document.getElementById('sort-filter').addEventListener('change', () => {
  sortOrder = document.getElementById('sort-filter').value;
  renderFilteredPodcasts();
});

// Modal listeners
podcastContainer.addEventListener('podcast-clicked', (e) => {
  const id = e.detail.id;
  openModal(id);
});

closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Initialize genre options
const genreFilter = document.getElementById('genre-filter');
const allGenresOption = document.createElement('option');
allGenresOption.value = 'all';
allGenresOption.textContent = 'ALL GENRES';
genreFilter.appendChild(allGenresOption);

genres.forEach(genre => {
  const option = document.createElement('option');
  option.value = genre.id;
  option.textContent = genre.title;
  genreFilter.appendChild(option);
});

// Initial render
renderFilteredPodcasts();