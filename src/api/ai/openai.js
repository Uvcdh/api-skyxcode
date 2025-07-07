const Groq = require('groq-sdk');

module.exports = function(app) {

  const client = new Groq({
    apiKey: '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',
  });

  async function groq(teks, prompt = 'sekarang kamu adalah ai yang siap membantu & menjawab pertanyaan dan selalu gunakan bahasa Indonesia saat menjawab') {
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: teks }
        ],
        model: 'llama3-8b-8192',
      });

      if (!chatCompletion?.choices?.[0]) {
        throw new Error('Tidak ada respons dari model Groq');
      }

      return chatCompletion.choices[0].message.content;

    } catch (e) {
      console.error('Groq Error:', e);
      throw e;
    }
  }

  app.get('/ai/openai', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) {
        return res.status(400).json({ status: false, error: 'Text is required' });
      }

      const result = await groq(text);
      res.status(200).json({ status: true, creator: 'ikann', result });

    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });

}