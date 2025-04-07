// This is your test publishable API key.
const stripeOnramp = StripeOnramp("pk_live_51MLdCSLHGjwxTqhVmB6vDzkeqa0dngkGkqoeDlXqdbRd6Y0uEVqz8FDgQuKoykjTXOM6WPy8xCq4WodYWdC2xTCJ00CMxNbTwk");

let session;

initialize();

async function initialize() {
  // Fetches an onramp session and captures the client secret
  const response = await fetch(
    "https://dapp.badbxar.com/create-onramp-session",
    {
      method: "POST",
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

  if (!response.ok) {
    console.error("Failed to fetch onramp session:", response.statusText);
    return;
  }

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
    })
    .mount("#onramp-element");
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#onramp-message");

  messageContainer.textContent = messageText;
}