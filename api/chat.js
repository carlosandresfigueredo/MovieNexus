const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo de la petición preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilice POST.' });
  }

  if (!GEMINI_API_KEY) {
    console.error('❌ Variable de entorno GEMINI_API_KEY no configurada');
    return res.status(500).json({ error: 'La clave de API de Gemini no está configurada en el servidor.' });
  }

  const { message, history } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Falta el parámetro "message" en el cuerpo de la petición.' });
  }

  // Dar formato al historial para el formato esperado de Gemini
  // History debe ser un array de objetos con formato: { role: 'user'|'model', parts: [{ text: '...' }] }
  const contents = [];
  if (Array.isArray(history)) {
    contents.push(...history);
  }
  
  // Agregar el mensaje actual del usuario al final del historial
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const systemInstructionText = `Eres 'Nexus AI', el asistente inteligente de MovieNexus.
Tu objetivo es ayudar a los usuarios con recomendaciones de películas, preguntas sobre actores, directores, curiosidades, tramas, análisis o juegos relacionados con el cine.
Sé siempre amigable, entusiasta con el séptimo arte y conciso en tus respuestas.
Usa formato Markdown para que la respuesta sea legible (puedes usar negritas, listas o viñetas).

IMPORTANTE: Debes responder EXCLUSIVAMENTE en formato JSON con la siguiente estructura:
{
  "reply": "Tu mensaje de respuesta en español, usando formato Markdown si es necesario.",
  "movieQueries": ["Título exacto de película 1", "Título exacto de película 2", ...]
}

Reglas críticas para 'movieQueries':
1. Si en tu respuesta recomiendas o mencionas películas específicas, añade sus títulos exactos al arreglo "movieQueries" (máximo 5 películas).
2. Si no estás recomendando ninguna película específica (por ejemplo, si te saludan o te hacen una pregunta general), deja "movieQueries" vacío: [].
3. No inventes títulos de películas. Usa nombres comerciales o títulos conocidos para que el buscador de TMDB pueda localizarlas con éxito.`;

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('❌ Error de la API de Gemini:', errorText);
      return res.status(geminiRes.status).json({ error: `Error de la API de Gemini: ${errorText}` });
    }

    const data = await geminiRes.json();
    
    // Obtener la respuesta textual del candidato generado
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return res.status(500).json({ error: 'No se generó ninguna respuesta desde Gemini.' });
    }

    // Parsear el texto obtenido como JSON (dado que especificamos responseMimeType: 'application/json')
    try {
      const parsedResponse = JSON.parse(textResponse);
      return res.status(200).json(parsedResponse);
    } catch (parseError) {
      console.error('❌ Error al parsear la respuesta como JSON:', textResponse);
      // Fallback por seguridad
      return res.status(200).json({
        reply: textResponse,
        movieQueries: []
      });
    }
  } catch (err) {
    console.error('❌ Error en la función serverless:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
