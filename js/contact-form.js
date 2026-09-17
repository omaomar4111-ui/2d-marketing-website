(function () {
  'use strict';

  function initContactForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var submitBtn = document.getElementById('registerSubmit');
    var originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    var statusEl = document.getElementById('registerStatus');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.id = 'registerStatus';
      statusEl.className = 'register-status';
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
      form.appendChild(statusEl);
    }

    function setStatus(type, message) {
      statusEl.textContent = message;
      statusEl.className = 'register-status ' + type;
      statusEl.style.display = 'block';
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.style.opacity = isLoading ? '0.6' : '1';
      if (isLoading) {
        submitBtn.innerHTML = '<span>جاري الإرسال...</span>';
      } else {
        submitBtn.innerHTML = originalBtnText;
      }
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var payload = {
        name:     (formData.get('name')     || '').toString().trim(),
        phone:    (formData.get('phone')    || '').toString().trim(),
        business: (formData.get('business') || '').toString().trim(),
        budget:   (formData.get('budget')   || '').toString().trim(),
        message:  (formData.get('message')  || '').toString().trim(),
      };

      if (!payload.name || payload.name.length < 2) {
        setStatus('error', '⚠️ من فضلك اكتب اسمك');
        return;
      }
      if (!payload.phone || payload.phone.length < 8) {
        setStatus('error', '⚠️ من فضلك اكتب رقم موبايل صحيح');
        return;
      }

      setLoading(true);
      setStatus('loading', '⏳ جاري الإرسال...');

      try {
        var response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        var result = await response.json();

        if (response.ok && result.success) {
          setStatus('success', '✅ تم استلام رسالتك، هنرد عليك قريب إن شاء الله');
          form.reset();

          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              'event_category': 'form',
              'event_label': 'Contact Form',
              'value': 1
            });
          }
          if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
              content_name: 'Contact Form Submit'
            });
          }
        } else {
          var errorMsg = result.errors
            ? result.errors.join(' | ')
            : (result.error || 'حدث خطأ غير متوقع');
          setStatus('error', '❌ ' + errorMsg);
        }
      } catch (err) {
        console.error('Submit error:', err);
        setStatus('error', '❌ فشل الاتصال بالخادم، حاول مرة أخرى');
      } finally {
        setLoading(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
