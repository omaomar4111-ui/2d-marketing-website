/* ══════════════════════════════════════════════════════════════
   2D MARKETING — Ad System
══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

var ADS_JSON = (window.location.pathname.indexOf('/services/')>-1 ||
                window.location.pathname.indexOf('/blog/')>-1)
               ? '../ads.json' : 'ads.json';

function loadAds(){
  fetch(ADS_JSON)
    .then(function(r){
      if(!r.ok)throw new Error('no ads');
      return r.json();
    })
    .then(function(ads){
      renderAds(ads);
    })
    .catch(function(){
      document.querySelectorAll('[data-ad-slot]').forEach(function(s){
        s.style.display='none';
      });
    });
}

function renderAds(ads){
  var slots=document.querySelectorAll('[data-ad-slot]');
  slots.forEach(function(slot){
    var name=slot.getAttribute('data-ad-slot');
    var ad=ads[name];
    if(!ad||!ad.active){slot.style.display='none';return;}
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'ad_impression',ad_slot:name});
    var html='<div class="ad-card"><a href="'+ad.link+'" target="_blank" rel="noopener" class="ad-link" data-ad-slot="'+name+'">';
    if(ad.image)html+='<div class="ad-image" style="background-image:url('+ad.image+')"></div>';
    html+='<div class="ad-content">';
    html+='<div class="ad-label">'+(ad.label||'إعلان')+'</div>';
    html+='<div class="ad-title">'+ad.title+'</div>';
    html+='<div class="ad-desc">'+ad.description+'</div>';
    html+='<div class="ad-cta">'+(ad.cta||'اعرف أكثر')+' ←</div>';
    html+='</div></a></div>';
    slot.innerHTML=html;
  });
  document.querySelectorAll('.ad-link').forEach(function(a){
    a.addEventListener('click',function(){
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'ad_click',ad_slot:this.getAttribute('data-ad-slot')});
    });
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadAds);
else loadAds();
})();