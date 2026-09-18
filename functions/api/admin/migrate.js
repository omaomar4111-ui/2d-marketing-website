function checkAuth(request, env) {
  const PASS = env.ADMIN_PASSWORD || 'pr2026';
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Basic ')) return false;
  try {
    const base64 = authHeader.slice(6).trim();
    const decoded = atob(base64);
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return false;
    return decoded.slice(colonIdx + 1) === PASS;
  } catch (e) {
    return false;
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="PR Agency Admin", charset="UTF-8"',
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'DB not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const results = [];
  const queries = [
    "ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'new'",
    "ALTER TABLE contacts ADD COLUMN notes TEXT DEFAULT ''",
    "ALTER TABLE contacts ADD COLUMN starred INTEGER DEFAULT 0",
    "CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)",
    "CREATE INDEX IF NOT EXISTS idx_contacts_starred ON contacts(starred)",
    "ALTER TABLE contacts ADD COLUMN utm_source TEXT DEFAULT ''",
    "ALTER TABLE contacts ADD COLUMN utm_medium TEXT DEFAULT ''",
    "ALTER TABLE contacts ADD COLUMN utm_campaign TEXT DEFAULT ''",
    "ALTER TABLE contacts ADD COLUMN utm_content TEXT DEFAULT ''",
    "ALTER TABLE contacts ADD COLUMN lead_source TEXT DEFAULT 'website'",
    "ALTER TABLE contacts ADD COLUMN meta_lead_id TEXT DEFAULT ''",
    "CREATE INDEX IF NOT EXISTS idx_contacts_utm_campaign ON contacts(utm_campaign)",
    "CREATE INDEX IF NOT EXISTS idx_contacts_lead_source ON contacts(lead_source)"
  ];

  for (const q of queries) {
    try {
      await env.DB.prepare(q).run();
      results.push({ query: q, success: true });
    } catch (e) {
      results.push({ query: q, success: false, error: e.message });
    }
  }

  let tableInfo = [];
  try {
    const info = await env.DB.prepare("PRAGMA table_info(contacts)").all();
    tableInfo = info.results || [];
  } catch (e) {
    tableInfo = [{ error: e.message }];
  }

  return new Response(JSON.stringify({
    success: true,
    migration: results,
    columns: tableInfo
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
