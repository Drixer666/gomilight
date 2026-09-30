# GOMI LIGHT · Gomitas saludables de Pachacútec

Web del emprendimiento escolar de la I.E. N.° 5130 Pachacútec (Ventanilla, Callao, Perú).

Gomitas con fruta real, pectina cítrica y 0% azúcar añadida.

En línea en: <https://drixer666.github.io/gomilight/>

## Qué hay en esta carpeta, en orden de importancia

| # | Archivo | Qué es | Por qué ese orden |
|---|---|---|---|
| 1 | `index.html` | La página completa: portada, sabores, nutrición, historia, tienda, FAQ y contacto | Es el proyecto: todo el contenido y la estructura |
| 2 | `estilos.css` | Colores, tarjetas, modo oscuro y animaciones | Es lo que hace que se vea profesional |
| 3 | `app.js` | Carrito, calculadora de packs y la asistente Dulcita | Es lo que hace que la web funcione |
| 4 | `imagenes/` | Las 7 fotos del proyecto | Lo primero que mira la gente |
| 5 | `servidor/worker-nvidia.js` | Puente hacia la IA | Va en un servidor, no en la web: se lee, no se ejecuta |

Para ver el trabajo abre `index.html`. Ese es el único archivo que se toca.

```
gomilight-web/
├── index.html
├── estilos.css
├── app.js
├── imagenes/
└── servidor/worker-nvidia.js
```

### imagenes/

| Foto | Dónde se usa |
|---|---|
| `hero-gomitas.jpg` | Foto principal de la portada y del laboratorio |
| `fresa-andina.jpg` | Sabor Fresa Andina (Inicio, Sabores, Tienda) |
| `mango-jin-gere.jpg` | Sabor Mango Jengibre (Inicio, Sabores, Tienda) |
| `arandano-nocturno.jpg` | Sabor Arándano Nocturno (Inicio, Sabores, Tienda) |
| `limon-menta.jpg` | Sabor Limón Menta (Inicio, Sabores, Tienda) |
| `frutas-frescas.jpg` | Fruta real, sección de pledges |
| `comunidad-emprendedora.jpg` | Escolares probando el proyecto |

## Cómo se abre

No necesita instalar nada. Abre `index.html` con doble clic y funciona.

Para publicarla: sube los tres archivos (`index.html`, `estilos.css`, `app.js`)
y la carpeta `imagenes/` a GitHub Pages.

## Cómo funciona la asistente Dulcita

Dulcita responde sobre precios, sabores, envíos y pedidos. Intenta responder en este orden:

1. **NVIDIA `openai/gpt-oss-20b`**, a través del puente de `servidor/`
2. **`gpt-oss-20b` por Pollinations**, por si NVIDIA no responde
3. **`openai-fast` por Pollinations**, como segunda opción
4. **Respuestas propias del sitio**, si no hay internet

Cada motor tiene su propio límite de espera (9 s, 11 s y 9 s), así que Dulcita
nunca deja al usuario esperando sin hacer nada.

**Por qué el puente:** el navegador no puede llamar a NVIDIA directamente. NVIDIA
pide la clave en una cabecera especial, y eso obliga al navegador a pedir
permiso antes, pero NVIDIA no lo concede. El puente (`worker-nvidia.js`) recibe
la pregunta, le pone la clave en el servidor y devuelve la respuesta.

La clave **nunca** está en esta carpeta ni en la web: vive como secreto del
servidor. El navegador no la ve y no hay forma de que se lea desde el código
de la página.

## Datos del producto

| | |
|---|---|
| Pouch de 30 gomitas | S/12 |
| Pack Familiar (3 pouches) | S/33 |
| Pack Escolar (5 pouches) | S/50 |
| Valor nutricional | 42 kcal por cada 5 gomitas, 0 g azúcar añadida |
| Sabores veganos | Fresa Andina, Mango Jengibre y Limón Menta |
| Sabor con colágeno | Arándano Nocturno (no vegano) |
| Envío gratis | Pachacútec, Mi Perú y Ventanilla (punto de encuentro) |
| Envío Lima y Callao | S/8, 24 a 48 h |
| Pagos | Yape, Plin, transferencia o efectivo contra entrega |
| WhatsApp | 519 101 47552 |
| Dirección | I.E. 5130, Av. 225, Pachacútec |

## Páginas

`#/` Inicio · `#/sabores` Los 4 sabores · `#/nutricion` Tabla nutricional ·
`#/historia` El proyecto · `#/tienda` Packs y pedido · `#/faq` Preguntas ·
`#/contacto` Formulario y taller
