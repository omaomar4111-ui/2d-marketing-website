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

    // -------------------------------------------------------------
    // Send email notification via Resend (Isolated try/catch)
    // -------------------------------------------------------------
    try {
      const RESEND_KEY = env.RESEND_API_KEY || (typeof atob !== 'undefined' ? atob('cmVfNFpmVjliZG9fNnR2dGN3TTNLZVN4bTRMTmVOSldkZU5w') : '');

      function escapeHtml(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function cleanPhoneForWa(p) {
        if (!p) return '';
        let num = p.replace(/[^0-9]/g, '');
        if (num.startsWith('01')) num = '20' + num.substring(1);
        else if (!num.startsWith('20') && num.length === 10) num = '20' + num;
        return num;
      }

      const waNumber = cleanPhoneForWa(phone);
      const waLink = waNumber ? `https://wa.me/${waNumber}` : 'https://wa.me/';
      const egyptTime = new Intl.DateTimeFormat('ar-EG', {
        timeZone: 'Africa/Cairo',
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(new Date());

      const emailHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; background-color: #040000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #0d0606; border: 1px solid #2a0b0b; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #180000 0%, #040000 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #c00000; }
    .brand { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
    .badge { display: inline-block; background: rgba(192, 0, 0, 0.15); color: #ff4d4d; border: 1px solid #c00000; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 10px; }
    .content { padding: 28px 24px; }
    .intro { font-size: 16px; color: #d1d5db; margin-bottom: 24px; line-height: 1.6; }
    .table-box { width: 100%; border-collapse: collapse; margin-bottom: 28px; background: #070202; border-radius: 8px; border: 1px solid #220808; overflow: hidden; }
    .table-box td { padding: 14px 16px; font-size: 15px; border-bottom: 1px solid #1a0606; text-align: right; }
    .table-box tr:last-child td { border-bottom: none; }
    .label { color: #9ca3af; font-weight: 600; width: 32%; }
    .val { color: #ffffff; font-weight: 500; }
    .val-highlight { color: #fbbf24; font-weight: 700; }
    .btn-wrap { text-align: center; margin: 30px 0 10px 0; }
    .btn { display: inline-block; background-color: #c00000; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 16px; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 14px rgba(192, 0, 0, 0.4); }
    .meta { font-size: 13px; color: #6b7280; text-align: center; margin-top: 20px; }
    .footer { background: #040000; padding: 20px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1f0808; }
  </style>
</head>
<body dir="rtl">
  <div style="padding: 20px 10px; background-color: #040000;">
    <div class="wrapper">
      <div class="header">
        <h1 class="brand">PR Agency</h1>
        <div class="badge">🔔 رسالة جديدة من الموقع</div>
      </div>
      <div class="content">
        <p class="intro">وصلت رسالة تواصل جديدة عبر استمارة الموقع الإلكتروني، وفيما يلي تفاصيل العميل:</p>
        <table class="table-box" cellpadding="0" cellspacing="0">
          <tr>
            <td class="label">الاسم:</td>
            <td class="val"><strong>${escapeHtml(name)}</strong></td>
          </tr>
          <tr>
            <td class="label">رقم الموبايل:</td>
            <td class="val" dir="ltr" style="text-align:right;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td class="label">نوع النشاط:</td>
            <td class="val">${escapeHtml(business) || 'غير محدد'}</td>
          </tr>
          <tr>
            <td class="label">الميزانية المتوقعة:</td>
            <td class="val val-highlight">${escapeHtml(budget) || 'غير محدد'}</td>
          </tr>
          <tr>
            <td class="label" style="vertical-align:top;">نص الرسالة:</td>
            <td class="val" style="line-height:1.6; white-space:pre-wrap;">${escapeHtml(message) || '—'}</td>
          </tr>
        </table>

        <div class="btn-wrap">
          <a href="${waLink}" target="_blank" class="btn">
            💬 تواصل مع العميل عبر واتساب
          </a>
        </div>

        <p class="meta">وقت الإرسال: ${egyptTime} (بتوقيت مصر)</p>
      </div>
      <div class="footer">
        © 2026 PR Agency. جميع الحقوق محفوظة.<br>
        هذا الإشعار تلقائي من نظام إدارة العملاء في PR Agency.
      </div>
    </div>
  </div>
</body>
</html>`;

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PR Agency <onboarding@resend.dev>',
          to: 'omaomar4111@gmail.com',
          reply_to: 'omaomar4111@gmail.com',
          subject: `🔔 رسالة جديدة من ${name}`,
          html: emailHtml,
        }),
      });

      if (emailRes.ok) {
        const emailJson = await emailRes.json();
        console.log('Resend email sent successfully:', emailJson);
      } else {
        const errText = await emailRes.text();
        console.error('Resend API returned error:', emailRes.status, errText);
      }
    } catch (emailErr) {
      console.error('Failed to send Resend email notification:', emailErr);
    }

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
