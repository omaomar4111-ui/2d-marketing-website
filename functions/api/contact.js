export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  try {
    const contentType = request.headers.get('content-type') || '';
    let data = {};

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const name     = String(data.name     || '').trim().slice(0, 100);
    const phone    = String(data.phone    || '').trim().slice(0, 30);
    const business = String(data.business || '').trim().slice(0, 100);
    const budget   = String(data.budget   || '').trim().slice(0, 50);
    const message  = String(data.message  || '').trim().slice(0, 2000);

    const errors = [];
    if (!name || name.length < 2)   errors.push('الاسم مطلوب (حرفين على الأقل)');
    if (!phone || phone.length < 8) errors.push('رقم الموبايل غير صحيح');

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors }),
        { status: 400, headers: corsHeaders }
      );
    }

    const ip = request.headers.get('CF-Connecting-IP')
            || request.headers.get('X-Forwarded-For')
            || 'unknown';
    const userAgent = (request.headers.get('User-Agent') || '').slice(0, 500);

    if (!env.DB) {
      console.error('D1 binding "DB" not found');
      return new Response(
        JSON.stringify({ success: false, error: 'Database not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const result = await env.DB.prepare(
      `INSERT INTO contacts (name, phone, business, budget, message, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, phone, business, budget, message, ip, userAgent).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم استلام رسالتك بنجاح',
        id: result.meta?.last_row_id || null,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'حدث خطأ في الخادم، حاول مرة أخرى',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
