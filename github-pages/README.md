# Project Scope - Frontend para GitHub Pages

## 📁 **Archivos para GitHub Pages**

Este directorio contiene solo los archivos del frontend que se subirán a GitHub Pages.

### **Archivos incluidos:**
- `index.html` - Página principal
- `app.js` - Lógica principal de la aplicación
- `app-extensions.js` - Funcionalidades extendidas
- `api-client-production.js` - Cliente API configurado para producción
- `demo-data.js` - Datos de demostración
- `README.md` - Documentación

### **Configuración necesaria:**

1. **Actualizar URL de la API** en `api-client-production.js`:
```javascript
this.baseURL = 'https://api.tudominio.com/api'; // ← Cambiar por tu URL
```

2. **Actualizar referencia** en `index.html`:
```html
<script src="api-client-production.js"></script> <!-- ← Usar este archivo -->
```

### **Despliegue:**

1. Crear repositorio en GitHub
2. Subir estos archivos
3. Habilitar GitHub Pages en Settings → Pages
4. Tu sitio estará en: `https://tuusuario.github.io/turepositorio`

### **Nota importante:**
Este frontend se conectará a tu backend en Hostinger. Asegúrate de que:
- El backend esté desplegado en Hostinger
- La base de datos MySQL esté configurada
- CORS esté configurado para permitir tu dominio de GitHub Pages
