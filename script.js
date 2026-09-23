/* =========================================================
   LAVA JATO ELN — script.js
========================================================= */

document.documentElement.classList.add("js-ready");

/* ---------------------------------------------------------
   CONFIGURAÇÃO — edite aqui
--------------------------------------------------------- */

// Número de WhatsApp da empresa, com código do país + DDD, só números.
// +55 86 99487-6143
const WHATSAPP_NUMBER = "5586994876143";

// Mensagem padrão para o botão flutuante / header / footer
const WHATSAPP_DEFAULT_MESSAGE = "Olá! Vim pelo site e gostaria de saber mais sobre a lavagem na ELN.";

// Link do Google Maps — substitua pelo link real do local.
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Clínica+SJ,+São+Joaquim";

/* ---------------------------------------------------------
   Helpers de WhatsApp
--------------------------------------------------------- */
function buildWhatsAppUrl(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Preenche todos os links marcados com data-whatsapp-link
document.querySelectorAll("[data-whatsapp-link]").forEach(function(el){
  el.setAttribute("href", buildWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE));
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

/* ---------------------------------------------------------
   Mapa
--------------------------------------------------------- */
const mapLink = document.getElementById("mapLink");
if(mapLink){
  mapLink.setAttribute("href", MAPS_LINK);
  mapLink.setAttribute("target", "_blank");
  mapLink.setAttribute("rel", "noopener");
}

/* ---------------------------------------------------------
   Menu mobile
--------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
if(navToggle && mainNav){
  navToggle.addEventListener("click", function(){
    const open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   Formulário de agendamento -> mensagem WhatsApp
--------------------------------------------------------- */
const bookingForm = document.getElementById("bookingForm");
if(bookingForm){
  bookingForm.addEventListener("submit", function(e){
    e.preventDefault();
    const data = new FormData(bookingForm);
    const nome = (data.get("nome") || "").toString().trim();
    const moto = (data.get("moto") || "").toString().trim();
    const dataAgendamento = (data.get("data") || "").toString();
    const horario = (data.get("horario") || "").toString();
    const obs = (data.get("obs") || "").toString().trim();

    // formata a data de YYYY-MM-DD para DD/MM/YYYY
    let dataFormatada = dataAgendamento;
    if(dataAgendamento){
      const [ano, mes, dia] = dataAgendamento.split("-");
      if(ano && mes && dia) dataFormatada = `${dia}/${mes}/${ano}`;
    }

    let mensagem = `Olá! Gostaria de agendar uma lavagem na ELN.\n\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += `Moto: ${moto}\n`;
    mensagem += `Data: ${dataFormatada}\n`;
    mensagem += `Horário: ${horario}\n`;
    if(obs) mensagem += `Observação: ${obs}\n`;

    window.open(buildWhatsAppUrl(mensagem), "_blank", "noopener");
  });
}

/* ---------------------------------------------------------
   Carrossel de resultados (touch / mouse drag / setas / dots)
--------------------------------------------------------- */
const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("carouselDots");

if(carousel){
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));

  // cria os indicadores (bolinhas)
  if(dotsWrap){
    slides.forEach(function(_, i){
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Ir para foto " + (i + 1));
      if(i === 0) dot.classList.add("active");
      dot.addEventListener("click", function(){ scrollToSlide(i); });
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function scrollToSlide(index){
    const slide = slides[index];
    if(!slide) return;
    carousel.scrollTo({ left: slide.offsetLeft - (carousel.clientWidth - slide.clientWidth)/2, behavior:"smooth" });
  }

  function currentIndex(){
    const center = carousel.scrollLeft + carousel.clientWidth/2;
    let closest = 0, min = Infinity;
    slides.forEach(function(s, i){
      const c = s.offsetLeft + s.clientWidth/2;
      const d = Math.abs(c - center);
      if(d < min){ min = d; closest = i; }
    });
    return closest;
  }

  function updateDots(){
    if(!dotsWrap) return;
    const idx = currentIndex();
    dots.forEach(function(d, i){ d.classList.toggle("active", i === idx); });
  }

  let scrollTimeout;
  carousel.addEventListener("scroll", function(){
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateDots, 80);
  }, { passive:true });

  if(prevBtn){
    prevBtn.addEventListener("click", function(){ scrollToSlide(Math.max(0, currentIndex()-1)); });
  }
  if(nextBtn){
    nextBtn.addEventListener("click", function(){ scrollToSlide(Math.min(slides.length-1, currentIndex()+1)); });
  }

  // arrasto suave com mouse no desktop (touch já funciona nativamente via scroll-snap)
  let isDown = false, startX = 0, startScroll = 0, dragged = false;

  carousel.addEventListener("mousedown", function(e){
    isDown = true; dragged = false;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScroll = carousel.scrollLeft;
  });
  window.addEventListener("mouseup", function(){
    if(!isDown) return;
    isDown = false;
    carousel.classList.remove("dragging");
    scrollToSlide(currentIndex());
  });
  window.addEventListener("mousemove", function(e){
    if(!isDown) return;
    const delta = e.pageX - startX;
    if(Math.abs(delta) > 4) dragged = true;
    carousel.scrollLeft = startScroll - delta;
  });
  // evita clique acidental em imagem depois de arrastar
  carousel.addEventListener("click", function(e){ if(dragged) e.preventDefault(); }, true);

  updateDots();
}

/* ---------------------------------------------------------
   Animações de entrada ao rolar (fade-in / slide-up), discretas
--------------------------------------------------------- */
const revealEls = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && revealEls.length){
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add("is-visible"); });
}
