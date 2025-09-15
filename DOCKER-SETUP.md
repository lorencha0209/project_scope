# Project Scope - Docker Configuration

## 🐳 **Docker Setup (Opcional)**

Si prefieres usar Docker para el desarrollo, aquí tienes la configuración:

### **1. Dockerfile para el Backend**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### **2. docker-compose.yml**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: project-scope-mysql
    environment:
      MYSQL_ROOT_PASSWORD: password123
      MYSQL_DATABASE: project_scope
      MYSQL_USER: projectscope
      MYSQL_PASSWORD: password123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/database-schema.sql:/docker-entrypoint-initdb.d/init.sql
    command: --default-authentication-plugin=mysql_native_password

  backend:
    build: .
    container_name: project-scope-backend
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: projectscope
      DB_PASSWORD: password123
      DB_NAME: project_scope
      PORT: 3000
      NODE_ENV: production
      CORS_ORIGIN: http://localhost:8080
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  mysql_data:
```

### **3. Comandos Docker**

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### **4. Configuración de Desarrollo con Docker**

```bash
# Crear archivo .env para Docker
cat > .env << EOF
DB_HOST=mysql
DB_PORT=3306
DB_USER=projectscope
DB_PASSWORD=password123
DB_NAME=project_scope
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
EOF

# Iniciar servicios
docker-compose up --build
```

### **5. Ventajas de Docker**

- ✅ **Entorno consistente**: Mismo entorno en desarrollo y producción
- ✅ **Fácil configuración**: Un solo comando para iniciar todo
- ✅ **Aislamiento**: No interfiere con tu MySQL local
- ✅ **Escalabilidad**: Fácil de escalar horizontalmente
- ✅ **Portabilidad**: Funciona en cualquier sistema con Docker

### **6. Notas Importantes**

- El frontend sigue siendo estático (HTML/CSS/JS)
- Solo el backend y MySQL están en Docker
- Los datos persisten en el volumen `mysql_data`
- El puerto 3000 se mapea al host para acceso externo
- El esquema de base de datos se inicializa automáticamente

### **7. Acceso a la Aplicación**

Con Docker ejecutándose:
- **Frontend**: Abre `index.html` en tu navegador
- **API**: http://localhost:3000/api/health
- **Base de datos**: localhost:3306 (usuario: projectscope, password: password123)
