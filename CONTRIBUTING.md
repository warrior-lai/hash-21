# Contribuir a Hash21

¡Gracias por tu interés en contribuir! 🧡

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar
git clone https://github.com/warrior-lai/hash-21.git
cd hash-21

# Instalar dependencias
npm install

# Correr tests
npm test

# Levantar dev server
npm run dev
```

### Variables de entorno

Copiá `.env.example` a `.env` y completá:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
HASH21_NOSTR_NSEC=nsec1...
```

## 🧪 Testing

```bash
npm test              # Correr todos los tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Estructura de Tests

```
/tests
  /api              # Tests de endpoints
  /helpers          # Tests de utilidades
```

## 📝 Pull Requests

1. Fork el repo
2. Creá tu branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Abrí un Pull Request

## 📚 Documentación

- [docs/architecture.md](docs/architecture.md) — Arquitectura
- [docs/api.md](docs/api.md) — Referencia de API
- [docs/security.md](docs/security.md) — Seguridad
- [docs/deployment.md](docs/deployment.md) — Deploy

## 💬 Contacto

¿Preguntas? Abrí un issue o contactá a [@warrior-lai](https://github.com/warrior-lai).
