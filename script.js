console.log('Script.js loading...');

// ============ SAMPLE EVENTS DATA ============
const sampleEvents = [
    {
        id: 1,
        title: "Tech Conference 2025",
        description: "A comprehensive conference on latest technologies including AI, Cloud, and Web Development.",
        date: "2025-07-15",
        time: "09:00 AM",
        location: "Convention Center, Downtown",
        price: 50,
        totalTickets: 500,
        availableTickets: 450,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        title: "Music Festival 2025",
        description: "Live performances from local and international artists. 3 days of pure music and entertainment!",
        date: "2025-08-10",
        time: "05:00 PM",
        location: "Central Park Amphitheater",
        price: 75,
        totalTickets: 1000,
        availableTickets: 800,
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        title: "Food & Wine Tasting",
        description: "Explore culinary delights from various cuisines with wine pairings.",
        date: "2025-07-22",
        time: "06:00 PM",
        location: "Grand Hotel Restaurant",
        price: 120,
        totalTickets: 200,
        availableTickets: 150,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        title: "Sports Marathon 2025",
        description: "Run, walk, or jog. All fitness levels welcome. Includes post-race festivities.",
        date: "2025-09-05",
        time: "06:00 AM",
        location: "City Sports Complex",
        price: 30,
        totalTickets: 2000,
        availableTickets: 1500,
        image: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        title: "Art Exhibition Opening",
        description: "Contemporary art exhibition featuring works from emerging and established artists.",
        date: "2025-07-30",
        time: "07:00 PM",
        location: "Modern Art Gallery",
        price: 25,
        totalTickets: 300,
        availableTickets: 250,
        image: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&auto=format&fit=crop&q=80"
    }
];

// ============ INITIALIZE APP ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Sample Events:', sampleEvents);
    
    // Load events on homepage
    if (document.getElementById('eventsGrid')) {
        console.log('Events Grid found, loading events...');
        loadEvents();
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            searchEvents(this.value);
        });
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', handleRegister);
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        console.log('Booking form found');
        bookingForm.addEventListener('submit', handleBooking);
    }

    // Load saved cities if on weather dashboard
    if (document.getElementById('savedCitiesContainer')) {
        setTimeout(displaySavedCities, 500);
    }
});

// ============ LOAD & DISPLAY EVENTS ============
function loadEvents(eventsToDisplay = sampleEvents) {
    console.log('Loading events, total:', eventsToDisplay.length);
    
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (!eventsGrid) {
        console.error('eventsGrid element not found');
        return;
    }
    
    if (eventsToDisplay.length === 0) {
        eventsGrid.innerHTML = '<p class="loading">No events found.</p>';
        return;
    }

    eventsGrid.innerHTML = eventsToDisplay.map(event => `
        <div class="event-card" onclick="viewEventDetail(${event.id})" style="cursor: pointer;">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-body">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-info">
                    📅 ${event.date} | ⏰ ${event.time}<br>
                    📍 ${event.location}
                </div>
                <div class="event-footer">
                    <span class="event-price">$${event.price}</span>
                    <span class="event-tickets">${event.availableTickets} tickets</span>
                </div>
            </div>
        </div>
    `).join('');

    console.log('Events loaded successfully');
}

// ============ SEARCH EVENTS ============
function searchEvents(query) {
    console.log('Searching for:', query);
    
    const filtered = sampleEvents.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log('Filtered events:', filtered.length);
    loadEvents(filtered);
}

// ============ VIEW EVENT DETAIL ============
function viewEventDetail(eventId) {
    console.log('Viewing event:', eventId);
    // Store the event ID for the detail page
    localStorage.setItem('selectedEventId', eventId);
    // Redirect to event detail page
    window.location.href = 'event-detail.html';
}

// ============ LOAD EVENT DETAIL ============
function loadEventDetail() {
    console.log('=== loadEventDetail CALLED ===');
    
    // Get event ID from localStorage
    const eventId = localStorage.getItem('selectedEventId');
    console.log('Event ID from localStorage:', eventId);
    
    // Get custom events or use sample events
    let allEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!allEvents) {
        console.log('No custom events found, using sample events');
        allEvents = sampleEvents;
    }
    
    console.log('Total events available:', allEvents.length);
    console.log('All events:', allEvents);
    
    // Find the event by ID
    const event = allEvents.find(e => {
        console.log('Comparing event ID:', e.id, 'with:', eventId, 'Equal?', e.id == eventId);
        return e.id == eventId;
    });
    
    console.log('Event found:', event);

    // Get the container
    const container = document.getElementById('eventDetailContainer');
    
    if (!container) {
        console.error('eventDetailContainer not found in DOM');
        return;
    }

    // If event not found
    if (!event) {
        console.error('❌ Event not found for ID:', eventId);
        container.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 2rem; border-radius: 8px; text-align: center;">
                <h3>❌ Event Not Found</h3>
                <p>Sorry, we couldn't find the event you're looking for.</p>
                <a href="index.html" style="color: #721c24; text-decoration: underline;">Go back to events</a>
            </div>
        `;
        return;
    }

    // Display the event details
    console.log('✅ Displaying event:', event.title);
    
    container.innerHTML = `
        <div class="event-detail-grid">
            <div>
                <img src="${event.image}" alt="${event.title}" class="event-detail-image">
            </div>
            <div>
                <h1>${event.title}</h1>
                <p>${event.description}</p>
                <div class="event-details">
                    <p><strong>📅 Date:</strong> ${event.date}</p>
                    <p><strong>⏰ Time:</strong> ${event.time}</p>
                    <p><strong>📍 Location:</strong> ${event.location}</p>
                    <p><strong>💵 Price:</strong> $${event.price.toFixed(2)}</p>
                    <p><strong>🎫 Available:</strong> ${event.availableTickets} / ${event.totalTickets}</p>
                </div>
            </div>
        </div>
    `;

    // Load booking form
    loadBookingForm(event);
}

// ============ BOOKING FORM ============
function loadBookingForm(event) {
    console.log('Loading booking form for event:', event.id);
    
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) {
        console.error('bookingForm not found');
        return;
    }

    // Create the form HTML
    const formHTML = `
        <input type="hidden" name="eventId" value="${event.id}">
        
        <div class="form-group">
            <label for="quantity">Number of Tickets</label>
            <input type="number" id="quantity" name="quantity" min="1" max="${event.availableTickets}" value="1" required>
        </div>
        
        <div class="form-group">
            <label>Total Price: $<span id="totalPrice">${event.price.toFixed(2)}</span></label>
        </div>
        
        <button type="submit" class="btn form-btn">Book Now</button>
    `;

    // Set the form HTML
    bookingForm.innerHTML = formHTML;

    // Add event listener for quantity change
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const newTotal = (event.price * this.value).toFixed(2);
            const totalPriceSpan = document.getElementById('totalPrice');
            if (totalPriceSpan) {
                totalPriceSpan.textContent = newTotal;
            }
            console.log('Quantity changed to:', this.value, 'New total:', newTotal);
        });
    }

    // Add submit handler
    bookingForm.addEventListener('submit', handleBooking);
    
    console.log('Booking form loaded successfully');
}

// ============ AUTHENTICATION ============
function handleLogin(e) {
    e.preventDefault();
    
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email, 'Password:', password);

    if (!email || !password) {
        showMessage('❌ Please fill all fields', 'error');
        return;
    }

    // Check if admin login
    if (email === 'admin@eventbook.com' && password === 'admin123') {
        console.log('Admin login detected');
        localStorage.setItem('adminUser', JSON.stringify({
            id: 0,
            email: email,
            role: 'admin'
        }));
        showMessage('✅ Admin login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('All users:', users);
    
    const user = users.find(u => u.email === email && u.password === password);
    console.log('User found:', user);

    if (!user) {
        console.log('User not found or password incorrect');
        showMessage('❌ Invalid email or password', 'error');
        return;
    }

    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('User logged in successfully');
    showMessage('✅ Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    
    console.log('Register form submitted');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    console.log('Form data:', {name, email, password, confirmPassword});

    if (!name || !email || !password || !confirmPassword) {
        showMessage('❌ Please fill all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('❌ Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('❌ Password must be at least 6 characters', 'error');
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Existing users:', users);

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        console.log('Email already exists');
        showMessage('❌ Email already registered', 'error');
        return;
    }

    // Add new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);
    console.log('New user created:', newUser);
    console.log('Updated users array:', users);
    
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('✅ Registration successful! Redirecting to login...', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// ============ BOOKING HANDLER ============
function handleBooking(e) {
    e.preventDefault();

    console.log('Booking form submitted');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        console.log('User not logged in');
        showMessage('❌ Please login to book tickets', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }

    const eventIdInput = document.querySelector('input[name="eventId"]');
    if (!eventIdInput) {
        console.error('Event ID input not found');
        showMessage('❌ Event information not found', 'error');
        return;
    }

    const eventId = eventIdInput.value;
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) {
        console.error('Quantity input not found');
        showMessage('❌ Quantity field not found', 'error');
        return;
    }

    const quantity = parseInt(quantityInput.value);
    
    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }

    const event = customEvents.find(e => e.id == eventId);

    if (!event) {
        console.error('Event not found');
        showMessage('❌ Event not found', 'error');
        return;
    }

    if (quantity > event.availableTickets) {
        console.log('Not enough tickets');
        showMessage('❌ Not enough tickets available', 'error');
        return;
    }

    console.log('Booking details valid, redirecting to payment...');

    // Store booking details and redirect to payment
    localStorage.setItem('selectedEventId', eventId);
    localStorage.setItem('bookingQuantity', quantity);
    
    showMessage('✅ Redirecting to payment...', 'success');
    
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1000);
}

// ============ UTILITY FUNCTIONS ============
function showMessage(text, type) {
    console.log('Showing message:', text, type);
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============ ADMIN AUTHENTICATION ============
function checkAdminAuth() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser) {
        console.log('No admin user found, redirecting...');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function adminLogout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

// ============ CONSOLE LOGGING ============
console.log('Script.js loaded successfully!');
console.log('Sample Events Available:', sampleEvents.length);