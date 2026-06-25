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

// ============ ADMIN DASHBOARD ============
function loadAdminDashboard() {
    console.log('Loading admin dashboard...');
    
    // Check admin auth
    if (!checkAdminAuth()) {
        return;
    }

    // Get all data
    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }
    
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Calculate stats
    const totalEvents = customEvents.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalUsers = users.length;

    console.log('Stats:', {totalEvents, totalBookings, totalRevenue, totalUsers});

    // Update stats
    const totalEventsEl = document.getElementById('totalEvents');
    const totalBookingsEl = document.getElementById('totalBookings');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalUsersEl = document.getElementById('totalUsers');

    if (totalEventsEl) totalEventsEl.textContent = totalEvents;
    if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toFixed(2);
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;

    // Load recent bookings (last 10)
    const recentBookings = bookings.slice(-10).reverse();
    loadRecentBookings(recentBookings, users, customEvents);
}

function loadRecentBookings(bookings, users, events) {
    const tableBody = document.getElementById('recentBookingsTable');
    
    if (!tableBody) {
        console.error('recentBookingsTable not found');
        return;
    }

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No bookings yet</td></tr>';
        return;
    }

    tableBody.innerHTML = bookings.map(booking => {
        const user = users.find(u => u.id === booking.userId);
        const event = events.find(e => e.id === booking.eventId);
        
        return `
            <tr>
                <td><strong>${booking.id}</strong></td>
                <td>${user ? user.email : 'Unknown'}</td>
                <td>${event ? event.title : 'Unknown Event'}</td>
                <td>${booking.quantity}</td>
                <td>$${booking.totalPrice.toFixed(2)}</td>
                <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge status-${booking.status}">
                        ${booking.status}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// ============ MANAGE EVENTS ============
function loadAdminEvents() {
    console.log('Loading admin events...');
    
    if (!checkAdminAuth()) {
        return;
    }

    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
        localStorage.setItem('customEvents', JSON.stringify(customEvents));
    }

    const tableBody = document.getElementById('eventsTable');
    
    if (!tableBody) {
        console.error('eventsTable not found');
        return;
    }

    if (customEvents.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No events yet</td></tr>';
        return;
    }

    tableBody.innerHTML = customEvents.map(event => `
        <tr>
            <td><strong>${event.title}</strong></td>
            <td>${event.date}</td>
            <td>$${event.price.toFixed(2)}</td>
            <td>${event.totalTickets}</td>
            <td>${event.availableTickets}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-sm btn-edit" onclick="editEvent(${event.id})">Edit</button>
                    <button class="btn-sm btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleAddEvent(e) {
    e.preventDefault();
    console.log('Adding new event...');

    const formData = new FormData(document.getElementById('addEventForm'));
    
    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }
    
    const newEvent = {
        id: Math.max(...customEvents.map(e => e.id), 0) + 1,
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        price: parseFloat(formData.get('price')),
        totalTickets: parseInt(formData.get('totalTickets')),
        availableTickets: parseInt(formData.get('totalTickets')),
        image: formData.get('image') || 'https://via.placeholder.com/400x200/667eea/ffffff?text=Event'
    };

    customEvents.push(newEvent);
    localStorage.setItem('customEvents', JSON.stringify(customEvents));

    showMessage('✅ Event added successfully!', 'success');
    document.getElementById('addEventForm').reset();
    
    setTimeout(() => {
        loadAdminEvents();
    }, 1000);
}

function editEvent(eventId) {
    alert('✏️ Edit functionality coming soon!');
}

function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }

    customEvents = customEvents.filter(e => e.id !== eventId);
    localStorage.setItem('customEvents', JSON.stringify(customEvents));

    showMessage('✅ Event deleted successfully!', 'success');
    loadAdminEvents();
}

// ============ VIEW BOOKINGS ============
function loadAdminBookings() {
    console.log('Loading admin bookings...');
    
    if (!checkAdminAuth()) {
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }

    displayBookings(bookings, users, customEvents);
}

function displayBookings(bookings, users, events) {
    const tableBody = document.getElementById('bookingsTable');
    
    if (!tableBody) {
        console.error('bookingsTable not found');
        return;
    }

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No bookings yet</td></tr>';
        return;
    }

    tableBody.innerHTML = bookings.map(booking => {
        const user = users.find(u => u.id === booking.userId);
        const event = events.find(e => e.id === booking.eventId);
        
        return `
            <tr>
                <td><strong>${booking.id}</strong></td>
                <td>${user ? user.email : 'Unknown'}</td>
                <td>${event ? event.title : 'Unknown Event'}</td>
                <td>${booking.quantity}</td>
                <td>$${booking.totalPrice.toFixed(2)}</td>
                <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge status-${booking.status}">
                        ${booking.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-view" onclick="viewBooking(${booking.id})">View</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterBookings() {
    const searchTerm = document.getElementById('searchBooking').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let customEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!customEvents) {
        customEvents = sampleEvents;
    }

    let filtered = bookings;

    if (searchTerm) {
        filtered = filtered.filter(b => 
            b.id.toString().includes(searchTerm) ||
            users.find(u => u.id === b.userId && u.email.includes(searchTerm))
        );
    }

    if (statusFilter) {
        filtered = filtered.filter(b => b.status === statusFilter);
    }

    displayBookings(filtered, users, customEvents);
}

function viewBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        localStorage.setItem('currentBooking', JSON.stringify(booking));
        window.location.href = 'ticket.html';
    }
}