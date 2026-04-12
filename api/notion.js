const NOTION_VERSION = '2022-06-28';
const NOTION_BASE = 'https://api.notion.com/v1';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(500).json({ error: 'NOTION_TOKEN 未設定' });

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: '缺少 path 參數' });

  try {
    const notionRes = await fetch(`${NOTION_BASE}/${path}`, {
      method: req.method === 'GET' ? 'GET' : req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });
    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
