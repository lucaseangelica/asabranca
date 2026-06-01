(function () {
  var shell = document.querySelector(".portal-shell");
  var roleButtons = Array.prototype.slice.call(document.querySelectorAll(".role-option"));
  var loginForm = document.querySelector(".login-form");
  var demoButton = document.querySelector(".demo-access");
  var menuButtons = Array.prototype.slice.call(document.querySelectorAll(".app-menu button"));
  var logoutButton = document.querySelector(".logout-action");
  var currentRole = "couple";

  var data = {
    couple: {
      email: "noivos@asabranca.com",
      title: "Ola, Marina e Lucas.",
      bannerTitle: "Casamento Marina & Lucas",
      bannerText: "Faltam 118 dias para a cerimonia no jardim.",
      mainPanel: "Decisoes em andamento",
      metrics: [
        ["118", "dias", "ate a cerimonia"],
        ["72%", "checklist", "concluido"],
        ["186", "convidados", "confirmados"],
        ["4", "decisoes", "pendentes"]
      ],
      decisions: [
        ["Decoracao", "Paleta verde, branco e dourado aprovada para a cerimonia."],
        ["Menu", "Degustacao marcada para revisar entrada e sobremesa."],
        ["Musica", "Playlist da cerimonia aguardando ultima confirmacao."],
        ["Hospedagem", "Lista de convidados de fora em validacao."]
      ],
      timeline: [
        ["14 jun", "Visita tecnica", "Jardim, salao e pontos de foto com cerimonial."],
        ["22 jun", "Degustacao", "Entrada, prato principal e sobremesa."],
        ["05 jul", "Layout final", "Mapa de mesas e circulacao dos convidados."],
        ["28 set", "Dia do evento", "Cerimonia externa as 17h20 e recepcao no salao."]
      ],
      tasks: [
        [true, "Contrato assinado", "Arquivo salvo no portal."],
        [true, "Escolha do jardim", "Cerimonia externa confirmada."],
        [false, "Enviar lista final", "Prazo sugerido: 30 dias antes."],
        [false, "Aprovar menu", "Aguardando degustacao."]
      ],
      messages: [
        ["AB", "Equipe AsaBranca", "Preparamos uma sugestao de percurso para fotos no fim de tarde."],
        ["CE", "Cerimonial", "O layout do salao foi atualizado com a mesa da familia."],
        ["AB", "Equipe AsaBranca", "A visita tecnica esta confirmada para 14 jun, 10h30."]
      ],
      documents: [
        ["Contrato", "Assinado em 12 abr", "PDF"],
        ["Mapa do salao", "Versao 03", "Layout"],
        ["Checklist", "Atualizado hoje", "Plano"]
      ]
    },
    admin: {
      email: "admin@asabranca.com",
      title: "Painel da administracao.",
      bannerTitle: "Operacao AsaBranca",
      bannerText: "6 visitas, 3 contratos e 2 eventos na semana.",
      mainPanel: "Movimento da operacao",
      metrics: [
        ["18", "eventos", "no pipeline"],
        ["6", "visitas", "esta semana"],
        ["3", "contratos", "aguardando assinatura"],
        ["92%", "ocupacao", "dos sabados"]
      ],
      decisions: [
        ["Marina & Lucas", "Confirmar degustacao e enviar layout atualizado."],
        ["Ana & Pedro", "Contrato enviado, aguardando assinatura digital."],
        ["Corporativo Vitta", "Proposta de confraternizacao em revisao."],
        ["Agenda", "Bloquear manutencao do jardim em 18 jun."]
      ],
      timeline: [
        ["Hoje", "Visita comercial", "Casal interessado em cerimonia externa."],
        ["Amanha", "Reuniao operacional", "Alinhamento de montagem e fornecedores."],
        ["14 jun", "Visita tecnica", "Marina & Lucas com cerimonial."],
        ["22 jun", "Degustacao", "Menu casamento setembro."]
      ],
      tasks: [
        [true, "Enviar proposta Vitta", "Proposta enviada as 09h12."],
        [false, "Revisar contrato Ana & Pedro", "Atualizar condicoes de pagamento."],
        [false, "Confirmar equipe extra", "Evento noturno com 186 convidados."],
        [true, "Atualizar calendario", "Bloqueios de manutencao registrados."]
      ],
      messages: [
        ["ML", "Marina & Lucas", "Podemos incluir uma mesa de cafe na saida?"],
        ["AP", "Ana & Pedro", "Enviamos os dados para contrato."],
        ["CV", "Corporativo Vitta", "Precisamos de proposta para 120 pessoas."]
      ],
      documents: [
        ["Contratos", "3 pendentes", "Admin"],
        ["Propostas", "7 em aberto", "Comercial"],
        ["Calendario", "Junho atualizado", "Agenda"]
      ]
    }
  };

  function setRole(role) {
    currentRole = role;
    roleButtons.forEach(function (button) {
      var active = button.getAttribute("data-role") === role;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (loginForm) {
      loginForm.elements.email.value = data[role].email;
      loginForm.elements.password.value = "asabranca";
    }
  }

  function renderDashboard() {
    var selected = data[currentRole];
    document.querySelector("[data-dashboard-title]").textContent = selected.title;
    document.querySelector("[data-role-banner] strong").textContent = selected.bannerTitle;
    document.querySelector("[data-role-banner] p").textContent = selected.bannerText;
    document.querySelector("[data-main-panel-title]").textContent = selected.mainPanel;

    renderMetrics(selected.metrics);
    renderDecisions(selected.decisions);
    renderTimeline(selected.timeline);
    renderTasks(selected.tasks);
    renderMessages(selected.messages);
    renderDocuments(selected.documents);
  }

  function renderMetrics(items) {
    document.querySelector("[data-metrics]").innerHTML = items
      .map(function (item) {
        return '<article class="metric"><span>' + item[1] + "</span><strong>" + item[0] + "</strong><p>" + item[2] + "</p></article>";
      })
      .join("");
  }

  function renderDecisions(items) {
    document.querySelector("[data-decisions]").innerHTML = items
      .map(function (item) {
        return '<article class="decision-item"><span>pendencia</span><strong>' + item[0] + "</strong><p>" + item[1] + "</p></article>";
      })
      .join("");
  }

  function renderTimeline(items) {
    document.querySelector("[data-timeline]").innerHTML = items
      .map(function (item) {
        return '<article class="timeline-item"><em>' + item[0] + "</em><div><span>agenda</span><strong>" + item[1] + "</strong><p>" + item[2] + "</p></div><span>confirmado</span></article>";
      })
      .join("");
  }

  function renderTasks(items) {
    document.querySelector("[data-tasks]").innerHTML = items
      .map(function (item) {
        var open = item[0] ? "" : " is-open";
        var mark = item[0] ? "ok" : "!";
        return '<article class="task-item' + open + '"><span class="task-check">' + mark + '</span><div><span>checklist</span><strong>' + item[1] + "</strong><p>" + item[2] + "</p></div></article>";
      })
      .join("");
  }

  function renderMessages(items) {
    document.querySelector("[data-messages]").innerHTML = items
      .map(function (item) {
        return '<article class="message-item"><span class="avatar">' + item[0] + '</span><div><span>' + item[1] + "</span><strong>" + item[2] + "</strong><p>Responder pelo portal.</p></div></article>";
      })
      .join("");
  }

  function renderDocuments(items) {
    document.querySelector("[data-documents]").innerHTML = items
      .map(function (item) {
        return '<article class="document-card"><span>' + item[2] + "</span><strong>" + item[0] + "</strong><p>" + item[1] + "</p></article>";
      })
      .join("");
  }

  function openDashboard() {
    renderDashboard();
    shell.setAttribute("data-view", "dashboard");
    window.scrollTo(0, 0);
  }

  roleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setRole(button.getAttribute("data-role"));
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      openDashboard();
    });
  }

  if (demoButton) {
    demoButton.addEventListener("click", openDashboard);
  }

  menuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var section = button.getAttribute("data-section");
      menuButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      Array.prototype.slice.call(document.querySelectorAll(".dashboard-section")).forEach(function (panel) {
        panel.classList.toggle("is-active", panel.getAttribute("data-panel") === section);
      });
    });
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      shell.setAttribute("data-view", "login");
      window.scrollTo(0, 0);
    });
  }

  setRole(currentRole);
})();
