console.log('ticket-script.js loading...');

// ============ LOAD TICKET DETAILS ============
function loadTicketDetails() {
    console.log('Loading ticket details...');
    
    const booking = JSON.parse(localStorage.getItem('currentBooking'));

    console.log('Booking:', booking);

    if (!booking) {
        document.querySelector('.ticket-container').innerHTML = '<p style="padding: 2rem; text-align: center;">❌ Ticket not found. <a href="index.html">Go home</a></p>';
        return;
    }

    // Update ticket details
    const bookingIdEl = document.getElementById('ticketBookingId');
    const eventNameEl = document.getElementById('ticketEventName');
    const eventDateEl = document.getElementById('ticketEventDate');
    const eventTimeEl = document.getElementById('ticketEventTime');
    const eventLocationEl = document.getElementById('ticketEventLocation');
    const quantityEl = document.getElementById('ticketQuantity');
    const priceEl = document.getElementById('ticketPrice');
    const totalPriceEl = document.getElementById('ticketTotalPrice');
    const bookingDateEl = document.getElementById('ticketBookingDate');

    if (bookingIdEl) bookingIdEl.textContent = booking.id;
    if (eventNameEl) eventNameEl.textContent = booking.eventTitle;
    if (eventDateEl) eventDateEl.textContent = booking.eventDate;
    if (eventTimeEl) eventTimeEl.textContent = booking.eventTime;
    if (eventLocationEl) eventLocationEl.textContent = booking.eventLocation;
    if (quantityEl) quantityEl.textContent = booking.quantity + ' ticket' + (booking.quantity > 1 ? 's' : '');
    if (priceEl) priceEl.textContent = '$' + booking.eventPrice.toFixed(2);
    if (totalPriceEl) totalPriceEl.textContent = '$' + booking.totalPrice.toFixed(2);
    if (bookingDateEl) bookingDateEl.textContent = booking.bookingDate;

    // Generate QR Code
    generateQRCode(booking.id);
}

// ============ GENERATE QR CODE ============
function generateQRCode(bookingId) {
    const qrContainer = document.getElementById('qrCode');
    if (qrContainer) {
        qrContainer.innerHTML = ''; // Clear previous QR code

        new QRCode(qrContainer, {
            text: bookingId,
            width: 200,
            height: 200,
            colorDark: '#667eea',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// ============ DOWNLOAD TICKET AS PDF ============
function downloadTicketPDF() {
    const booking = JSON.parse(localStorage.getItem('currentBooking'));
    
    if (!booking) {
        alert('Booking not found');
        return;
    }

    console.log('Downloading ticket PDF for booking:', booking.id);

    // Create a compact ticket template
    const ticketHTML = `
        <div style="width: 400px; font-family: Arial, sans-serif; padding: 20px; border: 2px solid #667eea; border-radius: 10px; background: white;">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #667eea;">🎟️ EVENT TICKET</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Your Digital Ticket</p>
            </div>

            <!-- Booking ID -->
            <div style="background: #f0f4ff; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 15px;">
                <p style="margin: 0; font-size: 11px; color: #666;">BOOKING ID</p>
                <p style="margin: 3px 0; font-size: 16px; font-weight: bold; color: #667eea; font-family: 'Courier New';">${booking.id}</p>
            </div>

            <!-- Event Details -->
            <div style="margin-bottom: 15px; font-size: 13px;">
                <div style="margin-bottom: 8px;">
                    <span style="color: #666; font-weight: bold;">EVENT:</span>
                    <span style="color: #333;">${booking.eventTitle}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: #666; font-weight: bold;">DATE:</span>
                    <span style="color: #333;">${booking.eventDate}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: #666; font-weight: bold;">TIME:</span>
                    <span style="color: #333;">${booking.eventTime}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: #666; font-weight: bold;">LOCATION:</span>
                    <span style="color: #333;">${booking.eventLocation}</span>
                </div>
            </div>

            <!-- Tickets & Price -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 0; font-size: 13px;">
                <div style="text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 11px;">TICKETS</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #667eea; font-size: 18px;">${booking.quantity}</p>
                </div>
                <div style="text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 11px;">TOTAL</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #667eea; font-size: 18px;">$${booking.totalPrice.toFixed(2)}</p>
                </div>
            </div>

            <!-- QR Code -->
            <div style="text-align: center; margin-bottom: 15px; border: 1px dashed #667eea; padding: 10px; border-radius: 5px;">
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #666;">SCAN AT ENTRANCE</p>
                <div id="qrCodePDF" style="display: inline-block;"></div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px;">
                <p style="margin: 0;">🔒 Secure Digital Ticket</p>
                <p style="margin: 3px 0 0 0;">Booked on: ${booking.bookingDate}</p>
            </div>
        </div>
    `;

    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ticketHTML;
    document.body.appendChild(tempDiv);

    // Generate QR code in the temporary container
    const qrCodeDiv = tempDiv.querySelector('#qrCodePDF');
    new QRCode(qrCodeDiv, {
        text: booking.id,
        width: 150,
        height: 150,
        colorDark: '#667eea',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    // Wait for QR code to render
    setTimeout(() => {
        // Generate PDF using html2pdf
        const opt = {
            margin: 5,
            filename: `Ticket-${booking.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: [120, 180] } // Compact ticket size
        };

        html2pdf().set(opt).from(tempDiv).save().then(() => {
            console.log('✅ PDF downloaded successfully');
            document.body.removeChild(tempDiv);
        });
    }, 500);
}

// ============ SHARE TICKET ============
function shareTicket() {
    const booking = JSON.parse(localStorage.getItem('currentBooking'));
    
    if (!booking) {
        alert('Booking not found');
        return;
    }

    const message = `🎟️ I just booked tickets for ${booking.eventTitle}! 
📅 ${booking.eventDate} at ${booking.eventTime}
🎫 Tickets: ${booking.quantity}
💰 Total: $${booking.totalPrice.toFixed(2)}
🔖 Booking ID: ${booking.id}

Get your tickets now at EventBook! 🎉`;

    if (navigator.share) {
        navigator.share({
            title: 'EventBook Ticket',
            text: message
        }).catch(err => console.error('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert('✅ Ticket details copied to clipboard!');
        });
    }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', loadTicketDetails);

console.log('ticket-script.js loaded successfully!');