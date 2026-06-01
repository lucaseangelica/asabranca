(function () {
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var presenceToggle = document.querySelector(".presence-toggle");
  var soundToggle = document.querySelector(".sound-toggle");
  var dotLinks = Array.prototype.slice.call(document.querySelectorAll(".scene-dots a"));
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("[data-scene], .chapter, .passage, .experience-map, .contact-scene")
  );
  var sceneImages = Array.prototype.slice.call(document.querySelectorAll(".scene-bg"));
  var canvas = document.getElementById("ambient");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var particles = [];
  var raf = 0;
  var audio = {
    context: null,
    gain: null,
    nodes: []
  };

  if (presenceToggle) {
    presenceToggle.addEventListener("click", function () {
      var active = !body.classList.contains("is-presence");
      body.classList.toggle("is-presence", active);
      presenceToggle.setAttribute("aria-pressed", active ? "true" : "false");
      presenceToggle.textContent = active ? "Mostrar interface" : "Modo presen\u00e7a";
    });
  }

  function createNoiseBuffer(context) {
    var length = context.sampleRate * 2;
    var buffer = context.createBuffer(1, length, context.sampleRate);
    var data = buffer.getChannelData(0);

    for (var i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  function startAmbientSound() {
    if (audio.context) {
      audio.context.resume();
      return;
    }

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    var context = new AudioContext();
    var gain = context.createGain();
    gain.gain.value = 0.032;
    gain.connect(context.destination);

    var wind = context.createBufferSource();
    wind.buffer = createNoiseBuffer(context);
    wind.loop = true;

    var windFilter = context.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 720;
    windFilter.Q.value = 0.7;

    var air = context.createOscillator();
    air.type = "sine";
    air.frequency.value = 96;

    var airGain = context.createGain();
    airGain.gain.value = 0.08;

    var lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;

    var lfoGain = context.createGain();
    lfoGain.gain.value = 0.018;

    wind.connect(windFilter);
    windFilter.connect(gain);
    air.connect(airGain);
    airGain.connect(gain);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    wind.start();
    air.start();
    lfo.start();

    audio.context = context;
    audio.gain = gain;
    audio.nodes = [wind, air, lfo];
  }

  function stopAmbientSound() {
    if (!audio.context) {
      return;
    }

    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    window.setTimeout(function () {
      audio.nodes.forEach(function (node) {
        try {
          node.stop();
        } catch (error) {
          return;
        }
      });
      audio.context.close();
      audio.context = null;
      audio.gain = null;
      audio.nodes = [];
    }, 220);
  }

  if (soundToggle) {
    soundToggle.addEventListener("click", function () {
      var active = soundToggle.getAttribute("aria-pressed") !== "true";
      soundToggle.setAttribute("aria-pressed", active ? "true" : "false");
      soundToggle.textContent = active ? "Silenciar" : "Som ambiente";

      if (active) {
        startAmbientSound();
      } else {
        stopAmbientSound();
      }
    });
  }

  window.addEventListener(
    "pointermove",
    function (event) {
      root.style.setProperty("--mx", event.clientX + "px");
      root.style.setProperty("--my", event.clientY + "px");
    },
    { passive: true }
  );

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var id = entry.target.id;
          if (!id) {
            return;
          }

          dotLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    Array.prototype.slice.call(document.querySelectorAll(".reveal")).forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    Array.prototype.slice.call(document.querySelectorAll(".reveal")).forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  function updateParallax() {
    if (!reduceMotion) {
      sceneImages.forEach(function (image) {
        var rect = image.parentElement.getBoundingClientRect();
        var progress = (window.innerHeight / 2 - rect.top) / Math.max(rect.height, 1);
        var offset = Math.max(-42, Math.min(42, (progress - 0.5) * 54));
        image.style.setProperty("--parallax", offset.toFixed(2) + "px");
      });
    }

    raf = window.requestAnimationFrame(updateParallax);
  }

  if (!reduceMotion) {
    raf = window.requestAnimationFrame(updateParallax);
  }

  function sizeCanvas() {
    if (!canvas || !ctx) {
      return;
    }

    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: window.innerWidth < 720 ? 18 : 34 }, function () {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.7 + Math.random() * 2.4,
        a: 0.2 + Math.random() * 0.55,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.16 - Math.random() * 0.22
      };
    });
  }

  function drawAmbient() {
    if (!canvas || !ctx || reduceMotion) {
      return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -20) {
        p.y = window.innerHeight + 20;
        p.x = Math.random() * window.innerWidth;
      }

      if (p.x < -20) {
        p.x = window.innerWidth + 20;
      } else if (p.x > window.innerWidth + 20) {
        p.x = -20;
      }

      var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      glow.addColorStop(0, "rgba(255, 226, 154," + p.a + ")");
      glow.addColorStop(1, "rgba(255, 226, 154,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fill();
    });

    window.requestAnimationFrame(drawAmbient);
  }

  if (canvas && ctx && !reduceMotion) {
    sizeCanvas();
    drawAmbient();
    window.addEventListener("resize", sizeCanvas);
  }

  window.addEventListener("pagehide", function () {
    if (raf) {
      window.cancelAnimationFrame(raf);
    }
    stopAmbientSound();
  });
})();
