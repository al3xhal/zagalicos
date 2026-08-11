# Zagalicos · Centro de mando

PWA de inteligencia de mercado para Biwenger. Sin backend propio: HTML + JS en el navegador,
con un Cloudflare Worker haciendo de proxy CORS contra la API de Biwenger.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | La aplicación entera |
| `manifest.webmanifest` | Metadatos de instalación |
| `sw.js` | Service worker (abre sin conexión) |
| `icon-*.png`, `apple-touch-icon.png` | Iconos |

## Desplegar en GitHub Pages

1. Crea un repositorio (por ejemplo `zagalicos`) o usa uno existente.
2. Sube **todos** los archivos de esta carpeta a la raíz del repo.
3. `Settings` → `Pages` → Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)` → Save.
4. En 1-2 minutos estará en `https://TU-USUARIO.github.io/zagalicos/`.

## Instalar en el móvil

- **Android/Chrome:** abre la URL → menú (⋮) → *Instalar aplicación*.
- **iPhone/Safari:** abre la URL → botón compartir → *Añadir a pantalla de inicio*.

## Primera configuración

1. Engranaje (⚙) arriba a la derecha.
2. URL del Worker, email y contraseña de Biwenger → *Iniciar sesión*.
3. League ID / User ID / Versión: se capturan una vez desde el navegador de escritorio
   (F12 → Red → filtro `user` → recargar → cabeceras `X-League`, `X-User`, `X-Version`).
4. *Verificar conexión*.
5. **Importante:** pulsa *Archivar histórico completo*. Los perfiles de pujador,
   los saldos y las estadísticas se calculan sobre ese archivo.

## Notas

- Todo se guarda en `localStorage` de ese dispositivo. Si instalas en móvil y portátil,
  cada uno tendrá su propio archivo (hay que configurarlos por separado).
- Las métricas temporales (momentum de precios, acumulación de caja) necesitan que la app
  se abra varios días para acumular instantáneas diarias. Al principio salen vacías.
- El service worker no cachea datos de la API: siempre son frescos.

## Seguridad

El Worker deja pasar peticiones desde cualquier origen. Cuando termines de probar,
cambia en el Worker `'Access-Control-Allow-Origin': origin || '*'` por tu dominio concreto
(`https://TU-USUARIO.github.io`) y vuelve a desplegarlo con `npx wrangler deploy`.
