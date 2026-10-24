/**
 * Lógica Reactiva de la Aplicación FerreFácil v1.0
 * Ferretería y Materiales "El Tornillo de Oro" - Sonsonate, El Salvador
 * Moneda: Dólares estadounidenses (USD / $)
 */

let cart = [];
let currentCategoryFilter = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Reloj y fecha en vivo
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Cargar estado de accesibilidad
  const settings = FerreStore.getSettings();
  if (settings.modoAccesible || settings.modoDonRoberto) {
    document.body.classList.add('modo-accesible');
    updateModoAccesibleButton(true);
  }

  // Inicializar vistas
  renderMostradorCatalog();
  renderCart();
  renderSemaforoView();
  renderCorteCajaView();
  renderCatalogoView();
  updateSemaforoBadge();

  // Escuchadores de eventos globales
  setupEventListeners();
}

/**
 * Actualiza el reloj y fecha en la barra de navegación
 */
function updateLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const now = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    clockEl.innerHTML = `<i class="bi bi-clock-history text-warning me-1"></i> ${now.toLocaleDateString('es-SV', options)}`;
  }
}

/**
 * Configuración de eventos de UI
 */
function setupEventListeners() {
  // Buscador Omnibox
  const omnibox = document.getElementById('omnibox-input');
  if (omnibox) {
    omnibox.addEventListener('input', (e) => {
      renderMostradorCatalog(e.target.value);
    });
    // Atajo: presionar Escape limpia la búsqueda
    omnibox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        omnibox.value = '';
        renderMostradorCatalog();
      }
    });
  }

  // Filtros por Categoría en Mostrador
  document.querySelectorAll('.ff-pill-category').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.ff-pill-category').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCategoryFilter = e.currentTarget.dataset.category;
      const query = document.getElementById('omnibox-input').value;
      renderMostradorCatalog(query);
    });
  });

  // Entrada de Efectivo Recibido
  const cashInput = document.getElementById('cash-received-input');
  if (cashInput) {
    cashInput.addEventListener('input', calculateChange);
  }

  // Botón Modo Accesible
  const btnModoAccesible = document.getElementById('btn-toggle-accesible') || document.getElementById('btn-toggle-don-roberto');
  if (btnModoAccesible) {
    btnModoAccesible.addEventListener('click', toggleModoAccesible);
  }

  // Selector de Método de Pago
  const paymentSelect = document.getElementById('payment-method-select');
  if (paymentSelect) {
    paymentSelect.addEventListener('change', (e) => {
      const isCash = e.target.value === 'Efectivo';
      const cashSection = document.getElementById('cash-calculation-section');
      if (cashSection) {
        cashSection.style.display = isCash ? 'block' : 'none';
      }
      if (!isCash) {
        // En transferencia se asume cobro exacto
        const total = getCartTotal();
        document.getElementById('cash-received-input').value = total.toFixed(2);
        calculateChange();
      }
    });
  }

  // Botón Restablecer Datos de Demostración
  const btnReset = document.getElementById('btn-reset-demo');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("¿Deseas restablecer los datos de demostración a su estado original (en dólares)?")) {
        FerreStore.resetToDefaults();
        cart = [];
        renderMostradorCatalog();
        renderCart();
        renderSemaforoView();
        renderCorteCajaView();
        renderCatalogoView();
        updateSemaforoBadge();
        showNotification("Datos de demostración restablecidos con éxito.", "info");
      }
    });
  }
}

// ==========================================================================
// MÓDULO 1: MOSTRADOR Y CATÁLOGO RÁPIDO
// ==========================================================================

function renderMostradorCatalog(searchQuery = '') {
  const grid = document.getElementById('mostrador-product-grid');
  if (!grid) return;

  const catalog = FerreStore.getCatalog();
  const q = searchQuery.toLowerCase().trim();

  const filtered = catalog.filter(item => {
    const matchCategory = currentCategoryFilter === 'Todos' || item.categoria === currentCategoryFilter;
    const matchQuery = !q || 
      item.nombre.toLowerCase().includes(q) ||
      item.codigo.toLowerCase().includes(q) ||
      item.ubicacion.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
        <h5 class="mt-3 text-secondary">No se encontraron productos con "${searchQuery}"</h5>
        <p class="text-muted">Intente con palabras como "tef", "codo", "broca", "clavo" o "lija".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    let stockBadge = '';
    if (item.stock_actual <= 0) {
      stockBadge = `<span class="badge badge-stock-red"><i class="bi bi-x-circle-fill me-1"></i> Agotado (0 ${item.unidad})</span>`;
    } else if (item.stock_actual <= item.stock_minimo) {
      stockBadge = `<span class="badge badge-stock-yellow"><i class="bi bi-exclamation-triangle-fill me-1"></i> ${item.stock_actual} ${item.unidad} (Reorden)</span>`;
    } else {
      stockBadge = `<span class="badge badge-stock-green"><i class="bi bi-check-circle-fill me-1"></i> ${item.stock_actual} ${item.unidad}</span>`;
    }

    return `
      <div class="ff-product-card" onclick="addToCart('${item.id}')">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="ff-product-code">${item.codigo}</span>
            ${stockBadge}
          </div>
          <div class="ff-product-name">${item.nombre}</div>
          <div class="ff-product-loc">
            <i class="bi bi-geo-alt-fill text-warning"></i> ${item.ubicacion}
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
          <div class="ff-product-price">$ ${item.precio_venta.toFixed(2)}</div>
          <button class="btn btn-sm btn-outline-warning fw-bold px-3">
            <i class="bi bi-plus-lg me-1"></i> Agregar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// MÓDULO 2: CANASTA Y CÁLCULO DE CAMBIO
// ==========================================================================

function addToCart(productId) {
  const product = FerreStore.getProductById(productId);
  if (!product) return;

  if (product.stock_actual <= 0) {
    showNotification(`⚠️ Nota: ${product.nombre} figura como AGOTADO en bodega.`, 'warning');
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.cantidad += 1;
    existing.subtotal = Number((existing.cantidad * existing.precio).toFixed(2));
  } else {
    cart.push({
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      precio: product.precio_venta,
      costo: product.precio_costo,
      unidad: product.unidad,
      cantidad: 1,
      subtotal: product.precio_venta
    });
  }

  renderCart();
  playChimeTone(440, 0.08); // Bip suave de confirmación
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    removeFromCart(productId);
    return;
  }
  item.subtotal = Number((item.cantidad * item.precio).toFixed(2));
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  renderCart();
  showNotification("Venta cancelada. Mostrador limpio.", "info");
}

function getCartTotal() {
  return Number(cart.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const countBadge = document.getElementById('cart-item-count');
  const totalDisplay = document.getElementById('cart-total-amount');

  if (countBadge) countBadge.textContent = cart.reduce((acc, i) => acc + i.cantidad, 0);

  const total = getCartTotal();
  if (totalDisplay) totalDisplay.textContent = `$ ${total.toFixed(2)}`;

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-cart3" style="font-size: 2.5rem;"></i>
        <p class="mt-2 mb-0 fw-semibold">Canasta vacía</p>
        <small>Seleccione productos en el catálogo para comenzar la venta.</small>
      </div>
    `;
    resetChangeDisplay();
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="ff-cart-item">
      <div style="flex: 1; padding-right: 0.5rem;">
        <div class="fw-bold text-dark lh-sm">${item.nombre}</div>
        <small class="text-muted">$ ${item.precio.toFixed(2)} c/${item.unidad}</small>
      </div>
      <div class="d-flex align-items-center gap-1">
        <button class="btn btn-sm btn-outline-secondary px-2 py-0 fw-bold" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span class="fw-bold px-2">${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary px-2 py-0 fw-bold" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
      <div class="fw-bold text-end ps-2 font-monospace" style="min-width: 75px;">
        $ ${item.subtotal.toFixed(2)}
      </div>
      <button class="btn btn-sm text-danger ms-1 p-0" onclick="removeFromCart('${item.id}')" title="Quitar">
        <i class="bi bi-x-circle-fill"></i>
      </button>
    </div>
  `).join('');

  calculateChange();
}

/**
 * Asigna una denominación de billete rápido en dólares ($5, $10, $20, $50)
 */
function setQuickCash(amount) {
  const cashInput = document.getElementById('cash-received-input');
  if (!cashInput) return;

  if (amount === 'exacto') {
    cashInput.value = getCartTotal().toFixed(2);
  } else {
    cashInput.value = Number(amount).toFixed(2);
  }
  calculateChange();
}

function calculateChange() {
  const total = getCartTotal();
  const cashInput = document.getElementById('cash-received-input');
  const changeValueEl = document.getElementById('ff-change-val');
  const changeLabelEl = document.getElementById('ff-change-lbl');
  const btnCheckout = document.getElementById('btn-finalizar-venta');

  if (!cashInput || !changeValueEl || !btnCheckout) return;

  const cashReceived = parseFloat(cashInput.value) || 0;

  if (total === 0) {
    resetChangeDisplay();
    btnCheckout.disabled = true;
    return;
  }

  if (cashReceived === 0 && document.getElementById('payment-method-select').value === 'Efectivo') {
    changeLabelEl.textContent = "Ingrese con cuánto paga el cliente:";
    changeValueEl.textContent = "$ 0.00";
    changeValueEl.style.color = "var(--ff-text-muted)";
    btnCheckout.disabled = true;
    return;
  }

  const diff = Number((cashReceived - total).toFixed(2));

  if (diff >= 0) {
    changeLabelEl.textContent = "Su cambio es:";
    changeValueEl.textContent = `$ ${diff.toFixed(2)}`;
    changeValueEl.style.color = "#047857"; // Verde accesible de alto contraste
    btnCheckout.disabled = false;
  } else {
    changeLabelEl.textContent = "Faltante para cubrir cuenta:";
    changeValueEl.textContent = `- $ ${Math.abs(diff).toFixed(2)}`;
    changeValueEl.style.color = "#b91c1c"; // Rojo advertencia
    btnCheckout.disabled = true;
  }
}

function resetChangeDisplay() {
  const changeValueEl = document.getElementById('ff-change-val');
  const changeLabelEl = document.getElementById('ff-change-lbl');
  const cashInput = document.getElementById('cash-received-input');
  if (changeValueEl) changeValueEl.textContent = "$ 0.00";
  if (changeLabelEl) changeLabelEl.textContent = "Su cambio es:";
  if (cashInput) cashInput.value = '';
}

/**
 * Ejecuta la venta, descuenta inventario y despliega el ticket térmico
 */
function processCheckout() {
  if (cart.length === 0) return;

  const total = getCartTotal();
  const paymentMethod = document.getElementById('payment-method-select').value;
  const cashReceived = parseFloat(document.getElementById('cash-received-input').value) || total;
  const change = Math.max(0, Number((cashReceived - total).toFixed(2)));

  // Registrar venta en LocalStorage
  const completedSale = FerreStore.processSale({
    items: [...cart],
    total,
    metodo: paymentMethod,
    pagoCon: cashReceived,
    cambio: change
  });

  // Tono de éxito auditivo
  playSuccessChime();

  // Renderizar Ticket Térmico en Modal (sin nombres personales en cabecera)
  renderThermalTicket(completedSale);

  // Abrir Modal de Ticket con Bootstrap
  const ticketModalEl = document.getElementById('modalTicket');
  if (ticketModalEl) {
    const ticketModal = new bootstrap.Modal(ticketModalEl);
    ticketModal.show();
  }

  // Limpiar canasta y refrescar vistas
  cart = [];
  renderCart();
  renderMostradorCatalog();
  renderSemaforoView();
  renderCorteCajaView();
  renderCatalogoView();
  updateSemaforoBadge();
}

/**
 * Renderiza el formato de ticket térmico
 * (Se retiró el nombre personal en la cabecera por solicitud de diseño)
 */
function renderThermalTicket(sale) {
  const container = document.getElementById('thermal-ticket-content');
  if (!container) return;

  container.innerHTML = `
    <div class="ff-ticket">
      <div class="text-center">
        <h5 class="fw-bold mb-1">FERRETERÍA Y MATERIALES</h5>
        <h6 class="fw-bold text-uppercase mb-1">"EL TORNILLO DE ORO"</h6>
        <div class="small text-muted">Barrio El Ángel, 2a Calle Poniente #3-5</div>
        <div class="small text-muted">Sonsonate, El Salvador | Tel: 2451-2345</div>
        <div class="small text-muted">NRC: 245890-1 | NIT: 0315-120508-101-2</div>
      </div>
      
      <div class="ff-ticket-divider"></div>
      
      <div class="d-flex justify-content-between small">
        <span>Folio: <strong>${sale.id}</strong></span>
        <span>${sale.hora}</span>
      </div>
      <div class="small text-muted">Fecha: ${new Date(sale.fecha).toLocaleDateString('es-SV')}</div>
      <div class="small">Atendido por: <strong>Caja Mostrador</strong></div>

      <div class="ff-ticket-divider"></div>

      <div class="small">
        ${sale.items.map(item => `
          <div class="d-flex justify-content-between my-1">
            <div>
              <span>${item.cantidad}x ${item.nombre}</span><br>
              <small class="text-muted">($${item.precio.toFixed(2)} c/u)</small>
            </div>
            <div class="fw-bold font-monospace">$ ${item.subtotal.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="ff-ticket-divider"></div>

      <div class="ff-ticket-total d-flex justify-content-between">
        <span>TOTAL (USD):</span>
        <span>$ ${sale.total.toFixed(2)}</span>
      </div>

      <div class="d-flex justify-content-between small mt-2">
        <span>Método de pago:</span>
        <strong>${sale.metodo}</strong>
      </div>
      <div class="d-flex justify-content-between small">
        <span>Monto recibido:</span>
        <span>$ ${sale.pagoCon.toFixed(2)}</span>
      </div>
      <div class="d-flex justify-content-between small text-success fw-bold">
        <span>Cambio entregado:</span>
        <span>$ ${sale.cambio.toFixed(2)}</span>
      </div>

      <div class="ff-ticket-divider"></div>
      
      <div class="text-center small text-muted">
        <div>¡Gracias por su preferencia!</div>
        <div class="mt-1" style="letter-spacing: 3px; font-weight: bold;">||| | ||||| || |||||| |</div>
        <div style="font-size: 0.65rem;">FerreFácil v1.0 | Sonsonate, El Salvador</div>
      </div>
    </div>
  `;
}

// ==========================================================================
// MÓDULO 3: SEMÁFORO DE INVENTARIO Y PEDIDO AL CAMIÓN
// ==========================================================================

let semaforoFilter = 'todos';

function renderSemaforoView() {
  const catalog = FerreStore.getCatalog();

  let countAgotados = 0;
  let countReorden = 0;
  let countOptimos = 0;

  catalog.forEach(item => {
    if (item.stock_actual <= 0) countAgotados++;
    else if (item.stock_actual <= item.stock_minimo) countReorden++;
    else countOptimos++;
  });

  // Actualizar contadores KPI
  const kpiAgotados = document.getElementById('kpi-agotados-val');
  const kpiReorden = document.getElementById('kpi-reorden-val');
  const kpiOptimos = document.getElementById('kpi-optimos-val');

  if (kpiAgotados) kpiAgotados.textContent = countAgotados;
  if (kpiReorden) kpiReorden.textContent = countReorden;
  if (kpiOptimos) kpiOptimos.textContent = countOptimos;

  // Filtrar tabla
  const tableBody = document.getElementById('semaforo-table-body');
  if (!tableBody) return;

  const filtered = catalog.filter(item => {
    if (semaforoFilter === 'agotados') return item.stock_actual <= 0;
    if (semaforoFilter === 'reorden') return item.stock_actual > 0 && item.stock_actual <= item.stock_minimo;
    if (semaforoFilter === 'optimos') return item.stock_actual > item.stock_minimo;
    return true;
  });

  tableBody.innerHTML = filtered.map(item => {
    let statusBadge = '';
    let suggestedQty = 0;

    if (item.stock_actual <= 0) {
      statusBadge = `<span class="badge badge-stock-red px-2 py-1"><i class="bi bi-x-circle-fill me-1"></i> 🔴 AGOTADO</span>`;
      suggestedQty = (item.stock_minimo * 2);
    } else if (item.stock_actual <= item.stock_minimo) {
      statusBadge = `<span class="badge badge-stock-yellow px-2 py-1"><i class="bi bi-exclamation-triangle-fill me-1"></i> 🟡 REORDEN</span>`;
      suggestedQty = Math.max(1, (item.stock_minimo * 2) - item.stock_actual);
    } else {
      statusBadge = `<span class="badge badge-stock-green px-2 py-1"><i class="bi bi-check-circle-fill me-1"></i> 🟢 ÓPTIMO</span>`;
      suggestedQty = 0;
    }

    return `
      <tr>
        <td>${statusBadge}</td>
        <td>
          <div class="fw-bold">${item.nombre}</div>
          <small class="text-muted font-monospace">${item.codigo} | ${item.ubicacion}</small>
        </td>
        <td class="fw-bold text-center">${item.stock_actual} ${item.unidad}</td>
        <td class="text-muted text-center">${item.stock_minimo} ${item.unidad}</td>
        <td class="text-center font-monospace fw-bold text-primary">
          ${suggestedQty > 0 ? `+${suggestedQty} ${item.unidad}` : '-'}
        </td>
        <td><small class="text-secondary">${item.proveedor}</small></td>
      </tr>
    `;
  }).join('');
}

function filterSemaforo(filterType, buttonEl) {
  semaforoFilter = filterType;
  document.querySelectorAll('.btn-filter-semaforo').forEach(btn => btn.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
  renderSemaforoView();
}

function updateSemaforoBadge() {
  const catalog = FerreStore.getCatalog();
  const urgentes = catalog.filter(i => i.stock_actual <= i.stock_minimo).length;
  const badge = document.getElementById('badge-semaforo-tab');
  if (badge) {
    badge.textContent = urgentes;
    badge.className = `badge ff-tab-badge ${urgentes > 0 ? 'bg-danger' : 'bg-success'}`;
  }
}

/**
 * Genera la lista de compras optimizada para el camión repartidor
 */
function generateSupplierOrder() {
  const catalog = FerreStore.getCatalog();
  const orderItems = catalog.filter(item => item.stock_actual <= item.stock_minimo);

  if (orderItems.length === 0) {
    showNotification("¡Excelente! No hay productos en nivel de reorden ni agotados.", "success");
    return;
  }

  const container = document.getElementById('supplier-order-content');
  if (!container) return;

  let totalCostoEstimado = 0;

  container.innerHTML = `
    <div class="p-3 bg-white printable-area">
      <div class="border-bottom pb-3 mb-3 text-center">
        <h4 class="fw-bold text-dark mb-1">ORDEN DE REABASTECIMIENTO - CAMIÓN PROVEEDOR</h4>
        <div class="text-secondary fw-semibold">Ferretería y Materiales "El Tornillo de Oro" | Sonsonate, El Salvador</div>
        <small class="text-muted">Fecha de generación: ${new Date().toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
      </div>

      <table class="table table-bordered table-sm align-middle">
        <thead class="table-dark">
          <tr>
            <th>Prioridad</th>
            <th>Producto</th>
            <th class="text-center">Stock Actual</th>
            <th class="text-center">Mínimo</th>
            <th class="text-center">CANTIDAD A PEDIR</th>
            <th>Proveedor Sugerido</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => {
            const isCritical = item.stock_actual <= 0;
            const suggested = Math.max(1, (item.stock_minimo * 2) - item.stock_actual);
            totalCostoEstimado += (suggested * item.precio_costo);

            return `
              <tr class="${isCritical ? 'table-danger' : 'table-warning'}">
                <td class="fw-bold">${isCritical ? '🔴 URGENTE (0 stock)' : '🟡 Reorden Preventivo'}</td>
                <td>
                  <strong>${item.nombre}</strong><br>
                  <small class="text-muted">Cód: ${item.codigo}</small>
                </td>
                <td class="text-center fw-bold">${item.stock_actual} ${item.unidad}</td>
                <td class="text-center">${item.stock_minimo}</td>
                <td class="text-center fs-5 fw-black text-primary font-monospace"><strong>${suggested} ${item.unidad}</strong></td>
                <td><small>${item.proveedor}</small></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="alert alert-info py-2 d-flex justify-content-between align-items-center">
        <span>Total de artículos a surtir: <strong>${orderItems.length} referencias</strong></span>
        <span>Inversión estimada de compra: <strong>$ ${totalCostoEstimado.toFixed(2)} USD</strong></span>
      </div>

      <div class="mt-4 pt-3 border-top text-center text-muted small">
        Firma de Autorización: _____________________________________ (Administración / Compras)
      </div>
    </div>
  `;

  // Abrir Modal
  const modalEl = document.getElementById('modalPedidoCamion');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

/**
 * Copia el pedido en formato texto limpio con emojis para WhatsApp
 */
function copyOrderToWhatsApp() {
  const catalog = FerreStore.getCatalog();
  const orderItems = catalog.filter(item => item.stock_actual <= item.stock_minimo);

  let text = `📦 *PEDIDO FERRETERÍA EL TORNILLO DE ORO (SONSONATE)*\n`;
  text += `📅 Fecha: ${new Date().toLocaleDateString('es-SV')}\n`;
  text += `Estimado distribuidor, requerimos surtir el siguiente material:\n\n`;

  orderItems.forEach(item => {
    const isCritical = item.stock_actual <= 0;
    const suggested = Math.max(1, (item.stock_minimo * 2) - item.stock_actual);
    text += `${isCritical ? '🔴 [URGENTE]' : '🟡'} *${suggested} ${item.unidad}* - ${item.nombre} (Cód: ${item.codigo})\n`;
  });

  text += `\nFavor de confirmar recepción y hora de llegada del camión. Saludos, Administración El Tornillo de Oro.`;

  navigator.clipboard.writeText(text).then(() => {
    showNotification("¡Texto copiado al portapapeles! Listo para enviar por WhatsApp.", "success");
  });
}

// ==========================================================================
// MÓDULO 4: CORTE Y ARQUEO DIARIO DE CAJA
// ==========================================================================

function renderCorteCajaView() {
  const summary = FerreStore.getCashSummaryToday();

  // Actualizar tarjetas resumen
  const elTotal = document.getElementById('corte-total-vendido');
  const elEfectivo = document.getElementById('corte-total-efectivo');
  const elTransfer = document.getElementById('corte-total-transferencias');
  const elCajon = document.getElementById('corte-efectivo-cajon-esperado');
  const elClientes = document.getElementById('corte-clientes-atendidos');
  const elGanancia = document.getElementById('corte-ganancia-estimada');

  if (elTotal) elTotal.textContent = `$ ${summary.totalVendido.toFixed(2)}`;
  if (elEfectivo) elEfectivo.textContent = `$ ${summary.totalEfectivo.toFixed(2)}`;
  if (elTransfer) elTransfer.textContent = `$ ${summary.totalTransferencias.toFixed(2)}`;
  if (elCajon) elCajon.textContent = `$ ${summary.efectivoEnCajaEsperado.toFixed(2)}`;
  if (elClientes) elClientes.textContent = summary.totalTransacciones;
  if (elGanancia) elGanancia.textContent = `$ ${summary.gananciaEstimada.toFixed(2)}`;

  // Historial de ventas del día
  const tableBody = document.getElementById('corte-ventas-table-body');
  if (!tableBody) return;

  if (summary.ventas.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Aún no se registran ventas en este turno.</td></tr>`;
    return;
  }

  tableBody.innerHTML = summary.ventas.map(v => `
    <tr>
      <td class="font-monospace fw-bold">${v.id}</td>
      <td>${v.hora}</td>
      <td>
        <span class="badge ${v.metodo === 'Efectivo' ? 'bg-success' : 'bg-primary'}">${v.metodo}</span>
      </td>
      <td>
        <small class="text-secondary">${v.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}</small>
      </td>
      <td class="text-end fw-bold font-monospace">$ ${v.total.toFixed(2)}</td>
    </tr>
  `).join('');
}

/**
 * Despliega la modal de balance de cierre y arqueo
 */
function openCierreCajaModal() {
  const summary = FerreStore.getCashSummaryToday();
  const modalEl = document.getElementById('modalCierreCaja');
  if (!modalEl) return;

  document.getElementById('cierre-modal-esperado').textContent = `$ ${summary.efectivoEnCajaEsperado.toFixed(2)}`;
  document.getElementById('cierre-modal-fondo').textContent = `$ ${summary.fondoInicial.toFixed(2)}`;
  document.getElementById('cierre-modal-ventas-efectivo').textContent = `$ ${summary.totalEfectivo.toFixed(2)}`;
  document.getElementById('cierre-modal-transferencias').textContent = `$ ${summary.totalTransferencias.toFixed(2)}`;

  const inputContado = document.getElementById('cierre-modal-efectivo-contado');
  inputContado.value = summary.efectivoEnCajaEsperado.toFixed(2);
  checkDiscrepancy();

  inputContado.addEventListener('input', checkDiscrepancy);

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function checkDiscrepancy() {
  const summary = FerreStore.getCashSummaryToday();
  const contado = parseFloat(document.getElementById('cierre-modal-efectivo-contado').value) || 0;
  const esperado = summary.efectivoEnCajaEsperado;
  const diff = Number((contado - esperado).toFixed(2));

  const resultEl = document.getElementById('cierre-modal-discrepancia');
  if (!resultEl) return;

  if (Math.abs(diff) < 0.05) {
    resultEl.className = "alert alert-success py-2 fw-bold text-center";
    resultEl.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ¡Caja Cuadrada Exacta! Cero faltantes.`;
  } else if (diff > 0) {
    resultEl.className = "alert alert-info py-2 fw-bold text-center";
    resultEl.innerHTML = `<i class="bi bi-info-circle-fill me-1"></i> Sobrante en cajón: +$ ${diff.toFixed(2)} USD`;
  } else {
    resultEl.className = "alert alert-danger py-2 fw-bold text-center";
    resultEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> Faltante en cajón: -$ ${Math.abs(diff).toFixed(2)} USD`;
  }
}

function confirmCierreCaja() {
  const summary = FerreStore.getCashSummaryToday();
  const contado = parseFloat(document.getElementById('cierre-modal-efectivo-contado').value) || 0;

  FerreStore.closeDay({
    fecha: new Date().toISOString(),
    resumen: summary,
    efectivoContado: contado,
    responsable: "Caja Principal / Mostrador"
  });

  const modalEl = document.getElementById('modalCierreCaja');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  renderCorteCajaView();
  showNotification("¡Corte de caja completado y archivado con éxito! Turno cerrado.", "success");
}

// ==========================================================================
// MÓDULO 5: CATÁLOGO Y EDICIÓN RÁPIDA
// ==========================================================================

function renderCatalogoView() {
  const catalog = FerreStore.getCatalog();
  const tableBody = document.getElementById('catalogo-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = catalog.map(item => `
    <tr>
      <td class="font-monospace fw-bold">${item.codigo}</td>
      <td>
        <div class="fw-bold">${item.nombre}</div>
        <small class="text-muted"><i class="bi bi-geo-alt"></i> ${item.ubicacion} | Prov: ${item.proveedor}</small>
      </td>
      <td><span class="badge bg-light text-dark border">${item.categoria}</span></td>
      <td class="font-monospace text-muted">$ ${item.precio_costo.toFixed(2)}</td>
      <td class="font-monospace fw-bold text-success">$ ${item.precio_venta.toFixed(2)}</td>
      <td class="text-center font-monospace">
        <span class="fw-bold">${item.stock_actual}</span> / <small class="text-muted">${item.stock_minimo}</small>
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="quickRestock('${item.id}', 10)" title="Surtir +10 piezas">
          <i class="bi bi-box-arrow-in-down me-1"></i> +10
        </button>
      </td>
    </tr>
  `).join('');
}

function quickRestock(productId, qty) {
  const catalog = FerreStore.getCatalog();
  const prod = catalog.find(p => p.id === productId);
  if (prod) {
    prod.stock_actual += qty;
    FerreStore.saveCatalog(catalog);
    renderCatalogoView();
    renderSemaforoView();
    renderMostradorCatalog();
    updateSemaforoBadge();
    showNotification(`Surtidas +${qty} piezas a ${prod.nombre}`, "success");
  }
}

function saveNewProduct() {
  const nombre = document.getElementById('new-prod-nombre').value.trim();
  const codigo = document.getElementById('new-prod-codigo').value.trim();
  const categoria = document.getElementById('new-prod-categoria').value;
  const precioVenta = parseFloat(document.getElementById('new-prod-precio-venta').value) || 0;
  const precioCosto = parseFloat(document.getElementById('new-prod-precio-costo').value) || 0;
  const stockInicial = parseInt(document.getElementById('new-prod-stock-inicial').value) || 0;
  const stockMinimo = parseInt(document.getElementById('new-prod-stock-minimo').value) || 5;
  const ubicacion = document.getElementById('new-prod-ubicacion').value.trim() || 'Mostrador';
  const proveedor = document.getElementById('new-prod-proveedor').value.trim() || 'Distribuidora Ferretera de Occidente - Sonsonate';

  if (!nombre || !codigo || precioVenta <= 0) {
    alert("Por favor complete nombre, código y precio de venta válido.");
    return;
  }

  const newProd = {
    id: codigo.toUpperCase(),
    codigo: codigo.toUpperCase(),
    nombre,
    categoria,
    ubicacion,
    precio_venta: Number(precioVenta.toFixed(2)),
    precio_costo: Number(precioCosto.toFixed(2)),
    stock_actual: stockInicial,
    stock_minimo: stockMinimo,
    stock_maximo: stockMinimo * 4,
    unidad: "pza",
    proveedor
  };

  FerreStore.addProduct(newProd);

  const modalEl = document.getElementById('modalNuevoProducto');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  renderCatalogoView();
  renderMostradorCatalog();
  renderSemaforoView();
  updateSemaforoBadge();
  showNotification(`Producto "${nombre}" registrado correctamente.`, "success");
}

// ==========================================================================
// ACCESIBILIDAD: MODO ACCESIBLE
// ==========================================================================

function toggleModoAccesible() {
  const isEnabled = document.body.classList.toggle('modo-accesible');
  document.body.classList.remove('modo-don-roberto');
  const settings = FerreStore.getSettings();
  settings.modoAccesible = isEnabled;
  FerreStore.saveSettings(settings);

  updateModoAccesibleButton(isEnabled);

  const msg = isEnabled 
    ? "👓 'Modo Accesible' activado: Letras grandes y números de alto contraste."
    : "Modo estándar activado.";
  showNotification(msg, "info");
}

function updateModoAccesibleButton(isEnabled) {
  const btn = document.getElementById('btn-toggle-accesible') || document.getElementById('btn-toggle-don-roberto');
  if (!btn) return;
  if (isEnabled) {
    btn.classList.remove('btn-outline-warning');
    btn.classList.add('btn-warning', 'text-dark', 'fw-bold');
    btn.innerHTML = `<i class="bi bi-universal-access me-1"></i> Modo Accesible: ACTIVO`;
  } else {
    btn.classList.remove('btn-warning', 'text-dark');
    btn.classList.add('btn-outline-warning');
    btn.innerHTML = `<i class="bi bi-universal-access me-1"></i> Modo Accesible`;
  }
}

// ==========================================================================
// EFECTOS DE SONIDO Y NOTIFICACIONES WEB AUDIO API
// ==========================================================================

function playChimeTone(freq = 440, duration = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Si el navegador bloquea audio antes de interacción, se ignora silenciosamente
  }
}

function playSuccessChime() {
  playChimeTone(523.25, 0.12); // Do5
  setTimeout(() => playChimeTone(659.25, 0.20), 120); // Mi5
}

function showNotification(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toastId = `toast-${Date.now()}`;
  const icon = type === 'success' ? 'check-circle-fill text-success' 
             : type === 'warning' ? 'exclamation-triangle-fill text-warning' 
             : 'info-circle-fill text-primary';

  const html = `
    <div id="${toastId}" class="toast align-items-center text-bg-light border-0 shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-${icon} fs-5"></i>
          <span class="fw-semibold text-dark">${message}</span>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', html);
  const toastEl = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
  bsToast.show();

  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}
