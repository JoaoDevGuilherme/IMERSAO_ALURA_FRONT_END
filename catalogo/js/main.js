import { profileCategories, defaultCategories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    // Carregar perfil ativo do localStorage
    const activeProfileData = localStorage.getItem('activeProfile');
    let fullCategories = defaultCategories;

    if (activeProfileData) {
        try {
            const activeProfile = JSON.parse(activeProfileData);
            const kidsLink = document.querySelector('.kids-link');
            const profileIcon = document.querySelector('.profile-icon');

            if (kidsLink && activeProfile.name) {
                kidsLink.textContent = activeProfile.name;
            }
            if (profileIcon && activeProfile.image) {
                profileIcon.src = activeProfile.image;
                profileIcon.alt = activeProfile.alt || activeProfile.name;
            }

            if (activeProfile.type && profileCategories[activeProfile.type]) {
                fullCategories = profileCategories[activeProfile.type];
            }
        } catch (error) {
            console.error('Erro ao carregar perfil ativo:', error);
        }
    }

    const container = document.getElementById('main-content');
    let currentFilter = 'all';

    function renderCategories(categories) {
        if (container) {
            container.innerHTML = '';
            categories.forEach(category => {
                const carousel = createCarousel(category);
                container.appendChild(carousel);
            });
        }
    }

    function filterCategories(filter) {
        if (filter === 'all' || filter === 'alura') {
            return fullCategories;
        }
        return fullCategories.filter(cat => {
            const title = cat.title.toLowerCase();
            switch (filter) {
                case 'series':
                    return title.includes('séries');
                case 'filmes':
                    return title.includes('filmes');
                case 'jogos':
                    return title.includes('jogos');
                case 'bombando':
                    return title.includes('assistidos') || title.includes('bombando');
                case 'lista':
                    return title.includes('continue');
                default:
                    return true;
            }
        });
    }

    // Initial render
    renderCategories(fullCategories);

    // Add event listeners to nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            if (filter !== currentFilter) {
                currentFilter = filter;
                // Update active class
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                // Render filtered categories
                const filtered = filterCategories(filter);
                renderCategories(filtered);
            }
        });
    });

    // Profile dropdown
    const profileToggle = document.querySelector('.profile-dropdown-toggle');
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            profileDropdown.classList.remove('show');
        });
    }
});
