// Ensure StripeOnramp is defined
const StripeOnramp = window.StripeOnramp; // Use the global StripeOnramp object provided by the Stripe library

if (!StripeOnramp) {
  console.error("StripeOnramp is not defined. Ensure the Stripe library is loaded.");
}

// This is your test publishable API key.
const stripeOnramp = StripeOnramp("pk_live_51MLdCSLHGjwxTqhVmB6vDzkeqa0dngkGkqoeDlXqdbRd6Y0uEVqz8FDgQuKoykjTXOM6WPy8xCq4WodYWdC2xTCJ00CMxNbTwk");

let session;

initialize();

async function initialize() {
  // Fetches an onramp session and captures the client secret
  const response = await fetch(
    "https://dapp.badbxar.com/create-onramp-session", // ensure the backend allows CORS
    {
      method: "POST",
      mode: "cors", // explicitly enable CORS; proper server headers are still needed
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_details: {
          destination_currency: "usdc",
          destination_exchange_amount: "13.37",
          destination_network: "ethereum",
        }
      }),
    }
  );
  const { clientSecret } = await response.json();

  session = stripeOnramp
    .createSession({
      clientSecret,
      appearance: {
        theme: "dark",
      }
    })
    .addEventListener('onramp_session_updated', (e) => {
      showMessage(`OnrampSession is now in ${e.payload.session.status} state.`);
      // Revert to development link using http://localhost:port
      if (e.payload.session.id) {
        localStorage.setItem('onrampSessionId', e.payload.session.id);
        const purchaseLink = document.getElementById('purchase-crypto-link');
        if (purchaseLink) {
          purchaseLink.href = `https://dapp.badbxar.com/onramp?session=${e.payload.session.id}`;
        }
      }
    })
    .mount("#onramp-element");
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#onramp-message");
  if (messageContainer) { // only update if messageContainer exists
    messageContainer.textContent = messageText;
  }
}