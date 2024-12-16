// pages/api/submit.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, address } = req.body;
      
      // Store the data as desired (in-memory, database, etc.)
      // For demonstration, just log it:
      console.log('Received data:', username, address);
      
      // Respond with success
      return res.status(200).json({ success: true });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  