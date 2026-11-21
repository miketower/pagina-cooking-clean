(() => {
  const widget = document.querySelector('.chat-widget');
  const panel = widget.querySelector('.chat-panel');
  const toggle = widget.querySelector('.chat-toggle');
  const invitation = widget.querySelector('.chat-invitation');
  const log = widget.querySelector('.chat-log');
  const form = widget.querySelector('.chat-form');
  const input = form.elements.question;

  const answers = [
    [/\b(precio|cotiz\w*|cuanto (cuesta|vale|cobran|sale|es el costo)|tarifa)\b/, 'El servicio tiene un costo fijo mensual. La presentación no indica el monto. Puedes pedir una cotización por WhatsApp.'],
    [/\b(prueba gratis|prueba gratuita|prueba sin costo|demostracion|demo|agendar|whatsapp|telefono|contact\w*)\b|(?:solicit\w*|quiero|pedir).{0,30}\bprueba\b/, 'Puedes solicitar una prueba sin costo con el botón «Hablar por WhatsApp».'],
    [/\b(moldes?|charolas?)\b/, 'En la prueba de panadería, un molde de aluminio con cochambre de grasa vegetal se recuperó en aproximadamente 1 h 30 min. Ya recuperado, su mantenimiento tomó de 30 a 35 min.'],
    [/\b(ollas?)\b/, 'En la prueba de hotelería, una olla de acero inoxidable con grasa carbonizada se recuperó en aproximadamente 3 h 30 min. Su mantenimiento tomó cerca de 1 h.'],
    [/\b(filtros?|campanas?)\b/, 'En la prueba de cocina industrial, los filtros de campana se recuperaron en aproximadamente 2 h 30 min. Su mantenimiento tomó de 50 a 60 min.'],
    [/\b(aluminio|corro\w*|materiales?)\b/, 'La presentación indica que el detergente alcalino del sistema es compatible con utensilios de aluminio. BIO-3000 también se probó con ollas y filtros de acero inoxidable.'],
    [/\b(temperatura|grados|80)\b/, 'La presentación indica que el detergente alcalino en polvo se diluye en agua a unos 80 °C y la limpieza se realiza por inmersión.'],
    [/\b(30 dias|24 horas|solucion|cada cuanto|dura la formula|dura el detergente)\b/, 'El sistema opera las 24 horas y la solución se utiliza durante 30 días, según la presentación.'],
    [/\b(comodato|repuestos?|repar\w*|mensual\w*|incluye|capacit\w*|servicio)\b/, 'El servicio en comodato tiene un costo fijo mensual e incluye producto, reparaciones, repuestos y mantenimiento del equipo. Cooking Clean también ofrece capacitación continua.'],
    [/\b(cuanto tarda|cuanto tiempo|tiempos?|mantenimiento|recuper\w*|resultados)\b/, 'El tiempo depende de la pieza. En las pruebas, el molde tardó aproximadamente 1 h 30 min, la olla 3 h 30 min y los filtros 2 h 30 min. Después de recuperar la pieza, el mantenimiento requiere menos tiempo de inmersión.'],
    [/\b(beneficios?|ahorr\w*|ventajas?|insumos|mano de obra|agua)\b/, 'El sistema ayuda a reducir el consumo de agua, fibras y otros insumos, así como el tiempo de trabajo dedicado a tallar. El proceso también ayuda a conservar los utensilios.'],
    [/\b(higiene|inocuidad|certific\w*|plagas?)\b/, 'Retirar grasa y cochambre ayuda a mantener las condiciones de higiene y reduce las fuentes de alimento para insectos. Para requisitos específicos de una certificación, consulta con el equipo.'],
    [/\b(clientes?|sectores?|hoteles?|panaderias?|pastelerias?|restaurantes?|hospitales?|clubes?)\b/, 'Cooking Clean atiende a hoteles, restaurantes, cocinas industriales, panaderías, pastelerías, hospitales y clubes.'],
    [/\b(funcion\w*|inmersion|proceso|cochambre|grasa|carboniz\w*|utensilios?|que es el sistema)\b|^(que es )?(el sistema )?bio[ -]?3000\??$/, 'BIO-3000 limpia grasa, cochambre y carbonización por inmersión. Utiliza un tanque de acero inoxidable con detergente alcalino diluido en agua a unos 80 °C. Se usa con utensilios y piezas desmontables.'],
    [/^(hola|buenas|buenos dias|buenas tardes)[!. ]*$/, '¡Hola! Pregúntame cómo funciona BIO-3000, qué incluye el servicio o cómo solicitar una prueba sin costo.'],
  ];

  function addMessage(text, fromUser) {
    const message = document.createElement('p');
    const speaker = document.createElement('strong');
    speaker.textContent = fromUser ? 'Tú: ' : 'Cooking Clean: ';
    message.classList.toggle('chat-user', fromUser);
    message.append(speaker, text);
    log.append(message);
    log.scrollTop = log.scrollHeight;
  }

  function ask(question) {
    const text = question.trim();
    if (!text) return;
    const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = answers.find(([pattern]) => pattern.test(normalized));
    addMessage(text, true);
    addMessage(match ? match[1] : 'No tengo ese dato en la presentación. Puedes consultar al equipo por WhatsApp o preguntar aquí por el sistema, el comodato o los tiempos de limpieza.', false);
  }

  const invitationTimer = window.setTimeout(() => {
    invitation.textContent = '¿Tienes dudas sobre BIO-3000? Pregúntame.';
  }, 2000);

  function setOpen(open) {
    window.clearTimeout(invitationTimer);
    invitation.textContent = '';
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    // Keep the full conversation in view on phones without opening the keyboard.
    (open ? log : toggle).focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  widget.querySelector('.chat-close').addEventListener('click', () => setOpen(false));
  widget.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
  });
  widget.querySelectorAll('.chat-suggestions button').forEach(button => {
    button.addEventListener('click', () => ask(button.textContent));
  });
  toggle.hidden = false;
})();
