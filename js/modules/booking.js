export function initBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value;
    const guests = form.querySelector('#guests')?.value;

    console.log('Booking:', { name, guests });
    alert('Booking submitted (demo)');
  });
}
