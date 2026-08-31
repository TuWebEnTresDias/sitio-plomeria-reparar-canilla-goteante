/* ===========================================================
   Goteo Cero — canilla goteante, CABA
   Lógica mínima: formulario -> chat de WhatsApp (wa.me)
   El número es un placeholder [WHATSAPP] hasta que se provea.
   =========================================================== */
(function () {
  "use strict";

  var WHATSAPP = "[WHATSAPP]";
  var form = document.getElementById("wa-form");
  var note = document.getElementById("form-note");

  // Hook de analítica: dispara eventos solo si hay un proveedor cargado
  // (gtag de GA4 o posthog de PostHog). No rompe si no están presentes.
  function trackEvent(name) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name);
      }
      if (window.posthog && typeof window.posthog.capture === "function") {
        window.posthog.capture(name);
      }
    } catch (err) {
      /* no-op: no interrumpir el flujo si la analítica no está disponible */
    }
  }

  // Registrar clic en botón flotante de WhatsApp y en cualquier link wa.me
  var waFloat = document.querySelector(".wa-float");
  if (waFloat) {
    waFloat.addEventListener("click", function () {
      trackEvent("click_whatsapp");
    });
  }
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    el.addEventListener("click", function () {
      trackEvent("click_whatsapp");
    });
  });

  function buildMessage(data) {
    var parts = [];
    parts.push("Hola, soy " + data.nombre + ".");
    parts.push("Tengo una canilla que gotea en " + data.barrio + ".");
    if (data.mensaje) {
      parts.push(data.mensaje);
    }
    return parts.join(" ");
  }

  function openWhatsApp(message) {
    var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = (form.nombre.value || "").trim();
      var barrio = (form.barrio.value || "").trim();
      var mensaje = (form.mensaje.value || "").trim();

      if (!nombre || !barrio || !mensaje) {
        if (note) note.hidden = false;
        return;
      }
      if (note) note.hidden = true;

      trackEvent("submit_formulario");
      openWhatsApp(buildMessage({ nombre: nombre, barrio: barrio, mensaje: mensaje }));
    });
  }
})();
