// --------------------
// HERO BACKGROUND SLIDER
// --------------------
const images = [
  'images/WhatsApp Image 2025-10-10 at 12.58.16 AM.jpeg',
  'images/WhatsApp Image 2025-10-10 at 12.58.16 AM (1).jpeg',
  'images/WhatsApp Image 2025-10-10 at 12.58.15 AM.jpeg',
  'images/WhatsApp Image 2025-10-10 at 12.58.08 AM.jpeg'
];

const bg1 = document.querySelector('.hero-bg1');
const bg2 = document.querySelector('.hero-bg2');

let index = 0;
let showingBg1 = true;

// Initialize first background
bg1.style.backgroundImage = `url('${images[0]}')`;
bg2.style.backgroundImage = `url('${images[1]}')`;

setInterval(() => {
  index = (index + 1) % images.length;
  const nextImage = images[index];

  if (showingBg1) {
    bg2.style.backgroundImage = `url('${nextImage}')`;
    bg2.style.opacity = 1;
    bg1.style.opacity = 0;
  } else {
    bg1.style.backgroundImage = `url('${nextImage}')`;
    bg1.style.opacity = 1;
    bg2.style.opacity = 0;
  }

  showingBg1 = !showingBg1;
}, 5000);


// --------------------
// MOBILE MENU TOGGLE
// --------------------
document.querySelector('.mobile-menu').addEventListener('click', function() {
  document.querySelector('nav').classList.toggle('active');
});

// --------------------
// HEADER SCROLL EFFECT
// --------------------
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top button visibility
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// --------------------
// BACK TO TOP FUNCTIONALITY
// --------------------
document.getElementById('backToTop').addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


// --------------------
// DESTINATION DATA
// --------------------
const destinations = [
  {
    id: 1,
    name: "Kodaikanal Lake",
    description: "A beautiful star-shaped lake in the heart of Kodaikanal, perfect for boating and leisurely walks.",
    image: "./images/Kodaikanal's Lake View Luxury_ Sterling Kodai Lake Unveiled.jpg",
    category: "lake"
  },
  {
    id: 2,
    name: "Pillar Rocks",
    description: "Three giant rock pillars standing 400 feet high, offering spectacular views of the surrounding valleys.",
    image: "./images/Sublime view of the Pillar rocks, Kodaikanal.jpg",
    category: "viewpoint"
  },
  {
    id: 3,
    name: "Bryant Park",
    description: "A beautifully maintained botanical garden with a wide variety of flowers, plants, and trees.",
    image: "./images/park.jpg",
    category: "garden"
  },
  {
    id: 4,
    name: "Coaker's Walk",
    description: "A scenic 1km paved path along the edge of steep slopes offering breathtaking valley views.",
    image: "./images/walk.jpg",
    category: "walking"
  },
  {
    id: 5,
    name: "Bear Shola Falls",
    description: "A seasonal waterfall that comes alive during the monsoon, surrounded by lush greenery.",
    image: "./images/shola falls.jpg",
    category: "waterfall"
  },
  {
    id: 6,
    name: "Green Valley View",
    description: "Offers a spectacular view of the plains below and the Vaigai Dam in the distance.",
    image: "./images/greeny view.jpg",
    category: "viewpoint"
  }
];

// --------------------
// SEARCH AND FILTER COMPONENT
// --------------------
function renderSearchComponent() {
  const searchContainer = document.getElementById('search-component');
  
  if (!searchContainer) return;
  
  searchContainer.innerHTML = `
    <div class="search-section">
      <div class="search-container">
        <input type="text" class="search-input" id="search-input" placeholder="Search destinations...">
        <button class="btn" id="search-btn">Search</button>
      </div>
      <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="lake">Lake</button>
        <button class="filter-btn" data-filter="viewpoint">Viewpoint</button>
        <button class="filter-btn" data-filter="garden">Garden</button>
        <button class="filter-btn" data-filter="walking">Walking</button>
        <button class="filter-btn" data-filter="waterfall">Waterfall</button>
      </div>
    </div>
  `;

  // Add event listeners
  document.getElementById('search-btn').addEventListener('click', filterDestinations);
  document.getElementById('search-input').addEventListener('keyup', filterDestinations);
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      filterDestinations();
    });
  });
}

// --------------------
// FILTER DESTINATIONS
// --------------------
function filterDestinations() {
  const searchInput = document.getElementById('search-input');
  const activeFilter = document.querySelector('.filter-btn.active');
  
  if (!searchInput || !activeFilter) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const activeFilterValue = activeFilter.dataset.filter;
  
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm) || 
                         destination.description.toLowerCase().includes(searchTerm);
    const matchesFilter = activeFilterValue === 'all' || destination.category === activeFilterValue;
    
    return matchesSearch && matchesFilter;
  });
  
  renderDestinations(filteredDestinations);
}

// --------------------
// RENDER DESTINATIONS
// --------------------
function renderDestinations(destinationsToRender) {
  const container = document.getElementById('destinations-container');
  
  if (!container) return;
  
  if (destinationsToRender.length === 0) {
    container.innerHTML = '<p class="no-results">No destinations found matching your criteria.</p>';
    return;
  }
  
  container.innerHTML = destinationsToRender.map(destination => `
    <div class="destination-card">
      <img src="${destination.image}" alt="${destination.name}" class="card-image">
      <div class="card-content">
        <h3>${destination.name}</h3>
        <p>${destination.description}</p>
        <a href="#" class="btn">Learn More</a>
      </div>
    </div>
  `).join('');
}