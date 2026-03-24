# Contributing to Hash21

Thanks for your interest in contributing to Hash21! 🪓

## How to contribute

1. **Fork** the repo
2. **Clone** your fork: `git clone https://github.com/YOUR-USER/hash-21.git`
3. **Create a branch**: `git checkout -b feature/your-feature`
4. **Make changes** and test locally
5. **Run tests**: `./test.sh`
6. **Commit**: `git commit -m "feat: description"`
7. **Push**: `git push origin feature/your-feature`
8. **Open a PR** against `main`

## Development

```bash
# Frontend
python3 -m http.server 8000
# Open http://localhost:8000

# Backend
cd Hash21-Backend
npm install
vercel dev
```

## Commit convention

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `test:` — tests
- `refactor:` — code refactoring

## Testing

```bash
# Frontend (28 tests)
./test.sh

# Backend (19+ tests)
cd Hash21-Backend && ./test.sh
```

All tests must pass before merging.

## Code style

- Vanilla JS (no frameworks)
- Keep it simple
- Functions should do one thing
- Comment why, not what

## Need help?

Open an issue or reach out on [Telegram](https://t.me/abstract_lai).

---

MIT License — Build freely ⚡
