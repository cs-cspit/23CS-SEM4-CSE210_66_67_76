// Create this new file for handling destination bookings

// Function to handle booking form submission
function handleBookingSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const destination = document.getElementById('bookingDestination').value;
    const country = document.getElementById('bookingCountry').value;
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;
    const travelers = document.getElementById('bookingTravelers').value;
    const packageType = document.getElementById('bookingPackage').value;
    
    // Validate form data
    if (!destination || !country || !startDate || !endDate || !travelers || !packageType) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Calculate price (this is a simple example)
    let basePrice = 0;
    switch (packageType) {
        case 'basic':
            basePrice = 500;
            break;
        case 'standard':
            basePrice = 800;
            break;
        case 'premium':
            basePrice = 1200;
            break;
        default:
            basePrice = 500;
    }
    
    const numTravelers = parseInt(travelers);
    const totalPrice = basePrice * numTravelers;
    
    // Create booking details object
    const bookingDetails = {
        reference: 'TE-' + Math.floor(Math.random() * 10000000),
        destination: destination,
        country: country,
        startDate: startDate,
        endDate: endDate,
        travelers: numTravelers + (numTravelers === 1 ? ' Adult' : ' Adults'),
        package: packageType.charAt(0).toUpperCase() + packageType.slice(1) + ' Package',
        amount: '$' + totalPrice.toFixed(2)
    };
    
    // Save booking details to localStorage
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Redirect to booking confirmation page
    window.location.href = 'booking-confirmation.html';
}

// Initialize booking form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    
    // Set default dates (today and a week from today)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const startDateInput = document.getElementById('bookingStartDate');
    const endDateInput = document.getElementById('bookingEndDate');
    
    if (startDateInput && endDateInput) {
        startDateInput.valueAsDate = today;
        endDateInput.valueAsDate = nextWeek;
    }
}); 