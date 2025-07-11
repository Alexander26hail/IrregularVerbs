# Dockerfile
# Usar nginx con Alpine Linux (muy ligero y seguro)
FROM nginx:alpine

# Copiar nuestro archivo HTML al directorio que sirve nginx
COPY src/ /usr/share/nginx/html/

# Copiar configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80 (puerto estándar HTTP)
EXPOSE 80

# nginx se inicia automáticamente con la imagen base
# No necesitamos CMD porque nginx:alpine ya lo tiene configurado