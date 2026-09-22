# Lava Jato ELN — site

Site em HTML/CSS/JS puro (sem build, sem framework). Basta abrir `index.html`
no navegador ou subir a pasta inteira em qualquer hospedagem.

## Estrutura

```
eln-site/
├── index.html      → conteúdo e estrutura do site
├── style.css        → todo o visual (cores, fontes, layout, responsivo)
├── script.js         → WhatsApp, carrossel, formulário, menu, animações
└── assets/           → imagens (fotos reais da ELN)
```

## O que editar

### 1. Número de WhatsApp
Arquivo `script.js`, no topo:
```js
const WHATSAPP_NUMBER = "5586994876143"; // 55 + DDD + número
```

### 2. Mensagem padrão do botão flutuante / header / footer
Também em `script.js`:
```js
const WHATSAPP_DEFAULT_MESSAGE = "Olá! Vim pelo site...";
```

### 3. Link do Google Maps
Em `script.js`:
```js
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=...";
```
Troque pelo link real (Google Maps → "Compartilhar" → "Copiar link").

### 4. Fotos
Coloque o arquivo novo dentro de `assets/` e aponte para ele no `index.html`.
Para adicionar uma foto no carrossel de **Resultados**, copie um bloco assim
dentro de `<div class="carousel" id="carousel">`:
```html
<div class="carousel-slide">
  <img src="assets/sua-foto.jpg" alt="Descrição da foto" loading="lazy">
</div>
```
Se for antes/depois, adicione as etiquetas:
```html
<div class="slide-tags">
  <span class="tag tag-antes">ANTES</span>
  <span class="tag tag-depois">DEPOIS</span>
</div>
```

### 5. Textos
Todo o texto visível está direto no `index.html` — procure a seção pelo
comentário (`<!-- ===== SOBRE ===== -->` etc.) e edite normalmente.

## Seções do site
Header · Hero · Sobre · Produtos (Vonixx) · Por que produtos específicos ·
Resultados (carrossel com swipe) · Agendamento (formulário → WhatsApp) ·
Localização · Instagram · Rodapé · Botão flutuante de WhatsApp.

A seção de **preços** foi removida a pedido — quando os valores forem
definidos, é só criar uma seção nova seguindo o mesmo padrão das outras
(`<section class="section" id="precos">...</section>`) e adicionar o link
`#precos` de volta ao menu, se quiser.
