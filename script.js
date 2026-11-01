
document.querySelector('.menu')?.addEventListener('click',()=>document.querySelector('.links').classList.toggle('open'));
const cookie=document.querySelector('.cookie'); if(!localStorage.getItem('hc-cookie')) cookie?.classList.add('show');
document.querySelectorAll('[data-cookie]').forEach(b=>b.onclick=()=>{localStorage.setItem('hc-cookie',b.dataset.cookie);cookie.classList.remove('show')});
function rm(){let w=+document.querySelector('#rmWeight').value,r=+document.querySelector('#rmReps').value;if(!w||!r)return;document.querySelector('#rmOut').textContent='1RM estimé : '+Math.round(w*(1+r/30))+' kg'}
function pace(){let d=+document.querySelector('#distance').value,t=document.querySelector('#time').value.split(':').map(Number);if(!d||t.length<2)return;let sec=t.length===3?t[0]*3600+t[1]*60+t[2]:t[0]*60+t[1],p=sec/d,m=Math.floor(p/60),s=Math.round(p%60).toString().padStart(2,'0');document.querySelector('#paceOut').textContent='Allure moyenne : '+m+':'+s+' / km'}
document.querySelector('#rmBtn')?.addEventListener('click',rm);document.querySelector('#paceBtn')?.addEventListener('click',pace);


/* ============================================================
   v2 - CALCULATEURS ET ESPACE MEMBRE
   ============================================================ */
function hcPace(sPerKm){
  const m=Math.floor(sPerKm/60), s=Math.round(sPerKm%60).toString().padStart(2,'0');
  return m+':'+s+' /km';
}
/* Zones d'allure : modele indicatif etabli a partir d'une performance recente.
   Ne remplace pas un test de terrain encadre. */
function hcZones(){
  const el=document.querySelector('#zOut'); if(!el) return;
  const raw=document.querySelector('#zTime').value.trim();
  const t=raw.split(':').map(Number);
  if(!raw||t.some(isNaN)||t.length<2){ el.textContent='Renseigne un temps valide, par exemple 22:00 ou 0:22:00.'; return; }
  const sec=t.length===3?t[0]*3600+t[1]*60+t[2]:t[0]*60+t[1];
  const km=parseFloat(document.querySelector('#zDist').value)||5;
  const pace=sec/km;
  const vma=3600/pace*1.06;
  const zones=[
    ['Endurance fondamentale',0.60,0.70,'Base aerobie, allure de conversation'],
    ['Endurance active',0.70,0.78,'Footing soutenu regulier'],
    ['Allure specifique 10 km',0.78,0.83,'Travail au seuil bas'],
    ['Allure specifique 5 km',0.83,0.89,'Seuil, effort soutenu'],
    ['Fractionne 3000 m',0.89,0.95,'VO2 max, intervalles courts'],
    ['Vitesse et cote',0.95,1.05,'Puissance, repetitions tres courtes']
  ];
  const lines=zones.map(function(z){
    const a=vma*z[1], b=vma*z[2];
    return '<div style="margin-bottom:6px"><b>'+z[0]+'</b> &nbsp;'+hcPace(3600/b)+' a '+hcPace(3600/a)+
           ' <span class="muted">('+a.toFixed(1)+' a '+b.toFixed(1)+' km/h) - '+z[3]+'</span></div>';
  });
  el.innerHTML='<div style="margin-bottom:10px">VMA estimee : <b>'+vma.toFixed(1)+' km/h</b></div>'+lines.join('');
}

/* Records personnels : stockes uniquement dans le navigateur de l'utilisateur. */
var HC_PR='hc-records';
function hcLoadPR(){ try{ return JSON.parse(localStorage.getItem(HC_PR))||[] }catch(e){ return [] } }
function hcDrawPR(){
  var tb=document.querySelector('#prBody'); if(!tb) return;
  var rows=hcLoadPR();
  if(!rows.length){ tb.innerHTML='<tr><td colspan="4" class="muted">Aucun record enregistre pour le moment.</td></tr>'; return; }
  tb.innerHTML=rows.map(function(r,i){
    return '<tr><td>'+r.dist+'</td><td>'+r.time+'</td><td>'+r.date+'</td>'+
           '<td><button type="button" class="pr-del" data-i="'+i+'" style="background:none;border:0;color:#ff9a9a;cursor:pointer;font-weight:800">Supprimer</button></td></tr>';
  }).join('');
  tb.querySelectorAll('.pr-del').forEach(function(b){
    b.onclick=function(){ var r=hcLoadPR(); r.splice(parseInt(b.dataset.i,10),1); localStorage.setItem(HC_PR,JSON.stringify(r)); hcDrawPR(); };
  });
}
function hcAddPR(){
  var d=document.querySelector('#prDist'), t=document.querySelector('#prTime');
  if(!d||!t||!d.value.trim()||!t.value.trim()) return;
  var rows=hcLoadPR();
  rows.push({dist:d.value.trim(),time:t.value.trim(),date:new Date().toLocaleDateString('fr-FR')});
  localStorage.setItem(HC_PR,JSON.stringify(rows));
  d.value=''; t.value=''; hcDrawPR();
}

/* ============================================================
   v2 - ESPACE MEMBRE (interface de demonstration)
   Aucun email, aucun mot de passe et aucune commande n'est enregistre
   ni transmis tant que la base de donnees n'est pas branchee.
   ============================================================ */
function hcTab(name){
  document.querySelectorAll('[data-tab]').forEach(function(s){ s.classList.toggle('panel-off', s.dataset.tab!==name); });
  document.querySelectorAll('[data-tabbtn]').forEach(function(b){ b.classList.toggle('on', b.dataset.tabbtn===name); });
}
function hcMsg(id,txt){ var e=document.querySelector(id); if(e) e.textContent=txt; }

document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('[data-tabbtn]').forEach(function(b){ b.onclick=function(){ hcTab(b.dataset.tabbtn); }; });
  var zb=document.querySelector('#zBtn'); if(zb) zb.onclick=hcZones;
  var pa=document.querySelector('#prAdd'); if(pa) pa.onclick=hcAddPR;
  hcDrawPR();

  var rb=document.querySelector('#rBtn'); if(rb) rb.onclick=function(){
    var p=document.querySelector('#rPwd').value, p2=document.querySelector('#rPwd2').value, e=document.querySelector('#rEmail').value;
    if(!document.querySelector('#rPrenom').value.trim()||!document.querySelector('#rNom').value.trim()){ hcMsg('#rMsg','Renseigne ton prenom et ton nom.'); return; }
    if(e.indexOf('@')<0){ hcMsg('#rMsg','Renseigne une adresse email valide.'); return; }
    if(p.length<8){ hcMsg('#rMsg','Le mot de passe doit contenir au moins 8 caracteres.'); return; }
    if(p!==p2){ hcMsg('#rMsg','Les deux mots de passe ne correspondent pas.'); return; }
    hcMsg('#rMsg','Apercu uniquement : la creation de compte sera activee apres branchement de la base de donnees.');
  };

  var cb=document.querySelector('#cBtn'); if(cb) cb.onclick=function(){
    var e=document.querySelector('#cEmail').value;
    if(e.indexOf('@')<0){ hcMsg('#cMsg','Renseigne une adresse email valide.'); return; }
    hcMsg('#cMsg','Apercu uniquement : la connexion sera activee apres branchement de la base de donnees.');
  };

  var fl=document.querySelector('#forgetLink'); if(fl) fl.onclick=function(ev){
    ev.preventDefault(); hcMsg('#cMsg','Apercu uniquement : la reinitialisation par email sera disponible a l activation.');
  };
});

/* v3 — compteur de personnes coachées */
(function(){
  var KEY='hc-coached-count';
  var BASE=21;
  var n=parseInt(localStorage.getItem(KEY)||BASE,10);
  if(isNaN(n)||n<BASE) n=BASE;
  var el=document.getElementById('coachedCount');
  var fill=document.getElementById('counterFill');
  if(el){
    el.textContent=n;
    if(fill){ setTimeout(function(){ fill.style.width=Math.min(100,(n/50)*100)+'%'; },150); }
  }
  window.hcIncrementCoached=function(){
    n=n+1; localStorage.setItem(KEY,n);
    if(el) el.textContent=n;
    if(fill) fill.style.width=Math.min(100,(n/50)*100)+'%';
    return n;
  };
})();

/* v3 — codes à usage unique (démo locale) */
(function(){
  var KEY='hc-used-codes';
  function used(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
  window.hcRedeemCode=function(code){
    code=(code||'').trim().toUpperCase();
    if(!code) return {ok:false,msg:'Entre un code.'};
    if(used().indexOf(code)!==-1) return {ok:false,msg:'Ce code a déjà été utilisé.'};
    var u=used(); u.push(code); localStorage.setItem(KEY,JSON.stringify(u));
    return {ok:true,msg:'Code validé. Ton accès est ouvert.'};
  };
})();

document.getElementById('giftBtn')?.addEventListener('click',function(){
  var c=document.getElementById('giftCode').value;
  var r=window.hcRedeemCode(c);
  var out=document.getElementById('giftOut');
  out.textContent=r.msg; out.style.color=r.ok?'var(--green)':'#ff7a7a';
  if(r.ok && window.hcIncrementCoached) window.hcIncrementCoached();
});


/* ============================================================
   HYBRIDE COACHING — Traduction FR / EN (v5, refaite proprement)
   Chaque texte est mémorisé une fois, puis restauré exactement.
   ============================================================ */
(function(){
  var DICT = { "Programmes": "Programs", "Coaching": "Coaching", "Avis": "Reviews", "Résultats": "Results", "Mon parcours": "About me", "Outils": "Tools", "Mon espace": "My space", "Contact": "Contact", "Mentions légales": "Legal notice", "CGV": "Terms of sale", "Confidentialité": "Privacy", "Cookies": "Cookies", "by Victor Castillo": "by Victor Castillo", "FORCE. ENDURANCE.<br>VITESSE. PUISSANCE.": "STRENGTH. ENDURANCE.<br>SPEED. POWER.", "Une approche fondée sur la pratique, l'apprentissage en STAPS, les connaissances scientifiques et l'expérience du terrain.": "An approach built on practice, STAPS training, scientific knowledge and field experience.", "Ma philosophie :": "My philosophy:", "la discipline, la régularité, la patience, le travail et la foi. Ce sont les vraies clés — bien avant n'importe quel programme.": "discipline, consistency, patience, hard work and faith. These are the real keys — long before any program.", "DÉCOUVRIR LES PROGRAMMES": "SEE THE PROGRAMS", "COACHING PERSONNALISÉ": "PERSONAL COACHING", "Victor Castillo": "Victor Castillo", "Étudiant en L2 STAPS<br>Entraînement sportif — Paris Cité": "L2 STAPS student<br>Sport Training — Paris Cité", "DEPUIS 2026": "SINCE 2026", "personnes coachées": "people coached", "Sportifs accompagnés individuellement depuis le début de l'aventure Hybride Coaching.": "Athletes individually coached since the beginning of Hybride Coaching.", "CHOISIS TON OBJECTIF": "CHOOSE YOUR GOAL", "PROGRAMMES": "PROGRAMS", "FORCE": "STRENGTH", "DÉTENTE": "VERTICAL JUMP", "PERFORMANCE ATHLÉTIQUE": "ATHLETIC PERFORMANCE", "MUSCULATION": "MUSCLE BUILDING", "COURSE À PIED<br>COACHING PERSONNALISÉ": "RUNNING<br>PERSONAL COACHING", "2 mois · 30 €": "2 months · €30", "Du 5 km au marathon": "From 5K to marathon", "Sur route uniquement · pas de coaching sur piste": "Road only · no track coaching", "DEMANDER MON PROGRAMME": "REQUEST MY PROGRAM", "DÉCOUVRIR →": "DISCOVER →", "Les contenus détaillés et les prix seront finalisés avant l'ouverture des ventes. Aucun paiement n'est encore activé.": "Detailed content and prices will be finalised before sales open. No payment is enabled yet.", "AVIS CLIENTS": "CLIENT REVIEWS", "CE QU'ILS EN DISENT": "WHAT THEY SAY", "sur 12 avis vérifiés": "from 12 verified reviews", "Note moyenne calculée à partir des retours reçus depuis 2026.": "Average rating based on feedback received since 2026.", "Témoignages publiés avec l'accord des personnes concernées.": "Reviews published with the consent of the people involved.", "« Je cours depuis des années, mais j'ai vraiment progressé quand on a structuré mes séances. Le suivi est sérieux et adapté. »": "“I've been running for years, but I truly progressed once my sessions were structured. The coaching is serious and tailored.”", "« Le suivi course à pied m'a fait progresser sur route sans me griller. Le plan s'adaptait vraiment à mon emploi du temps. »": "“The running coaching helped me progress on the road without burning out. The plan genuinely fitted my schedule.”", "« Un entraînement intense et exigeant, mais qui vaut clairement le coup. On progresse et on comprend pourquoi. »": "“Intense and demanding training, but clearly worth it. You progress and you understand why.”", "Fabio, 53 ans": "Fabio, 53", "Valentine, 24 ans": "Valentine, 24", "Steve, 18 ans": "Steve, 18", "Course à pied · 10 km": "Running · 10K", "Course à pied · 5 km sur route": "Running · 5K on road", "Performance · basket": "Performance · basketball", "PREUVES À L'APPUI": "PROOF IN HAND", "LA PROGRESSION": "PROGRESS", "Des progressions réelles, avec le contexte. Les résultats varient selon le profil, l'assiduité et la récupération.": "Real progress, with context. Results vary with the individual, consistency and recovery.", "Développé couché": "Bench press", "Évolution basket": "Basketball progression", "Course à pied · progression sur route": "Running · road progression", "Victor, 19 ans · progression 2023-2026": "Victor, 19 · progress 2023-2026", "Steve, 18 ans · 2022 → 2023": "Steve, 18 · 2022 → 2023", "Valentine, 24 ans · en 3 mois": "Valentine, 24 · in 3 months", "Données publiées avec l'accord des personnes concernées. Les progressions dépendent du point de départ, de la régularité et du contexte individuel.": "Data published with the consent of the people involved. Progress depends on the starting point, consistency and individual context.", "L'ATHLÈTE DERRIÈRE LA MÉTHODE": "THE ATHLETE BEHIND THE METHOD", "VICTOR CASTILLO": "VICTOR CASTILLO", "J'ai 19 ans. Étudiant en L2 STAPS, mention Entraînement sportif, à Paris Cité, je construis une approche qui associe les connaissances scientifiques, l'apprentissage universitaire et l'expérience pratique du terrain.": "I'm 19. A second-year STAPS student, specialising in sport training, at Paris Cité, I'm building an approach that combines scientific knowledge, university learning and hands-on field experience.", "J'ai commencé la musculation seul, sans club, parce qu'un athlète doit toujours travailler son corps : c'est la machine qui fait performer, dans n'importe quel sport.": "I started strength training alone, with no club, because an athlete must always work on their body: it's the machine that performs, in any sport.", "Ancien basketteur compétitif jusqu'au niveau national dans les catégories jeunes U15 et U18, avec des sélections départementales, je suis aujourd'hui athlète de demi-fond. J'ai pratiqué plus de 9 sports à différents niveaux : basket, athlétisme, natation, rugby, football, judo, tennis, vélo, musculation et course à pied. Trois d'entre eux au niveau régional, et des médailles départementales en judo (champion et 3e de Seine-et-Marne).": "A former competitive basketball player up to national level in the U15 and U18 youth categories, with regional selections, I'm now a middle-distance athlete. I've practised more than 9 sports at various levels: basketball, athletics, swimming, rugby, football, judo, tennis, cycling, strength training and running. Three of them at regional level, plus departmental medals in judo (champion and 3rd in Seine-et-Marne).", "Je participe aussi à l'encadrement de jeunes athlètes sur les disciplines de course, de saut et de lancer.<br><br>J'entraîne depuis 2022, d'abord mon entourage et mes amis, puis ma famille, et aujourd'hui des sportifs rencontrés sur les réseaux. Le sport est au centre de ma vie depuis l'âge de 5-6 ans : c'est devenu une évidence, et c'est ce que je veux transmettre.": "I also help coach young athletes in running, jumping and throwing.<br><br>I've been coaching since 2022 — first friends and people around me, then family, and now athletes I've met through social media. Sport has been at the centre of my life since I was 5 or 6: it became obvious, and that's what I want to pass on.", "En parallèle, je crée du contenu sur les réseaux sociaux depuis 2023 : plus de 3 millions de vues cumulées, plus de 2 000 abonnés, et un partenariat avec une marque de nutrition sportive.": "Alongside this, I've been creating content on social media since 2023: over 3 million cumulative views, more than 2,000 followers, and a partnership with a sports nutrition brand.", "La foi en Dieu accompagne mon cheminement et ma vision de la progression.": "Faith in God accompanies my journey and my vision of progress.", "PARTENAIRE": "PARTNER", "PROZIS": "PROZIS", "Équipement et compléments via mon lien partenaire.": "Equipment and supplements through my partner link.", "COMMANDER AVEC MON LIEN": "ORDER WITH MY LINK", "Lien affilié : je peux recevoir une commission sur les achats, sans coût supplémentaire pour toi.": "Affiliate link: I may receive a commission on purchases, at no extra cost to you.", "OUTILS GRATUITS": "FREE TOOLS", "CALCULATEURS": "CALCULATORS", "Estimations indicatives : elles ne remplacent ni une évaluation individuelle ni un test physiologique.": "Indicative estimates: they replace neither an individual assessment nor a physiological test.", "Calculateur de 1RM": "1RM calculator", "Charge soulevée (kg)": "Weight lifted (kg)", "Nombre de répétitions": "Number of reps", "CALCULER": "CALCULATE", "1RM estimé : ": "Estimated 1RM: ", "Calculateur d'allure": "Pace calculator", "Distance (km)": "Distance (km)", "Temps (hh:mm:ss ou mm:ss)": "Time (hh:mm:ss or mm:ss)", "Allure moyenne : ": "Average pace: ", "PARLONS DE TON OBJECTIF": "LET'S TALK ABOUT YOUR GOAL", "CONTACT": "CONTACT", "Le formulaire sera relié à un service d'envoi avant la mise en ligne. Tu peux déjà me contacter par email ou Instagram.": "The form will be connected to a sending service before launch. You can already reach me by email or Instagram.", "Nom": "Name", "Email": "Email", "Objectif principal": "Main goal", "Niveau actuel": "Current level", "Parle-moi de ton objectif, tes contraintes et tes disponibilités": "Tell me about your goal, your constraints and your availability", "ENVOYER LA DEMANDE": "SEND MY REQUEST", "Respect de ta vie privée": "We respect your privacy", "Ce site utilise uniquement les cookies nécessaires pour le moment. Les statistiques seront ajoutées après configuration et consentement.": "This site currently uses only essential cookies. Analytics will be added after configuration and consent.", "Accepter": "Accept", "Refuser": "Refuse", "ESPACE MEMBRE": "MEMBER AREA", "Aperçu": "Preview", "espace membre en préparation — les comptes ne sont pas encore ouverts": "member area in preparation — accounts are not open yet", "Les inscriptions seront ouvertes prochainement. En attendant, écris-moi directement à castillovictor77600@gmail.com.": "Sign-ups will open soon. In the meantime, write to me directly at castillovictor77600@gmail.com.", "CRÉER MON COMPTE": "CREATE MY ACCOUNT", "J'AI DÉJÀ UN COMPTE": "I ALREADY HAVE AN ACCOUNT", "CONNEXION": "LOG IN", "Prénom": "First name", "Nom de famille": "Last name", "Mot de passe": "Password", "Confirmer le mot de passe": "Confirm password", "Téléphone (facultatif)": "Phone (optional)", "SE CONNECTER": "LOG IN", "Mot de passe oublié ?": "Forgot your password?", "MA BIBLIOTHÈQUE": "MY LIBRARY", "Mes programmes": "My programs", "OUVRIR": "OPEN", "Mes programmes sur devis": "My custom programs", "SUIVRE MA COMMANDE": "TRACK MY ORDER", "J'AI UN CODE": "I HAVE A CODE", "Entre ton code": "Enter your code", "VALIDER MON CODE": "VALIDATE MY CODE", "Chaque code est à usage unique. Une fois utilisé, il ne peut plus servir.": "Each code can be used once. Once used, it no longer works.", "MON ESPACE": "MY SPACE", "TABLEAU DE BORD": "DASHBOARD", "Profil": "Profile", "Commandes": "Orders", "Informations": "Information", "Programmes achetés": "Programs purchased", "Accompagnement en cours": "Current coaching", "Langue": "Language", "VOIR TOUS LES AVIS": "SEE ALL REVIEWS" };

  var SKIP = {SCRIPT:1,STYLE:1,NOSCRIPT:1,CODE:1,PRE:1};

  function nodes(){
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        if(!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(SKIP[n.parentNode && n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        if(n.parentNode && n.parentNode.closest && n.parentNode.closest('.lang')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var out=[], n;
    while((n=walker.nextNode())) out.push(n);
    return out;
  }

  var memo = null;

  function collect(){
    memo = nodes().map(function(n){
      return {node:n, fr:n.nodeValue};
    });
  }

  function apply(lang){
    if(!memo) collect();
    memo.forEach(function(item){
      var n = item.node;
      if(!n || !n.parentNode) return;
      if(lang === 'en'){
        var raw = item.fr;
        var lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
        var core = raw.trim();
        var tr = DICT[core];
        n.nodeValue = tr ? (lead + tr + tail) : raw;
      } else {
        n.nodeValue = item.fr;
      }
    });
    // placeholders
    document.querySelectorAll('[data-ph-fr]').forEach(function(el){
      el.placeholder = (lang==='en') ? el.getAttribute('placeholder') : el.getAttribute('data-ph-fr');
    });
    // attributs alt d'images
    if(lang==='en'){
      document.querySelectorAll('img[alt]').forEach(function(img){
        if(!img.dataset.altFr){ img.dataset.altFr = img.alt; }
        var a = img.dataset.altFr, lead=a.match(/^\s*/)[0], tail=a.match(/\s*$/)[0], core=a.trim();
        img.alt = DICT[core] ? (lead+DICT[core]+tail) : a;
      });
    } else {
      document.querySelectorAll('img[data-alt-fr]').forEach(function(img){ img.alt = img.dataset.altFr; });
    }
    document.documentElement.lang = (lang==='en') ? 'en' : 'fr';
    try{ localStorage.setItem('hc-lang', lang); }catch(e){}
    // boutons : on surligne la langue active, sans jamais traduire les libellés
    document.querySelectorAll('.lang button').forEach(function(b){
      var on = (b.dataset.lang === lang);
      b.style.color = on ? '#35ff84' : 'inherit';
      b.style.fontWeight = on ? '900' : '400';
      b.style.textDecoration = 'none';
    });
  }

  // construction des boutons FR | EN (libellés figés)
  document.querySelectorAll('.lang').forEach(function(box){
    box.innerHTML = '<button type="button" data-lang="fr">FR</button><span>|</span><button type="button" data-lang="en">EN</button>';
    box.querySelectorAll('button').forEach(function(b){
      b.style.cssText = 'background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:0 3px';
      b.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        apply(b.dataset.lang);
      });
    });
  });

  collect();
  var saved = 'fr';
  try{ saved = localStorage.getItem('hc-lang') || 'fr'; }catch(e){}
  apply(saved);
})();

/* v5 — ouverture du bloc philosophie */
document.getElementById('philoBtn')?.addEventListener('click',function(){
  var s=document.getElementById('philosophie');
  if(!s) return;
  s.classList.toggle('open');
  this.textContent = s.classList.contains('open') ? "MASQUER LES DÉTAILS" : "VOIR LES DÉTAILS DE MA PHILOSOPHIE";
  if(s.classList.contains('open')) s.scrollIntoView({behavior:'smooth',block:'start'});
});

/* v5 — vocabulaire de la section philosophie */
(function(){
  var more = {
    "VOIR LES DÉTAILS DE MA PHILOSOPHIE":"SEE MY COACHING PHILOSOPHY",
    "MASQUER LES DÉTAILS":"HIDE THE DETAILS",
    "MA PHILOSOPHIE D'ENTRAÎNEMENT":"MY TRAINING PHILOSOPHY",
    "Suivi annuel · saison complète":"Annual coaching · full season",
    "Un accompagnement construit sur une saison entière, pas sur un programme générique.":"Coaching built over a whole season, not on a generic program.",
    "Une saison complète":"A full season",
    "Le suivi peut couvrir toute une année sportive. On construit sur la durée, avec des cycles qui s'enchaînent au lieu de repartir de zéro.":"Coaching can cover a whole sporting year. We build over time, with cycles that follow one another instead of starting from scratch.",
    "Hiver : volume":"Winter: volume",
    "En hiver, on construit la base aérobie : plus de volume, des allures faciles, un travail d'endurance qui prépare le reste de la saison.":"In winter we build the aerobic base: more volume, easy paces, endurance work that prepares the rest of the season.",
    "Été : qualité":"Summer: quality",
    "En été, le volume baisse et la qualité monte : allures plus rapides, travail de vitesse et d'explosivité, pour être complet.":"In summer volume drops and quality rises: faster paces, speed and explosiveness work, to become complete.",
    "Mes points forts d'abord":"Your strengths first",
    "Je travaille d'abord ce que tu fais déjà bien. Un point fort solidifié devient une arme, et tire le reste vers le haut.":"I work first on what you already do well. A reinforced strength becomes a weapon, and lifts everything else.",
    "Volume adapté au niveau":"Volume adapted to your level",
    "Selon ton niveau et ton emploi du temps, le nombre de séances par semaine varie de 3 à 6. Jamais moins de 3, jamais plus de 6.":"Depending on your level and schedule, sessions per week range from 3 to 6. Never fewer than 3, never more than 6.",
    "Entraînement croisé":"Cross-training",
    "Vélo et musculation ajoutent du volume sans ajouter de fatigue excessive ni de risque de blessure. La musculation sert aussi à prévenir les blessures.":"Cycling and strength training add volume without excessive fatigue or injury risk. Strength work also helps prevent injuries.",
    "Décharge toutes les 4 semaines":"Deload every 4 weeks",
    "Toutes les 4 semaines, une semaine allégée pour assimiler le travail et éviter la stagnation.":"Every 4 weeks, a lighter week to absorb the work and avoid stagnation.",
    "Double projet possible":"Dual-distance goal possible",
    "On peut viser plusieurs distances dans la même saison : par exemple un 10 km et un semi, chacun avec sa préparation spécifique.":"You can target several distances in the same season: for example a 10K and a half marathon, each with its own specific preparation.",
    "EXEMPLE RÉEL":"REAL EXAMPLE",
    "Comment ça s'est passé pour Fabio":"How it worked for Fabio",
    "Un exemple concret d'organisation sur une saison, avec ses contraintes de vie et son emploi du temps.":"A concrete example of season planning, with real-life constraints and schedule.",
    "La semaine":"The week",
    "Deux séances de course en période générale, trois en période proche de compétition, deux en affûtage. Deux à trois séances de musculation, plus une sortie vélo le week-end quand c'était possible.":"Two running sessions in the general phase, three close to competition, two while tapering. Two to three strength sessions, plus a bike ride at the weekend when possible.",
    "Le volume":"Volume",
    "15 km par semaine au départ, jusqu'à 30 km maximum. Une progression très graduelle, sans forcer.":"15 km per week at the start, up to a maximum of 30 km. A very gradual progression, without forcing.",
    "Les objectifs":"Goals",
    "Des cycles enchaînés, avec une course environ tous les deux mois. De quoi rester motivé sans s'épuiser.":"Back-to-back cycles, with a race roughly every two months. Enough to stay motivated without burning out.",
    "L'affûtage":"Tapering",
    "Avant une course : moins de musculation, plus de travail spécifique, même volume mais plus de qualité, pour être prêt le jour J.":"Before a race: less strength work, more specific training, same volume but more quality, to be ready on the day.",
    "Chaque plan est construit sur mesure. Cet exemple montre une organisation possible, pas un modèle à reproduire à l'identique.":"Every plan is built to measure. This example shows one possible structure, not a template to copy exactly."
  };
  if(window.HC_MORE){ Object.assign(window.HC_MORE, more); }
  else { window.HC_MORE = more; }
})();
