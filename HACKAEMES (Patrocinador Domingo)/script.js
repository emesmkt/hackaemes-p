(function () {
  const dados = window.HACKAEMES_SITE;
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const caracteres = "01[]/_#%";

  document.querySelectorAll('[data-campo="dataCurtaHorario"]').forEach((item) => {
    item.textContent = dados.dataCurtaHorario;
    item.dataset.valorFinal = dados.dataCurtaHorario;
  });

  document.querySelectorAll('[data-campo="horario"]').forEach((item) => {
    item.textContent = dados.horario;
    item.dataset.valorFinal = dados.horario;
  });

  document.querySelectorAll('[data-campo="dataLocalCurta"]').forEach((item) => {
    item.textContent = dados.dataLocalCurta;
    item.dataset.valorFinal = dados.dataLocalCurta;
  });

  document.querySelectorAll('[data-campo="enderecoCompleto"]').forEach((item) => {
    item.textContent = dados.enderecoCompleto;
  });

  document.querySelectorAll('[data-campo="mapa"]').forEach((item) => {
    item.setAttribute("href", dados.mapaUrl);
  });

  document.querySelectorAll('[data-campo="logo"]').forEach((imagem) => {
    imagem.src = dados.logo;
    imagem.addEventListener("error", () => {
      imagem.classList.add("sem-logo");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destino = document.querySelector(link.getAttribute("href"));
      if (!destino) {
        return;
      }

      evento.preventDefault();
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const secoes = Array.from(document.querySelectorAll(".secao"));
  const marcadores = Array.from(document.querySelectorAll(".marcador"));
  const secoesAnimadas = new WeakSet();

  function textoResolvido(texto, progresso) {
    return Array.from(texto)
      .map((letra, indice) => {
        if (letra === " " || letra === "\n") {
          return letra;
        }

        const limite = Math.floor(progresso * texto.length);
        if (indice <= limite) {
          return letra;
        }

        return caracteres[(indice + Math.floor(progresso * 18)) % caracteres.length];
      })
      .join("");
  }

  function resolverDado(elemento, duracao = 360) {
    const final = elemento.dataset.valorFinal || elemento.textContent;
    if (!final || reduzMovimento) {
      elemento.textContent = final;
      return;
    }

    const inicio = performance.now();
    elemento.classList.add("dado-resolvendo");

    function quadro(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      elemento.textContent = textoResolvido(final, progresso);

      if (progresso < 1) {
        requestAnimationFrame(quadro);
        return;
      }

      elemento.textContent = final;
      elemento.classList.remove("dado-resolvendo");
    }

    requestAnimationFrame(quadro);
  }

  function digitarCurto(elemento, duracao = 280) {
    const final = elemento.dataset.textoFinal || elemento.textContent;
    if (!final || reduzMovimento) {
      elemento.textContent = final;
      return;
    }

    elemento.dataset.textoFinal = final;
    const inicio = performance.now();

    function quadro(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const quantidade = Math.max(1, Math.ceil(final.length * progresso));
      elemento.textContent = final.slice(0, quantidade);

      if (progresso < 1) {
        requestAnimationFrame(quadro);
        return;
      }

      elemento.textContent = final;
    }

    requestAnimationFrame(quadro);
  }

  function ativarSecao(secao) {
    secao.classList.add("secao-ativa");

    if (secoesAnimadas.has(secao)) {
      return;
    }

    secoesAnimadas.add(secao);

    const indicador = secao.querySelector(".indicador");
    const rotulo = secao.querySelector(".rotulo");
    const apoios = secao.querySelectorAll(".apoio, .endereco");
    const dadosCurtos = secao.querySelectorAll(".data-forte, .hora-box strong, .subfinal");

    window.setTimeout(() => digitarCurto(indicador, 160), secao.id === "abertura" ? 980 : 70);
    if (rotulo) {
      window.setTimeout(() => digitarCurto(rotulo, 260), 150);
    }

    apoios.forEach((apoio, indice) => {
      const texto = apoio.textContent;
      if (texto.length <= 80) {
        window.setTimeout(() => digitarCurto(apoio, 300), 500 + indice * 90);
      }
    });

    dadosCurtos.forEach((dado, indice) => {
      const atraso = secao.id === "abertura" ? 1680 : 390 + indice * 80;
      window.setTimeout(() => resolverDado(dado, 360), atraso);
    });
  }

  if (reduzMovimento) {
    document.body.classList.add("movimento-reduzido");
    secoes.forEach((secao) => secao.classList.add("secao-ativa"));
  } else {
    document.body.classList.add("js-motion");
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) {
          return;
        }

        const indice = secoes.indexOf(entrada.target);
        marcadores.forEach((marcador, marcadorIndice) => {
          marcador.classList.toggle("ativo", marcadorIndice === indice);
        });
        ativarSecao(entrada.target);
      });
    },
    { rootMargin: "-18% 0px -35% 0px", threshold: 0.08 }
  );

  secoes.forEach((secao) => observador.observe(secao));
  ativarSecao(secoes[0]);
})();
