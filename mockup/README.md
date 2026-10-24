# FerreFácil v1.0 - Mockups Interactivos del Proyecto APR
## Ferretería y Materiales "El Tornillo de Oro" - Sonsonate, El Salvador

Este paquete contiene los **mockups interactivos y funcionales** desarrollados para materializar la propuesta tecnológica descrita en el documento académico del **Proyecto APR** ([`Proyecto_Ferreteria_APR.md`](file:///c:/Users/odito/Documents/Pruebas/APR/Proyecto_Ferreteria_APR.md)).

---

## 1. ¿Cómo Ejecutar los Mockups?

No requiere instalación de bases de datos complejas ni dependencias de backend:

1. **Opción Directa (Navegador):**
   - Haz doble clic sobre el archivo [`mockup/index.html`](file:///c:/Users/odito/Documents/Pruebas/APR/mockup/index.html) para abrirlo en cualquier navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
2. **Opción Servidor Local (Opcional):**
   - Si cuentas con Node.js o Python:
     ```bash
     # Con Python 3
     python -m http.server 8000
     # Luego abrir: http://localhost:8000/mockup/
     ```

---

## 2. Tecnologías Empleadas

- **Estructura y Semántica:** HTML5 estándar con etiquetas semánticas y accesibilidad (ARIA).
- **Estilos y Maquetación:** Bootstrap 5.3.3 + CSS3 personalizado (`css/styles.css`) con paleta industrial y diseño ergonómico de mostrador.
- **Iconografía:** Bootstrap Icons 1.11.3.
- **Tipografía:** Google Fonts (*Outfit* para texto principal y *JetBrains Mono* para tickets y números de alta precisión).
- **Lógica e Interactividad:** JavaScript moderno ES6 reactivo modular (`js/app.js`).
- **Persistencia de Datos:** `LocalStorage` del navegador (`js/store.js`), permitiendo que las ventas descuenten el stock del semáforo y se acumulen en el corte de caja en tiempo real.
- **Moneda y Localización:** Dólares de los Estados Unidos (**$ USD**) con base operativa en **Sonsonate, El Salvador**.
- **Retroalimentación Sonora:** Sintetizador Web Audio API nativo (bips suaves y acordes musicales armónicos sin dependencias de red).

---

## 3. Módulos y Flujos de Demostración para la Exposición

### Flujo 1: Búsqueda Omnibox y Venta Rápida en Mostrador
1. En la pestaña **Mostrador y Venta Rápida**, escribe en el buscador: `tef`.
2. Observa cómo en menos de 0.2 segundos aparece la **Cinta Teflón 1/2"** con su precio ($0.75 USD), existencia física (18 piezas) y ubicación en bodega (*Pasillo 1 - Gaveta B4*).
3. Haz clic en **"+ Agregar"** para sumarla a la nota.
4. Escribe ahora `codo` y agrega un codo de PVC; luego escribe `broca` o selecciona los filtros superiores (Plomería, Herramientas, etc.).
5. En la columna derecha, selecciona el billete de pago con los botones rápidos (**$5**, **$10**, **$20** o **$50**).
6. Observa el visor verde gigante de **"SU CAMBIO ES:"** con tipografía de alto contraste.
7. Presiona **"Cobrar e Imprimir Ticket"**:
   - Escucharás el tono de éxito.
   - Se abrirá la ventana modal con la simulación del **ticket térmico de 58/80 mm** de la tienda en Sonsonate listo para imprimir.
   - El inventario se descuenta automáticamente en toda la aplicación.

### Flujo 2: Semáforo de Inventario y Pedido para el Camión
1. Dirígete a la pestaña **"Semáforo de Stock"**.
2. Observa los contadores de estado:
   - 🔴 **Artículos Agotados** (stock en 0).
   - 🟡 **Punto de Reorden** (stock menor o igual al mínimo de seguridad).
   - 🟢 **Stock Óptimo** (abastecimiento adecuado).
3. Utiliza los botones de filtrado para revisar solo los productos en rojo o amarillo.
4. Haz clic en **"Generar Pedido para el Camión Proveedor"**:
   - Se compila de forma automática la orden de reposición calculando la cantidad sugerida de compra: `Sugerido = (Stock Mínimo * 2) - Stock Actual`.
   - Puedes usar el botón **"Imprimir en Papel"** o **"Copiar para WhatsApp"** para enviar el pedido al distribuidor mayorista en El Salvador.

### Flujo 3: Corte Diario de Caja (Arqueo Guiado en USD)
1. Ve a la pestaña **"Corte Diario de Caja"**.
2. Revisa las tarjetas en vivo: Total vendido del día ($ USD), ventas en efectivo, cobros vía transferencia / Chivo Wallet, y ganancia bruta estimada.
3. Observa la tabla de auditoría con la lista de clientes atendidos en el turno.
4. Presiona **"Realizar Corte de Caja y Cierre de Turno"**:
   - Se abre el asistente de arqueo.
   - Ingresa el monto físico contado en el cajón de madera y observa cómo el sistema detecta de inmediato si la caja está cuadrada exacta, o si existe sobrante o faltante.
   - Confirma el cierre para archivar el turno.

### Flujo 4: Modo Accesible
1. En la barra superior, haz clic en el botón **"Modo Accesible"**.
2. Observa cómo toda la interfaz incrementa su escala tipográfica (+25%), aumenta el contraste de los números y hace gigante la visualización del cambio para personas de la tercera edad o con debilidad visual.

### Flujo 5: Restablecer Datos de Prueba
- En la esquina superior derecha, el botón **"Reiniciar Demo"** permite restaurar el catálogo y ventas iniciales en cualquier momento con un solo clic.
