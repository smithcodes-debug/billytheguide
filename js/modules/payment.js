export function initPayment() {
  const btn = document.getElementById('paymentButton');
  if (!btn) return;

  btn.addEventListener('click', () => {
    console.log('Processing payment...');
    alert('Payment demo success');
  });
}
