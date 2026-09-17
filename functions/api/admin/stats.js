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

function unauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="PR Agency Admin", charset="UTF-8"',
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!checkAuth(request, env)) {
    return unauthorizedResponse();
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    // 1. Main summary stats and status breakdown
    const row = await env.DB.prepare(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END), 0) AS today,
        COALESCE(SUM(CASE WHEN created_at >= date('now', '-7 days') THEN 1 ELSE 0 END), 0) AS week,
        COALESCE(SUM(CASE WHEN created_at >= date('now', 'start of month') THEN 1 ELSE 0 END), 0) AS month,
        COALESCE(SUM(CASE WHEN COALESCE(status, 'new') = 'new' THEN 1 ELSE 0 END), 0) AS status_new,
        COALESCE(SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END), 0) AS status_contacted,
        COALESCE(SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END), 0) AS status_closed,
        COALESCE(SUM(CASE WHEN starred = 1 THEN 1 ELSE 0 END), 0) AS starred_count
      FROM contacts;
    `).first();

    // 2. Last 7 days counts
    const last7Results = await env.DB.prepare(`
      SELECT 
        date(created_at) AS date,
        COUNT(*) AS count
      FROM contacts
      WHERE created_at >= date('now', '-6 days')
      GROUP BY date(created_at)
      ORDER BY date ASC;
    `).all();

    const countsMap = new Map();
    if (last7Results && last7Results.results) {
      for (const r of last7Results.results) {
        if (r.date) countsMap.set(r.date, Number(r.count || 0));
      }
    }

    // Build continuous array of last 7 calendar days
    const last_7_days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      last_7_days.push({
        date: dateStr,
        count: countsMap.get(dateStr) || 0
      });
    }

    return new Response(JSON.stringify({
      success: true,
      stats: {
        today: Number(row?.today || 0),
        week: Number(row?.week || 0),
        month: Number(row?.month || 0),
        total: Number(row?.total || 0),
        by_status: {
          new: Number(row?.status_new || 0),
          contacted: Number(row?.status_contacted || 0),
          closed: Number(row?.status_closed || 0)
        },
        starred_count: Number(row?.starred_count || 0),
        last_7_days
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
