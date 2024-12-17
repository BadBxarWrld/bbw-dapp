export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { username, address } = req.body;
  
    if (!username || !address) {
      return res.status(400).json({ error: 'Username and address are required' });
    }
  
    const BLOB_URL = 'https://wfe3buijfalvy7yy.public.blob.vercel-storage.com/data-XSQ5qoWMjeDUn6BPPpJLdpBUMzXovK.json';
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';
  
    let data = [];
    try {
      const response = await fetch(BLOB_URL, {
        headers: {
          'Authorization': `Bearer ${BLOB_TOKEN}`
        }
      });
      if (response.ok) {
        data = await response.json();
      } else {
        data = [];
      }
    } catch {
      data = [];
    }
  
    data.push({ username, address });
  
    const updatedJSON = JSON.stringify(data, null, 2);
    const uploadResponse = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOB_TOKEN}`
      },
      body: updatedJSON
    });
  
    if (!uploadResponse.ok) {
      return res.status(500).json({ error: 'Failed to update data in Blob' });
    }
  
    res.status(200).json({ success: true });
  }
  