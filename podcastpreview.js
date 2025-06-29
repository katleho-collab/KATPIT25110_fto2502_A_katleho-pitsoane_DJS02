/**
 * Custom element for displaying a podcast preview.
 * @class
 * @extends HTMLElement
 */
class PodcastPreview extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Define the encapsulated HTML structure and CSS
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .podcast {
          background-color: #fff;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .podcast img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
        .podcast h3 {
          margin: 10px 0;
          font-size: 1.2em;
        }
        .podcast p {
          margin: 5px 0;
          color: #666;
        }
      </style>
      <div class="podcast">
        <img src="" alt="">
        <h3></h3>
        <p>Seasons: <span class="seasons"></span></p>
        <p>Genres: <span class="genres"></span></p>
        <p>Updated: <span class="updated"></span></p>
      </div>
    `;

    // Store references to shadow DOM elements for updates
    this._img = shadow.querySelector('img');
    this._title = shadow.querySelector('h3');
    this._seasons = shadow.querySelector('.seasons');
    this._genres = shadow.querySelector('.genres');
    this._updated = shadow.querySelector('.updated');
  }

  /**
   * Specifies which attributes to observe for changes.
   * @static
   * @returns {string[]} Array of attribute names
   */
  static get observedAttributes() {
    return ['data-id', 'data-image', 'data-title', 'data-genres', 'data-seasons', 'data-updated'];
  }

  /**
   * Updates the UI when an observed attribute changes.
   * @param {string} name - Attribute name
   * @param {string} oldValue - Previous value
   * @param {string} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-image') {
      this._img.src = newValue || '';
    } else if (name === 'data-title') {
      this._title.textContent = newValue || '';
      this._img.alt = newValue || '';
    } else if (name === 'data-seasons') {
      this._seasons.textContent = newValue || '';
    } else if (name === 'data-genres') {
      this._genres.textContent = newValue || '';
    } else if (name === 'data-updated') {
      if (newValue) {
        const date = new Date(newValue);
        this._updated.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        this._updated.textContent = '';
      }
    }
  }

  /**
   * Sets up event listeners when the element is added to the DOM.
   */
  connectedCallback() {
    this.addEventListener('click', this._handleClick.bind(this));
  }

  /**
   * Dispatches a custom event when the component is clicked.
   * @private
   */
  _handleClick() {
    const id = this.getAttribute('data-id');
    if (id) {
      this.dispatchEvent(new CustomEvent('podcast-clicked', {
        detail: { id },
        bubbles: true,
        composed: true
      }));
    }
  }
}

// Register the custom element
customElements.define('podcast-preview', PodcastPreview);