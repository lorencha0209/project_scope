# Project Scope - Configuración para Hostinger + GitHub Pages

## 🎯 **Arquitectura de Despliegue**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │   Hostinger     │    │   Tu Computadora │
│   (Frontend)    │◄──►│   (MySQL DB)    │◄──►│   (Desarrollo)  │
│   index.html    │    │   Base de datos │    │   Backend API   │
│   CSS/JS        │    │   Remota        │    │   Local/Server  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚠️ **Consideraciones Importantes**

### **GitHub Pages Limitaciones**
- ✅ **Sí puede**: Servir archivos estáticos (HTML, CSS, JS)
- ❌ **No puede**: Ejecutar servidores Node.js
- ❌ **No puede**: Procesar requests del backend

### **Solución Recomendada**
- **Frontend**: GitHub Pages (gratis)
- **Backend**: Hostinger (con Node.js)
- **Base de datos**: Hostinger MySQL

## 🚀 **Configuración Paso a Paso**

### **Paso 1: Configurar Hostinger**

#### **1.1 Crear Base de Datos MySQL**
1. Accede al panel de Hostinger
2. Ve a "Bases de datos MySQL"
3. Crea una nueva base de datos:
   - **Nombre**: `project_scope`
   - **Usuario**: `tu_usuario_db`
   - **Contraseña**: `tu_password_db`
   - **Host**: `localhost` (o el que te proporcione Hostinger)
   - **Puerto**: `3306`

#### **1.2 Configurar Hosting para Node.js**
1. Ve a "Hosting" en Hostinger
2. Crea un subdominio (ej: `api.tudominio.com`)
3. Habilita Node.js en el hosting
4. Sube tu código del backend

### **Paso 2: Configurar GitHub Pages**

#### **2.1 Preparar Frontend para GitHub Pages**
1. Crea un repositorio en GitHub
2. Sube solo los archivos del frontend:
   - `index.html`
   - `app.js`
   - `app-extensions.js`
   - `api-client-production.js` (renombrado)
   - `demo-data.js`
   - Archivos CSS (si los hay)

#### **2.2 Habilitar GitHub Pages**
1. Ve a Settings → Pages
2. Selecciona "Deploy from a branch"
3. Elige "main" branch
4. Tu sitio estará disponible en: `https://tuusuario.github.io/turepositorio`

### **Paso 3: Configurar la Aplicación**

#### **3.1 Actualizar Frontend para Producción**

**Archivo `api-client-production.js`:**
```javascript
class ProjectScopeAPI {
    constructor() {
        // Cambiar por tu URL de Hostinger
        this.baseURL = 'https://api.tudominio.com/api';
        // ... resto del código igual
    }
}
```

**Archivo `index.html`:**
```html
<!-- Cambiar la referencia al cliente API -->
<script src="api-client-production.js"></script>
```

#### **3.2 Configurar Backend para Hostinger**

**Archivo `.env` para producción:**
```env
# Database Configuration (Hostinger)
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_NAME=project_scope

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration (GitHub Pages)
CORS_ORIGIN=https://tuusuario.github.io

# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRY=24h
```

## 📁 **Estructura de Archivos**

### **Para GitHub Pages (Frontend)**
```
github-pages/
├── index.html
├── app.js
├── app-extensions.js
├── api-client-production.js
├── demo-data.js
└── README.md
```

### **Para Hostinger (Backend)**
```
hostinger-backend/
├── server.js
├── package.json
├── .env
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── tasks.js
│   ├── sprints.js
│   ├── risks.js
│   ├── minutes.js
│   └── columns.js
└── scripts/
    ├── database-schema.sql
    └── init-database.js
```

## 🔧 **Comandos de Despliegue**

### **Para GitHub Pages**
```bash
# 1. Crear repositorio en GitHub
# 2. Clonar repositorio
git clone https://github.com/tuusuario/turepositorio.git
cd turepositorio

# 3. Copiar archivos del frontend
cp ../Project_Scope/index.html .
cp ../Project_Scope/app.js .
cp ../Project_Scope/app-extensions.js .
cp ../Project_Scope/api-client-production.js .
cp ../Project_Scope/demo-data.js .

# 4. Actualizar index.html para usar api-client-production.js
# 5. Subir a GitHub
git add .
git commit -m "Initial frontend deployment"
git push origin main
```

### **Para Hostinger**
```bash
# 1. Preparar archivos del backend
mkdir hostinger-backend
cd hostinger-backend

# 2. Copiar archivos del backend
cp ../Project_Scope/server.js .
cp ../Project_Scope/package.json .
cp ../Project_Scope/.env .
cp -r ../Project_Scope/config .
cp -r ../Project_Scope/middleware .
cp -r ../Project_Scope/routes .
cp -r ../Project_Scope/scripts .

# 3. Actualizar .env con credenciales de Hostinger
# 4. Subir a Hostinger via FTP/SFTP
```

## 🌐 **URLs de Ejemplo**

### **Frontend (GitHub Pages)**
```
https://tuusuario.github.io/project-scope
```

### **Backend (Hostinger)**
```
https://api.tudominio.com
```

### **Base de Datos (Hostinger)**
```
Host: localhost (o el que te proporcione Hostinger)
Puerto: 3306
Usuario: tu_usuario_db
Contraseña: tu_password_db
Base de datos: project_scope
```

## 🔒 **Configuración de Seguridad**

### **CORS Configuration**
```javascript
// En server.js
app.use(cors({
    origin: 'https://tuusuario.github.io', // Tu GitHub Pages URL
    credentials: true
}));
```

### **Variables de Entorno**
```env
# Producción
NODE_ENV=production
CORS_ORIGIN=https://tuusuario.github.io
JWT_SECRET=clave_super_secreta_para_produccion
```

## 📊 **Flujo de Datos**

1. **Usuario accede**: `https://tuusuario.github.io/project-scope`
2. **Frontend carga**: HTML, CSS, JS desde GitHub Pages
3. **API calls**: Van a `https://api.tudominio.com/api`
4. **Backend procesa**: Requests en Hostinger
5. **Base de datos**: MySQL en Hostinger
6. **Respuesta**: Vuelve al frontend en GitHub Pages

## ✅ **Ventajas de esta Configuración**

- **Costo**: GitHub Pages es gratis
- **Rendimiento**: CDN global de GitHub
- **Escalabilidad**: Hostinger puede manejar tráfico
- **Seguridad**: Base de datos en servidor dedicado
- **Mantenimiento**: Separación clara de responsabilidades

## ⚠️ **Consideraciones**

- **CORS**: Debe estar configurado correctamente
- **HTTPS**: Ambos servicios deben usar HTTPS
- **Dominio**: Puedes usar un dominio personalizado
- **Backup**: Configurar backups de la base de datos

## 🚀 **Próximos Pasos**

1. **Configurar Hostinger**: Base de datos y hosting
2. **Preparar frontend**: Para GitHub Pages
3. **Preparar backend**: Para Hostinger
4. **Desplegar**: Ambos servicios
5. **Probar**: Funcionamiento completo

¿Te gustaría que te ayude con algún paso específico de la configuración?
