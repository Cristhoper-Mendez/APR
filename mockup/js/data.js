/**
 * Catálogo Semilla Inicial de Ferretería "El Tornillo de Oro"
 * Localización: Sonsonate, El Salvador | Moneda: Dólares de los Estados Unidos (USD / $)
 * Datos representativos para evaluación académica y pruebas del sistema FerreFácil.
 */

const INITIAL_CATALOG = [
  // --- PLOMERÍA ---
  {
    id: "PLOM-01",
    codigo: "PLOM-01",
    nombre: "Cinta Teflón 1/2\" x 10m Truper",
    categoria: "Plomería",
    ubicacion: "Pasillo 1 - Gaveta B4",
    precio_venta: 0.75,
    precio_costo: 0.35,
    stock_actual: 18,
    stock_minimo: 10,
    stock_maximo: 50,
    unidad: "pza",
    proveedor: "Freund Mayoreo El Salvador"
  },
  {
    id: "PLOM-02",
    codigo: "PLOM-02",
    nombre: "Codo PVC Hidráulico 1/2\"",
    categoria: "Plomería",
    ubicacion: "Pasillo 1 - Repisa 1",
    precio_venta: 0.45,
    precio_costo: 0.20,
    stock_actual: 0, // 🔴 AGOTADO
    stock_minimo: 25,
    stock_maximo: 80,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "PLOM-03",
    codigo: "PLOM-03",
    nombre: "Pegamento PVC 125 ml c/aplicador",
    categoria: "Plomería",
    ubicacion: "Pasillo 1 - Repisa 2",
    precio_venta: 2.85,
    precio_costo: 1.70,
    stock_actual: 3, // 🟡 REORDEN
    stock_minimo: 8,
    stock_maximo: 24,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "PLOM-04",
    codigo: "PLOM-04",
    nombre: "Llave de Paso Esfera Latón 1/2\" Foset",
    categoria: "Plomería",
    ubicacion: "Vitrina Mostrador 1",
    precio_venta: 4.75,
    precio_costo: 2.90,
    stock_actual: 9,
    stock_minimo: 4,
    stock_maximo: 15,
    unidad: "pza",
    proveedor: "Freund Mayoreo El Salvador"
  },
  {
    id: "PLOM-05",
    codigo: "PLOM-05",
    nombre: "Empaque Cónico para Fregadero",
    categoria: "Plomería",
    ubicacion: "Gaveta A3",
    precio_venta: 0.35,
    precio_costo: 0.12,
    stock_actual: 32,
    stock_minimo: 15,
    stock_maximo: 60,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "PLOM-06",
    codigo: "PLOM-06",
    nombre: "Manguera Flexible para Lavabo 1/2\" x 1/2\"",
    categoria: "Plomería",
    ubicacion: "Pasillo 1 - Gancho 3",
    precio_venta: 2.50,
    precio_costo: 1.40,
    stock_actual: 2, // 🟡 REORDEN
    stock_minimo: 6,
    stock_maximo: 20,
    unidad: "pza",
    proveedor: "Vidrí Mayoreo El Salvador"
  },

  // --- ELECTRICIDAD ---
  {
    id: "ELEC-01",
    codigo: "ELEC-01",
    nombre: "Cinta de Aislar Negra 18m Volteck",
    categoria: "Electricidad",
    ubicacion: "Mostrador Frontal",
    precio_venta: 1.15,
    precio_costo: 0.60,
    stock_actual: 4, // 🟡 REORDEN
    stock_minimo: 15,
    stock_maximo: 40,
    unidad: "pza",
    proveedor: "Eléctrica Sonsonateca"
  },
  {
    id: "ELEC-02",
    codigo: "ELEC-02",
    nombre: "Apagador Sencillo c/Placa Marfil",
    categoria: "Electricidad",
    ubicacion: "Pasillo 2 - Gaveta E1",
    precio_venta: 1.95,
    precio_costo: 1.05,
    stock_actual: 14,
    stock_minimo: 8,
    stock_maximo: 30,
    unidad: "pza",
    proveedor: "Eléctrica Sonsonateca"
  },
  {
    id: "ELEC-03",
    codigo: "ELEC-03",
    nombre: "Foco LED 12W Luz Blanca E26",
    categoria: "Electricidad",
    ubicacion: "Estante Central",
    precio_venta: 1.85,
    precio_costo: 0.95,
    stock_actual: 26,
    stock_minimo: 10,
    stock_maximo: 50,
    unidad: "pza",
    proveedor: "Sylvania / Philips El Salvador"
  },
  {
    id: "ELEC-04",
    codigo: "ELEC-04",
    nombre: "Cable THW Calibre 12 AWG (Metro)",
    categoria: "Electricidad",
    ubicacion: "Carrete Central",
    precio_venta: 0.85,
    precio_costo: 0.48,
    stock_actual: 0, // 🔴 AGOTADO
    stock_minimo: 50,
    stock_maximo: 200,
    unidad: "m",
    proveedor: "Condusal El Salvador"
  },
  {
    id: "ELEC-05",
    codigo: "ELEC-05",
    nombre: "Clavija Blindada Uso Rudo 15A",
    categoria: "Electricidad",
    ubicacion: "Pasillo 2 - Gaveta E4",
    precio_venta: 1.50,
    precio_costo: 0.80,
    stock_actual: 11,
    stock_minimo: 5,
    stock_maximo: 20,
    unidad: "pza",
    proveedor: "Eléctrica Sonsonateca"
  },

  // --- TORNILLERÍA Y FIJACIÓN ---
  {
    id: "TORN-01",
    codigo: "TORN-01",
    nombre: "Clavo Estándar c/Cabeza 2\" (Libra)",
    categoria: "Tornillería",
    ubicacion: "Costalera Trastienda",
    precio_venta: 1.25,
    precio_costo: 0.75,
    stock_actual: 3.5, // 🟡 REORDEN
    stock_minimo: 10,
    stock_maximo: 50,
    unidad: "lb",
    proveedor: "CORINCA El Salvador"
  },
  {
    id: "TORN-02",
    codigo: "TORN-02",
    nombre: "Clavo para Concreto 2 1/2\" (Ciento)",
    categoria: "Tornillería",
    ubicacion: "Caja Gaveta T-12",
    precio_venta: 1.85,
    precio_costo: 1.00,
    stock_actual: 18,
    stock_minimo: 8,
    stock_maximo: 30,
    unidad: "ciento",
    proveedor: "CORINCA El Salvador"
  },
  {
    id: "TORN-03",
    codigo: "TORN-03",
    nombre: "Pija Negra para Tabla Yeso 1\"",
    categoria: "Tornillería",
    ubicacion: "Gaveta T-04",
    precio_venta: 0.04,
    precio_costo: 0.015,
    stock_actual: 350,
    stock_minimo: 100,
    stock_maximo: 1000,
    unidad: "pza",
    proveedor: "Tornillos y Fijaciones Sonsonate"
  },
  {
    id: "TORN-04",
    codigo: "TORN-04",
    nombre: "Taquete Plástico Expansivo 1/4\" c/tornillo",
    categoria: "Tornillería",
    ubicacion: "Mostrador - Cajón 3",
    precio_venta: 0.12,
    precio_costo: 0.05,
    stock_actual: 180,
    stock_minimo: 50,
    stock_maximo: 400,
    unidad: "pza",
    proveedor: "Tornillos y Fijaciones Sonsonate"
  },
  {
    id: "TORN-05",
    codigo: "TORN-05",
    nombre: "Tornillo Hexagonal Grado 2 - 1/4\" x 2\"",
    categoria: "Tornillería",
    ubicacion: "Gaveta T-22",
    precio_venta: 0.25,
    precio_costo: 0.10,
    stock_actual: 0, // 🔴 AGOTADO
    stock_minimo: 40,
    stock_maximo: 150,
    unidad: "pza",
    proveedor: "Tornillos y Fijaciones Sonsonate"
  },

  // --- HERRAMIENTAS ---
  {
    id: "HERR-01",
    codigo: "HERR-01",
    nombre: "Broca para Concreto 1/4\" Truper Expert",
    categoria: "Herramientas",
    ubicacion: "Vitrina Central",
    precio_venta: 2.25,
    precio_costo: 1.25,
    stock_actual: 0, // 🔴 AGOTADO
    stock_minimo: 8,
    stock_maximo: 25,
    unidad: "pza",
    proveedor: "Freund Mayoreo El Salvador"
  },
  {
    id: "HERR-02",
    codigo: "HERR-02",
    nombre: "Broca para Metal HSS 3/16\" Surtek",
    categoria: "Herramientas",
    ubicacion: "Vitrina Central",
    precio_venta: 1.65,
    precio_costo: 0.90,
    stock_actual: 5,
    stock_minimo: 4,
    stock_maximo: 15,
    unidad: "pza",
    proveedor: "Vidrí Mayoreo El Salvador"
  },
  {
    id: "HERR-03",
    codigo: "HERR-03",
    nombre: "Flexómetro 5 Metros Contra Impacto Pretul",
    categoria: "Herramientas",
    ubicacion: "Pasillo 3 - Anaquel A",
    precio_venta: 3.75,
    precio_costo: 2.10,
    stock_actual: 12,
    stock_minimo: 5,
    stock_maximo: 20,
    unidad: "pza",
    proveedor: "Freund Mayoreo El Salvador"
  },
  {
    id: "HERR-04",
    codigo: "HERR-04",
    nombre: "Martillo de Uña Curva 16 oz Mango Madera",
    categoria: "Herramientas",
    ubicacion: "Pasillo 3 - Gancho 1",
    precio_venta: 7.50,
    precio_costo: 4.40,
    stock_actual: 4,
    stock_minimo: 3,
    stock_maximo: 10,
    unidad: "pza",
    proveedor: "Freund Mayoreo El Salvador"
  },
  {
    id: "HERR-05",
    codigo: "HERR-05",
    nombre: "Pinzas de Chofer 8\" con Aislamiento",
    categoria: "Herramientas",
    ubicacion: "Vitrina Mostrador 2",
    precio_venta: 5.25,
    precio_costo: 2.95,
    stock_actual: 1, // 🟡 REORDEN
    stock_minimo: 3,
    stock_maximo: 8,
    unidad: "pza",
    proveedor: "Vidrí Mayoreo El Salvador"
  },
  {
    id: "HERR-06",
    codigo: "HERR-06",
    nombre: "Juego de Llaves Allen 9 pzas Métricas",
    categoria: "Herramientas",
    ubicacion: "Vitrina Central",
    precio_venta: 4.65,
    precio_costo: 2.70,
    stock_actual: 6,
    stock_minimo: 3,
    stock_maximo: 12,
    unidad: "juego",
    proveedor: "Vidrí Mayoreo El Salvador"
  },

  // --- CERRAJERÍA Y PINTURA ---
  {
    id: "PINT-01",
    codigo: "PINT-01",
    nombre: "Lija de Agua Grano #120 Fandeli",
    categoria: "Pintura",
    ubicacion: "Mostrador Frontal - Gaveta L",
    precio_venta: 0.65,
    precio_costo: 0.30,
    stock_actual: 45,
    stock_minimo: 20,
    stock_maximo: 100,
    unidad: "hoja",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "PINT-02",
    codigo: "PINT-02",
    nombre: "Brocha para Pintar 2\" Cerda Natural",
    categoria: "Pintura",
    ubicacion: "Pasillo 4 - Exhibidor",
    precio_venta: 1.50,
    precio_costo: 0.75,
    stock_actual: 2, // 🟡 REORDEN
    stock_minimo: 6,
    stock_maximo: 25,
    unidad: "pza",
    proveedor: "Pinturas Corona El Salvador"
  },
  {
    id: "PINT-03",
    codigo: "PINT-03",
    nombre: "Thinner Estándar 1 Litro (Envase)",
    categoria: "Pintura",
    ubicacion: "Bodega de Solventes",
    precio_venta: 2.65,
    precio_costo: 1.50,
    stock_actual: 16,
    stock_minimo: 10,
    stock_maximo: 40,
    unidad: "litro",
    proveedor: "Pinturas Corona El Salvador"
  },
  {
    id: "CERR-01",
    codigo: "CERR-01",
    nombre: "Candado de Latón 50mm Llave Tradicional",
    categoria: "Cerrajería",
    ubicacion: "Vitrina Mostrador 1",
    precio_venta: 5.75,
    precio_costo: 3.40,
    stock_actual: 7,
    stock_minimo: 4,
    stock_maximo: 15,
    unidad: "pza",
    proveedor: "Cerrajería y Distribuciones El Salvador"
  },
  {
    id: "CERR-02",
    codigo: "CERR-02",
    nombre: "Chapa de Pomo para Recámara Latón Brillante",
    categoria: "Cerrajería",
    ubicacion: "Pasillo 4 - Repisa C",
    precio_venta: 9.85,
    precio_costo: 6.20,
    stock_actual: 3,
    stock_minimo: 2,
    stock_maximo: 8,
    unidad: "pza",
    proveedor: "Cerrajería y Distribuciones El Salvador"
  },

  // --- ADHESIVOS Y CONSUMIBLES ---
  {
    id: "ADHE-01",
    codigo: "ADHE-01",
    nombre: "Silicón Transparente Multiusos 280ml",
    categoria: "Adhesivos",
    ubicacion: "Pasillo 2 - Estante 1",
    precio_venta: 3.45,
    precio_costo: 2.00,
    stock_actual: 0, // 🔴 AGOTADO
    stock_minimo: 6,
    stock_maximo: 20,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "ADHE-02",
    codigo: "ADHE-02",
    nombre: "Pega Instantánea Kola Loka 3g",
    categoria: "Adhesivos",
    ubicacion: "Tira Mostrador Cobro",
    precio_venta: 1.25,
    precio_costo: 0.70,
    stock_actual: 22,
    stock_minimo: 10,
    stock_maximo: 40,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "ADHE-03",
    codigo: "ADHE-03",
    nombre: "Cinta Masking Tape 3/4\" x 50m",
    categoria: "Adhesivos",
    ubicacion: "Pasillo 2 - Repisa 3",
    precio_venta: 1.65,
    precio_costo: 0.90,
    stock_actual: 15,
    stock_minimo: 8,
    stock_maximo: 30,
    unidad: "pza",
    proveedor: "Distribuidora Ferretera de Occidente - Sonsonate"
  },
  {
    id: "VARI-01",
    codigo: "VARI-01",
    nombre: "Guantes de Carnaza Corto para Albañil",
    categoria: "Seguridad",
    ubicacion: "Pasillo 3 - Repisa Inferior",
    precio_venta: 2.60,
    precio_costo: 1.45,
    stock_actual: 19,
    stock_minimo: 8,
    stock_maximo: 30,
    unidad: "par",
    proveedor: "Freund Mayoreo El Salvador"
  }
];
