
# Mundomangua — Tampermonkey: Skip Intro / Jump & Next

Este repositorio contiene un userscript compatible con Tampermonkey que añade botones sobre los reproductores de vídeo en páginas web para:

- Saltar la presentación (por defecto a 2:30 / 150s).
- Saltar a un marcador (por defecto 9:35 / 575s).
- Ir al siguiente capítulo/episodio cuando exista un enlace o API disponible.

Archivos incluidos:

- `userscript/tampermonkey_skip_buttons.user.js` — userscript principal.
- `AGENT_INSTRUCTIONS.md` — instrucciones detalladas para usar en modo agente (Copilot/Copilot-style), incluyendo cómo usar el MCP `chrome-devtools` para inspeccionar reproductores.
- `OTHER_AGENTS_INSTRUCTIONS.md` — instrucciones diseñadas para otros agentes automatizados.

Resumen rápido de instalación:

1. Instala la extensión Tampermonkey en tu navegador.
2. Añade un nuevo userscript y pega el contenido de `userscript/tampermonkey_skip_buttons.user.js`.
3. Ajusta las opciones (tiempos, auto-skip, URL de actualización) desde el menú de Tampermonkey o el menú del script.

Notas de seguridad y permisos:

El script sólo modifica la página en el cliente (tu navegador). Evita usarlo en sitios donde la manipulación de reproductores pueda violar términos de servicio. No contiene credenciales ni llamadas a servicios remotos por defecto.

Más detalles y cómo integrar MCP servers (context7, Everything, Memory) en el flujo de trabajo están en `AGENT_INSTRUCTIONS.md`.
