/* ══════════════════════════════════════════════════════════════
   2D MARKETING — SHARED JS ENGINE
══════════════════════════════════════════════════════════════ */
(function() {
'use strict';

var CFG = {
  supabaseUrl:     'https://YOUR_PROJECT.supabase.co',
  supabaseKey:     'YOUR_ANON_KEY',
  supabaseEnabled: false,
  ownerPhone:      '201144826641'
};

var TRACKING = window.TRACKING || {GTM:{enabled:false},GA4:{enabled:false},META:{enabled:false},TIKTOK:{enabled:false}};
window.dataLayer = window.dataLayer || [];

function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return (c||document).querySelectorAll(s);}
function on(el,ev,fn,opt){if(el)el.addEventListener(ev,fn,opt||false);}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function clamp(v,a,b){return Math.min(Math.max(v,a),b);}
function debounce(fn,ms){var t;return function(){clearTimeout(t);t=setTimeout(fn,ms);};}
function validatePhone(p){var c=p.replace(/[\s\-+]/g,'');return /^(01[0125]\d{8}|201[0125]\d{8})$/.test(c);}
function normalizePhone(p){var c=p.replace(/[\s\-+]/g,'');return c.startsWith('201')?c:c.startsWith('01')?'2'+c:c;}

function track(loc,action){
  window.dataLayer.push({event:'2d_cta',cta_location:loc,cta_action:action,ts:Date.now()});
  if(typeof gtag==='function'&&TRACKING.GA4.enabled)gtag('event',action,{event_category:loc});
  if(typeof fbq==='function'&&TRACKING.META.enabled)fbq('trackCustom',action,{location:loc});
}
window.track = track;

function saveLocal(lead){
  try{
    var list=JSON.parse(lsGet('leads_2d')||'[]');
    list.push(Object.assign({},lead,{_ts:new Date().toISOString()}));
    lsSet('leads_2d',JSON.stringify(list));
    return true;
  }catch(e){return false;}
}

function saveSupabase(lead){
  if(!CFG.supabaseEnabled)return Promise.resolve({ok:false});
  return fetch(CFG.supabaseUrl+'/rest/v1/leads',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'apikey':CFG.supabaseKey,
      'Authorization':'Bearer '+CFG.supabaseKey,
      'Prefer':'return=minimal'
    },
    body:JSON.stringify(lead)
  }).then(function(r){return {ok:r.ok};}).catch(function(){return {ok:false};});
}

function initLoader() {
  var l = $('#loader');
  if (!l) return;
  var reveal = function() {
    l.classList.add('hidden');
    document.body.classList.remove('loading');
  };
  setTimeout(reveal, 200);
}

function initProgressBar(){
  var b=$('#progress-bar');if(!b)return;
  on(window,'scroll',function(){
    var p=window.scrollY/(document.body.scrollHeight-window.innerHeight);
    b.style.transform='scaleX('+clamp(p,0,1)+')';
  },{passive:true});
}

function initHeader(){
  var h=$('#hdr');if(!h)return;
  on(window,'scroll',function(){h.classList.toggle('scrolled',window.scrollY>60);},{passive:true});
}

function initMobileMenu(){
  var b=$('#hdr-burger'),m=$('#mmenu');if(!b||!m)return;
  var c=$('.mmenu-close',m);
  on(b,'click',function(){m.classList.add('open');document.body.style.overflow='hidden';});
  on(c,'click',close);
  on(m,'click',function(e){if(e.target===m)close();});
  on(document,'keydown',function(e){if(e.key==='Escape')close();});
  function close(){m.classList.remove('open');document.body.style.overflow='';}
}

function initParticles(){
  var c=$('#particle-canvas');if(!c)return;
  if(window.innerWidth<1024){c.style.display='none';return;}
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var ctx=c.getContext('2d'),W,H,ps=[],mx=-999,my=-999;
  var count=30;
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize();on(window,'resize',debounce(resize,250));
  on(document,'mousemove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});
  for(var i=0;i<count;i++)ps.push({
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    r:Math.random()*1.4+0.3,
    vx:(Math.random()-0.5)*0.25,
    vy:(Math.random()-0.5)*0.25,
    alpha:Math.random()*0.4+0.1
  });
  function loop(){
    ctx.clearRect(0,0,W,H);
    ps.forEach(function(p){
      var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){p.vx+=dx/d*0.04;p.vy+=dy/d*0.04;}
      p.vx*=0.995;p.vy*=0.995;p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(192,0,0,'+p.alpha+')';ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
  setTimeout(function(){c.classList.add('visible');},400);
}

function initCursor(){
  var d=$('#cursor'),r=$('#cursor-ring');if(!d||!r)return;
  if(window.innerWidth<1024)return;
  if(window.matchMedia('(hover:none)').matches)return;
  var rx=0,ry=0,mx=0,my=0;
  on(document,'mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    d.style.left=mx+'px';d.style.top=my+'px';
  });
  function a(){
    rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
    r.style.left=rx+'px';r.style.top=ry+'px';
    requestAnimationFrame(a);
  }
  a();
  $$('a,button,.service-card,.blog-card,.value-card,.process-step,.conv-choice,.fq').forEach(function(el){
    on(el,'mouseenter',function(){r.classList.add('hover');});
    on(el,'mouseleave',function(){r.classList.remove('hover');});
  });
  on(document,'mousedown',function(){r.classList.add('click');});
  on(document,'mouseup',function(){r.classList.remove('click');});
}

function initRipple(){
  $$('.btn-primary,.btn-gold,.mbar-cta,.conv-send').forEach(function(b){
    on(b,'click',function(e){
      b.classList.add('ripple-host');
      var rec=b.getBoundingClientRect(),sz=Math.max(rec.width,rec.height)*1.5;
      var x=(e.clientX||rec.left+rec.width/2)-rec.left-sz/2;
      var y=(e.clientY||rec.top+rec.height/2)-rec.top-sz/2;
      var w=document.createElement('span');w.className='ripple-wave';
      w.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+x+'px;top:'+y+'px';
      b.appendChild(w);
      setTimeout(function(){w.remove();},600);
    });
  });
}

function initFAQ(){
  $$('.fq').forEach(function(fq){
    fq.setAttribute('aria-expanded','false');
    var ans=fq.nextElementSibling;
    if(ans&&!ans.classList.contains('fa-body'))ans.classList.add('fa-body');
    on(fq,'click',function(){
      var open=fq.getAttribute('aria-expanded')==='true';
      $$('.fq').forEach(function(f){
        f.setAttribute('aria-expanded','false');
        var a=f.nextElementSibling;
        if(a&&a.classList.contains('fa-body'))a.classList.remove('open');
      });
      if(!open){
        fq.setAttribute('aria-expanded','true');
        if(ans)ans.classList.add('open');
      }
    });
  });
}

function initScrollReveal(){
  var els=$$('.rv');if(!els.length)return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('v');});
    return;
  }
  var o=new IntersectionObserver(function(en){
    en.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('v');o.unobserve(e.target);}
    });
  },{threshold:0.01,rootMargin:'0px 0px 200px 0px'});
  els.forEach(function(e){o.observe(e);});
}

function animateCounter(el){
  var t=parseFloat(el.dataset.target||0);
  var s=el.dataset.suffix||'';
  var p=el.dataset.prefix||'';
  var d=parseInt(el.dataset.decimal||'0');
  var dur=1800,st=null;
  function step(ts){
    if(!st)st=ts;
    var pr=Math.min((ts-st)/dur,1);
    var e=1-Math.pow(1-pr,3);
    var v=t*e;
    el.textContent=p+(d?v.toFixed(d):Math.floor(v))+s;
    if(pr<1)requestAnimationFrame(step);
    else el.textContent=p+(d?t.toFixed(d):t)+s;
  }
  requestAnimationFrame(step);
}

function initCounters(){
  var t=$$('.stats-grid,.counters-row');if(!t.length)return;
  if(!('IntersectionObserver' in window)){
    $$('[data-target]').forEach(animateCounter);
    return;
  }
  var o=new IntersectionObserver(function(en){
    if(!en[0].isIntersecting)return;
    o.disconnect();
    $$('[data-target]').forEach(animateCounter);
  },{threshold:0.3});
  t.forEach(function(e){o.observe(e);});
}

function initBackToTop(){
  var btn=$('#back-to-top');if(!btn)return;
  on(window,'scroll',function(){
    btn.classList.toggle('visible',window.scrollY>600);
  },{passive:true});
  on(btn,'click',function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

function initFooterYear(){
  var y=$('#footer-year');
  if(y)y.textContent=new Date().getFullYear();
}

function initNavActive(){
  var p=window.location.pathname.replace(/\/$/,'')||'/';
  $$('.hdr-nav a,.mmenu-links a').forEach(function(a){
    var h=a.getAttribute('href')||'';
    if(h==='./'||h==='/'||h==='index.html'){
      if(p==='/'||p===''||p.endsWith('/index.html'))a.classList.add('active');
    } else if(p.indexOf(h.replace(/\.html$/,'').replace(/\/$/,''))>-1){
      a.classList.add('active');
    }
  });
}

function initContactForm(){
  var form=$('#contact-form');if(!form)return;
  var phoneI=$('#cf-phone',form);
  var nameI=$('#cf-name',form);
  var bizI=$('#cf-business',form);
  var msgI=$('#cf-message',form);
  var sub=$('#cf-submit',form);
  var status=$('#cf-status',form);

  function setStatus(msg,type){
    if(!status)return;
    status.textContent=msg;
    status.className='form-status '+(type||'');
  }

  on(form,'submit',function(e){
    e.preventDefault();setStatus('','');
    var name=nameI&&nameI.value.trim();
    var phone=phoneI&&phoneI.value.trim();
    var biz=bizI&&bizI.value.trim();
    var msg=msgI&&msgI.value.trim();

    if(!name||name.length<2){
      nameI.classList.add('error');nameI.focus();
      setStatus('الاسم مطلوب','error');
      setTimeout(function(){nameI.classList.remove('error');},1200);
      return;
    }
    if(!validatePhone(phone)){
      phoneI.classList.add('error');phoneI.focus();
      setStatus('رقم الهاتف غير صحيح','error');
      setTimeout(function(){phoneI.classList.remove('error');},1200);
      return;
    }

    var lead={
      name:name,
      phone:normalizePhone(phone),
      business:biz||'—',
      message:msg||'—',
      source:'contact-form',
      page:window.location.pathname,
      ts:new Date().toISOString()
    };

    if(sub){sub.disabled=true;sub.style.opacity='0.6';}
    setStatus('جاري الإرسال...','loading');

    saveLocal(lead);
    saveSupabase(lead).then(function(){
      track('contact_form','submitted');
      setStatus('✅ تم استلام رسالتك — هنرد عليك خلال 4 ساعات','success');
      phoneI.classList.add('valid');

      var lines=[
        'مرحباً فريق 2D Marketing','',
        'الاسم: '+name,
        'الهاتف: '+lead.phone,
        'النشاط: '+lead.business,
        'الرسالة: '+lead.message,'',
        'Source: contact-form'
      ];
      var url='https://wa.me/'+CFG.ownerPhone+'?text='+encodeURIComponent(lines.join('\n'));

      setTimeout(function(){
        var wa=document.createElement('a');
        wa.href=url;wa.target='_blank';wa.rel='noopener';
        wa.className='btn btn-primary';
        wa.style.cssText='margin-top:16px;display:inline-flex';
        wa.innerHTML='تحدث معنا على واتساب';
        if(status&&status.parentNode)status.parentNode.appendChild(wa);
      },500);
    });
  });
}

function init(){
  initLoader();
  initProgressBar();
  initHeader();
  initMobileMenu();
  initNavActive();
  initFooterYear();
  initBackToTop();
  requestAnimationFrame(function(){
    initParticles();
    initCursor();
  });
  initRipple();
  initFAQ();
  initScrollReveal();
  initCounters();
  initContactForm();
}

if(document.readyState==='loading'){
  on(document,'DOMContentLoaded',init);
} else {
  init();
}

window.__2D={
  track:track,
  saveLocal:saveLocal,
  saveSupabase:saveSupabase,
  validatePhone:validatePhone,
  normalizePhone:normalizePhone
};
})();

function initGSAP() {
  if (typeof gsap === 'undefined') {
    setTimeout(initGSAP, 300);
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // ═══ Hero Animation ═══
  var tl = gsap.timeline({ delay: 0.2 });
  
  tl.from('.hero-vr-title', {
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power4.out'
  })
  .from('.hero-vr-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.7')
  .from('.hero-vr-cta', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(1.4)'
  }, '-=0.6')
  .from('.hero-vr-logo-img', {
    scale: 0.7,
    opacity: 0,
    duration: 1.3,
    ease: 'power3.out'
  }, 0);
  
  // ═══ Section Headings ═══
  gsap.utils.toArray('.section-h2').forEach(function(el) {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    });
  });
}
