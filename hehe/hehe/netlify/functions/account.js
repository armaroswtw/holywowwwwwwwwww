exports.handler = async (event) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const API_KEY = (
      process.env.BRIXHUB_API_KEY ||
      process.env.BRIXHUBAPIKEY ||
      ""
    ).trim();
    const BASE_URL = 'https://brixhub.net/api/v1';
    const USER_AGENT = 'yhnlookup/1.0';

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Récupérer les infos du compte
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 yhnlookup/1.0',
        'Accept': 'application/json',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://yhnlookup.netlify.app/',
        'Origin': 'https://yhnlookup.netlify.app',
        'Content-Type': 'application/json'
      }
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (_err) {
      return {
        statusCode: 502,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Upstream returned non-JSON response',
          hint: 'Cloudflare/invalid API key likely. Verify BRIXHUB_API_KEY and User-Agent requirements.',
          upstream_status: response.status,
          upstream_content_type: response.headers.get('content-type') || '',
          upstream_preview: raw.slice(0, 180)
        })
      };
    }

    return {
      statusCode: response.status,
      headers: {
        'X-RateLimit-Limit-Day': response.headers.get('X-RateLimit-Limit-Day') || '',
        'X-RateLimit-Remaining-Day': response.headers.get('X-RateLimit-Remaining-Day') || '',
        'X-RateLimit-Limit-Min': response.headers.get('X-RateLimit-Limit-Min') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
