const redirects = {};

module.exports = async (req, res) => {
  // Set CORS headers - THESE ARE NEEDED!
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { id } = req.query;
  
  if (req.method === 'POST') {
    const { shortId, longUrl } = req.body;
    redirects[shortId] = longUrl;
    res.json({ success: true });
    return;
  }
  
  if (id && redirects[id]) {
    res.redirect(301, redirects[id]);
  } else {
    res.status(404).send('Link not found or expired');
  }
};
