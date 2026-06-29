export function showConfirmation(data) {
  const box = document.getElementById('confirmationBox');
  if (!box) return;

  box.innerHTML = `
    <h3>Booking confirmed</h3>
    <p>Name: ${data.name}</p>
    <p>Guests: ${data.guests}</p>
  `;
}
