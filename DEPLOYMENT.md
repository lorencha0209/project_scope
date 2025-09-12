# Project Scope - Guía de Despliegue en GitHub Pages

## Pasos para publicar en GitHub Pages

### 1. Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea una nueva cuenta si no tienes una
2. Haz clic en "New repository"
3. Nombra tu repositorio: `project-scope`
4. Hazlo público (requerido para GitHub Pages gratuito)
5. No inicialices con README (ya tenemos archivos)
6. Haz clic en "Create repository"

### 2. Subir los archivos al repositorio

```bash
# En la terminal, navega a tu carpeta del proyecto
cd /Users/serendon/Desktop/Project_Scope

# Inicializa git si no está inicializado
git init

# Agrega todos los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit: Project Scope application"

# Conecta con tu repositorio de GitHub (reemplaza 'tu-usuario' con tu nombre de usuario)
git remote add origin https://github.com/tu-usuario/project-scope.git

# Sube los archivos
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña "Settings"
3. Desplázate hacia abajo hasta "Pages" en el menú lateral
4. En "Source", selecciona "Deploy from a branch"
5. Selecciona "main" como branch
6. Selecciona "/ (root)" como folder
7. Haz clic en "Save"
8. GitHub comenzará a desplegar tu sitio

### 4. Acceder a tu sitio

- Tu sitio estará disponible en: `https://tu-usuario.github.io/project-scope/`
- El despliegue puede tomar unos minutos
- GitHub te enviará un email cuando esté listo

## Comandos útiles para desarrollo

### Servir localmente
```bash
# Opción 1: Con Python
python -m http.server 8000

# Opción 2: Con Node.js (si tienes serve instalado)
npx serve .

# Opción 3: Con Live Server (extensión de VS Code)
# Instala la extensión "Live Server" y haz clic derecho en index.html > "Open with Live Server"
```

### Actualizar el sitio
```bash
# Después de hacer cambios
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

## Estructura de archivos para GitHub Pages

```
project-scope/
├── index.html          # Página principal
├── app.js             # Lógica principal
├── app-extensions.js  # Funciones adicionales
├── package.json       # Configuración del proyecto
├── README.md          # Documentación
└── .gitignore         # Archivos a ignorar (opcional)
```

## Notas importantes

- **HTTPS**: GitHub Pages sirve automáticamente con HTTPS
- **Dominio personalizado**: Puedes configurar un dominio personalizado en Settings > Pages
- **Actualizaciones**: Los cambios se reflejan automáticamente al hacer push
- **Historial**: GitHub mantiene un historial de todos los despliegues

## Solución de problemas comunes

### El sitio no carga
- Verifica que el archivo se llame exactamente `index.html`
- Asegúrate de que el repositorio sea público
- Espera unos minutos para que GitHub procese el despliegue

### Los cambios no se reflejan
- Verifica que hayas hecho push de los cambios
- Espera unos minutos para que GitHub actualice
- Limpia la caché del navegador (Ctrl+F5)

### Errores de JavaScript
- Abre las herramientas de desarrollador (F12)
- Revisa la consola para errores
- Verifica que todos los archivos JS estén incluidos correctamente

## Personalización adicional

### Cambiar el nombre del repositorio
Si quieres cambiar el nombre del repositorio:
1. Ve a Settings > Repository name
2. Cambia el nombre
3. Actualiza la URL en tu navegador

### Configurar un dominio personalizado
1. Compra un dominio
2. En Settings > Pages > Custom domain
3. Agrega tu dominio
4. Configura los DNS según las instrucciones de GitHub

¡Tu aplicación Project Scope estará disponible en línea para que cualquiera pueda usarla!
