exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;
  try {
    const { description, ville, metier } = JSON.parse(event.body);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Tu es expert en tarification BTP en France. Un artisan ${metier} \u00e0 ${ville} doit chiffrer : "${description}". Donne une fourchette de prix r\u00e9aliste en TTC. R\u00e9ponds en 2 lignes max : "Fourchette estim\u00e9e : X\u20ac - Y\u20ac TTC. [conseil court]"`
        }]
      })
    });
    const data = await res.json();
    const suggestion = data.content?.[0]?.text || '';
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ suggestion })
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
