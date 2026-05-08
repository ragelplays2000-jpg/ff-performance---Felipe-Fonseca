// =======================================================
// CONFIGURAÇÃO DOS VÍDEOS DE DEPOIMENTOS — FF PERFORMANCE
// =======================================================
//
// Para adicionar um vídeo, cole o link do YouTube/Instagram
// dentro do array abaixo, seguindo o exemplo comentado.
//
// Exemplo de link YouTube embed:
//   url: "https://www.youtube.com/embed/ID_DO_VIDEO"
//   (substitua ID_DO_VIDEO pelo código após ?v= no link normal)
//   Ex: youtube.com/watch?v=abc123  →  embed: abc123
//
// Exemplo de link do Instagram (Reels):
//   url: "https://www.instagram.com/reel/CODIGO/embed/"
//
// =======================================================

const DEPOIMENTO_VIDEOS = [

  // Para adicionar seu primeiro vídeo, descomente o bloco abaixo
  // e preencha os campos:

  // {
  //   atletaNome: "Nome do Atleta",
  //   atletaLocal: "Cidade, BA",
  //   titulo: "Frase curta sobre o resultado",
  //   url: "https://www.youtube.com/embed/SEU_ID_AQUI",
  //   tipo: "youtube"   // "youtube" ou "instagram"
  // },

];

// =======================================================
// NÃO ALTERE ABAIXO DESTA LINHA
// =======================================================

(function renderVideos() {
  if (!DEPOIMENTO_VIDEOS || DEPOIMENTO_VIDEOS.length === 0) return;

  const container = document.getElementById('depo-videos-container');
  const grid = document.getElementById('depo-videos-grid');
  const comingSoon = document.getElementById('depo-coming-soon');

  if (!container || !grid) return;

  DEPOIMENTO_VIDEOS.forEach(function(video) {
    const card = document.createElement('div');
    card.className = 'depo-video-card glass-card';
    card.innerHTML =
      '<div class="depo-video-wrapper">' +
        '<iframe src="' + video.url + '" ' +
          'title="Depoimento ' + (video.atletaNome || '') + '" ' +
          'frameborder="0" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen>' +
        '</iframe>' +
      '</div>' +
      '<div class="depo-video-info">' +
        (video.titulo ? '<p class="depo-video-titulo">"' + video.titulo + '"</p>' : '') +
        '<div class="depo-author">' +
          '<div class="depo-avatar"></div>' +
          '<div>' +
            '<strong>' + (video.atletaNome || 'Atleta FF Performance') + '</strong>' +
            '<span>' + (video.atletaLocal || 'Salvador, BA') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    grid.appendChild(card);
  });

  container.style.display = 'block';
  if (comingSoon) comingSoon.style.display = 'none';
})();
