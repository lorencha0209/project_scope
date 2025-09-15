# Project Scope - Backend para Hostinger

## 📁 **Archivos para Hostinger**

Este directorio contiene todos los archivos del backend que se subirán a Hostinger.

### **Archivos incluidos:**
- `server.js` - Servidor principal
- `package.json` - Dependencias
- `env.example` - Variables de entorno (renombrar a .env)
- `config/` - Configuración de base de datos
- `middleware/` - Middleware de autenticación
- `routes/` - Rutas de la API
- `scripts/` - Scripts de base de datos

### **Configuración necesaria:**

1. **Renombrar archivo de entorno**:
```bash
mv env.example .env
```

2. **Editar `.env` con credenciales de Hostinger**:
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

3. **Instalar dependencias**:
```bash
npm install
```

4. **Inicializar base de datos**:
```bash
npm run init-db
```

5. **Iniciar servidor**:
```bash
npm start
```

### **Despliegue en Hostinger:**

1. **Crear base de datos MySQL** en el panel de Hostinger
2. **Configurar hosting** para Node.js
3. **Subir archivos** via FTP/SFTP
4. **Configurar variables de entorno**
5. **Instalar dependencias** en el servidor
6. **Inicializar base de datos**
7. **Iniciar aplicación**

### **URLs de ejemplo:**
- **API**: `https://api.tudominio.com`
- **Health check**: `https://api.tudominio.com/api/health`
- **Login**: `https://api.tudominio.com/api/auth/login`

### **Nota importante:**
Este backend se conectará a tu base de datos MySQL en Hostinger y servirá a tu frontend en GitHub Pages.
