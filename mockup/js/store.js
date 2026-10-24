/**
 * Gestor de Persistencia y Base de Datos Local en LocalStorage
 * Ferretería y Materiales "El Tornillo de Oro" - Sonsonate, El Salvador
 * Moneda: Dólares de los Estados Unidos (USD / $)
 */

const STORAGE_KEYS = {
  CATALOG: 'ferrefacil_catalog_v2',
  SALES: 'ferrefacil_sales_v2',
  CLOSURES: 'ferrefacil_closures_v2',
  SETTINGS: 'ferrefacil_settings_v2'
};

const FerreStore = {
  /**
   * Inicializa la base de datos local con datos semilla si no existen
   */
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATALOG)) {
      this.resetToDefaults();
    }
  },

  /**
   * Restablece los datos de demostración para pruebas o exposiciones
   */
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    
    // Ventas previas del turno en Dólares (USD)
    const hoy = new Date();
    const ventasIniciales = [
      {
        id: "VTA-101",
        fecha: new Date(hoy.getTime() - 3 * 3600000).toISOString(),
        hora: "08:42",
        items: [
          { id: "TORN-01", nombre: "Clavo Estándar 2\" (Libra)", cantidad: 2, precio: 1.25, subtotal: 2.50, costo: 0.75 }
        ],
        total: 2.50,
        metodo: "Efectivo",
        pagoCon: 5.00,
        cambio: 2.50,
        gananciaEstimada: 1.00
      },
      {
        id: "VTA-102",
        fecha: new Date(hoy.getTime() - 2 * 3600000).toISOString(),
        hora: "09:35",
        items: [
          { id: "PLOM-01", nombre: "Cinta Teflón 1/2\"", cantidad: 1, precio: 0.75, subtotal: 0.75, costo: 0.35 },
          { id: "PLOM-04", nombre: "Llave de Paso 1/2\" Foset", cantidad: 1, precio: 4.75, subtotal: 4.75, costo: 2.90 }
        ],
        total: 5.50,
        metodo: "Transferencia Chivo / Banco",
        pagoCon: 5.50,
        cambio: 0.00,
        gananciaEstimada: 2.25
      },
      {
        id: "VTA-103",
        fecha: new Date(hoy.getTime() - 1 * 3600000).toISOString(),
        hora: "10:15",
        items: [
          { id: "PINT-01", nombre: "Lija de Agua #120", cantidad: 4, precio: 0.65, subtotal: 2.60, costo: 0.30 }
        ],
        total: 2.60,
        metodo: "Efectivo",
        pagoCon: 5.00,
        cambio: 2.40,
        gananciaEstimada: 1.40
      }
    ];

    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(ventasIniciales));
    localStorage.setItem(STORAGE_KEYS.CLOSURES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      modoAccesible: false,
      fondoInicialCaja: 50.00
    }));
  },

  // --- CATÁLOGO ---
  getCatalog() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATALOG);
      return data ? JSON.parse(data) : INITIAL_CATALOG;
    } catch (e) {
      console.error("Error al leer catálogo:", e);
      return INITIAL_CATALOG;
    }
  },

  saveCatalog(catalog) {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
  },

  getProductById(id) {
    const catalog = this.getCatalog();
    return catalog.find(item => item.id === id);
  },

  addProduct(newProduct) {
    const catalog = this.getCatalog();
    catalog.unshift(newProduct);
    this.saveCatalog(catalog);
  },

  updateProduct(updatedProduct) {
    const catalog = this.getCatalog();
    const index = catalog.findIndex(item => item.id === updatedProduct.id);
    if (index !== -1) {
      catalog[index] = updatedProduct;
      this.saveCatalog(catalog);
    }
  },

  // --- VENTAS Y DEDUCCIÓN DE STOCK ---
  getSales() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Registra una venta en el mostrador y descuenta existencias en tiempo real
   */
  processSale(saleData) {
    const catalog = this.getCatalog();
    let gananciaTotal = 0;

    // Descontar inventario
    saleData.items.forEach(cartItem => {
      const prod = catalog.find(p => p.id === cartItem.id);
      if (prod) {
        prod.stock_actual = Math.max(0, Number((prod.stock_actual - cartItem.cantidad).toFixed(2)));
        gananciaTotal += (cartItem.precio - prod.precio_costo) * cartItem.cantidad;
      }
    });

    this.saveCatalog(catalog);

    // Guardar registro de venta
    const sales = this.getSales();
    const newSale = {
      id: `VTA-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString(),
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: saleData.items,
      total: Number(saleData.total.toFixed(2)),
      metodo: saleData.metodo,
      pagoCon: Number(saleData.pagoCon.toFixed(2)),
      cambio: Number(saleData.cambio.toFixed(2)),
      gananciaEstimada: Number(gananciaTotal.toFixed(2))
    };

    sales.unshift(newSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

    return newSale;
  },

  // --- CORTE Y ARQUEO DIARIO ---
  getCashSummaryToday() {
    const sales = this.getSales();
    const settings = this.getSettings();
    const fondoInicial = settings.fondoInicialCaja || 50.00;

    let totalVendido = 0;
    let totalEfectivo = 0;
    let totalTransferencias = 0;
    let gananciaTotal = 0;

    sales.forEach(s => {
      totalVendido += s.total;
      gananciaTotal += s.gananciaEstimada || 0;
      if (s.metodo === "Efectivo") {
        totalEfectivo += s.total;
      } else {
        totalTransferencias += s.total;
      }
    });

    return {
      fondoInicial,
      totalVendido: Number(totalVendido.toFixed(2)),
      totalEfectivo: Number(totalEfectivo.toFixed(2)),
      totalTransferencias: Number(totalTransferencias.toFixed(2)),
      efectivoEnCajaEsperado: Number((fondoInicial + totalEfectivo).toFixed(2)),
      gananciaEstimada: Number(gananciaTotal.toFixed(2)),
      totalTransacciones: sales.length,
      ventas: sales
    };
  },

  closeDay(corteData) {
    const closures = this.getClosures();
    closures.unshift(corteData);
    localStorage.setItem(STORAGE_KEYS.CLOSURES, JSON.stringify(closures));
    
    // Reiniciar ventas para el nuevo turno
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
  },

  getClosures() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLOSURES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // --- CONFIGURACIONES ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { modoAccesible: false, fondoInicialCaja: 50.00 };
    } catch (e) {
      return { modoAccesible: false, fondoInicialCaja: 50.00 };
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};

// Auto-inicializar al cargar
FerreStore.init();
