console.log('payment-script.js loaded');

// ============ LOAD PAYMENT DETAILS ============
function loadPaymentDetails() {
    console.log('=== loadPaymentDetails CALLED ===');
    
    const eventId = localStorage.getItem('selectedEventId');
    const quantity = localStorage.getItem('bookingQuantity');
    
    console.log('Event ID:', eventId);
    console.log('Quantity:', quantity);
    
    // Get custom events or use sample events
    let allEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!allEvents) {
        console.log('Using sample events');
        allEvents = sampleEvents;
    }

    console.log('Total events:', allEvents.length);
    
    const event = allEvents.find(e => e.id == eventId);
    console.log('Event found:', event);

    if (!event) {
        console.error('Event not found');
        showPaymentMessage('❌ Event not found', 'error');
        return;
    }

    if (!quantity) {
        console.error('Quantity not found');
        showPaymentMessage('❌ Quantity not found', 'error');
        return;
    }

    const totalPrice = event.price * quantity;

    console.log('Event:', event.title);
    console.log('Price:', event.price);
    console.log('Quantity:', quantity);
    console.log('Total:', totalPrice);

    // Update payment details - use DOM manipulation
    const eventNameEl = document.getElementById('paymentEventName');
    const eventDateEl = document.getElementById('paymentEventDate');
    const quantityEl = document.getElementById('paymentQuantity');
    const priceEl = document.getElementById('paymentPrice');
    const totalEl = document.getElementById('paymentTotal');

    if (eventNameEl) {
        eventNameEl.textContent = event.title;
        console.log('✅ Set event name');
    }
    if (eventDateEl) {
        eventDateEl.textContent = event.date + ' at ' + event.time;
        console.log('✅ Set event date');
    }
    if (quantityEl) {
        quantityEl.textContent = quantity + ' ticket' + (quantity > 1 ? 's' : '');
        console.log('✅ Set quantity');
    }
    if (priceEl) {
        priceEl.textContent = '$' + event.price.toFixed(2);
        console.log('✅ Set price');
    }
    if (totalEl) {
        totalEl.textContent = '$' + totalPrice.toFixed(2);
        console.log('✅ Set total price');
    }

    console.log('✅ Payment details loaded successfully');
}

// ============ PROCESS PAYMENT ============
function processPayment() {
    console.log('=== processPayment CALLED ===');
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!paymentMethod) {
        showPaymentMessage('❌ Please select a payment method', 'error');
        return;
    }

    const method = paymentMethod.value;
    console.log('Payment method selected:', method);

    if (method === 'demo') {
        console.log('Processing demo payment...');
        processDemoPayment();
    } else if (method === 'stripe') {
        console.log('Processing Stripe payment...');
        processStripePayment();
    }
}

// ============ DEMO PAYMENT ============
function processDemoPayment() {
    console.log('Starting demo payment...');
    
    const button = document.getElementById('paymentButton');
    button.disabled = true;
    button.textContent = 'Processing Payment...';

    showPaymentMessage('Processing your payment...', 'info');

    // Simulate payment processing
    setTimeout(() => {
        console.log('Demo payment completed');
        completePayment();
    }, 2000);
}

// ============ STRIPE PAYMENT ============
async function processStripePayment() {
    console.log('Starting Stripe payment...');
    
    const button = document.getElementById('paymentButton');
    button.disabled = true;
    button.textContent = 'Processing Payment...';

    try {
        showPaymentMessage('Processing Stripe payment...', 'info');
        
        // For demo purposes, just complete the payment
        // In production, you would integrate with Stripe API
        setTimeout(() => {
            console.log('Stripe payment completed');
            completePayment();
        }, 2000);
        
    } catch (error) {
        console.error('Stripe error:', error);
        showPaymentMessage('❌ Error: ' + error.message, 'error');
        button.disabled = false;
        button.textContent = 'Complete Payment';
    }
}

// ============ COMPLETE PAYMENT ============
function completePayment() {
    console.log('=== completePayment CALLED ===');
    
    const eventId = localStorage.getItem('selectedEventId');
    const quantity = parseInt(localStorage.getItem('bookingQuantity'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log('Current user:', currentUser);

    if (!currentUser) {
        console.error('User not logged in');
        showPaymentMessage('❌ User not logged in', 'error');
        return;
    }

    // Get custom events or use sample events
    let allEvents = JSON.parse(localStorage.getItem('customEvents'));
    if (!allEvents) {
        allEvents = sampleEvents;
    }

    const event = allEvents.find(e => e.id == eventId);

    if (!event) {
        console.error('Event not found during payment completion');
        showPaymentMessage('❌ Event not found', 'error');
        return;
    }

    console.log('Event found:', event.title);

    // Generate unique booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    console.log('Generated booking ID:', bookingId);

    // Create booking
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    const booking = {
        id: bookingId,
        userId: currentUser.id,
        eventId: event.id,
        eventTitle: event.title,
        quantity: quantity,
        totalPrice: event.price * quantity,
        bookingDate: new Date().toLocaleString(),
        status: 'confirmed',
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        eventPrice: event.price
    };

    console.log('Creating booking:', booking);

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('✅ Booking saved to localStorage');

    // Update event tickets
    event.availableTickets -= quantity;
    localStorage.setItem('customEvents', JSON.stringify(allEvents));
    console.log('✅ Event tickets updated');

    // Store current booking for ticket page
    localStorage.setItem('currentBooking', JSON.stringify(booking));
    console.log('✅ Current booking saved');

    showPaymentMessage('✅ Payment successful! Redirecting to your ticket...', 'success');

    console.log('Redirecting to ticket page...');
    
    // Redirect to ticket page
    setTimeout(() => {
        window.location.href = 'ticket.html';
    }, 1500);
}

// ============ SHOW PAYMENT MESSAGE ============
function showPaymentMessage(text, type) {
    console.log('Showing message:', text, type);
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
    }
}