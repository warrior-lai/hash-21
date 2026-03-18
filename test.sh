#!/bin/bash
# Hash21 — Automated Test Suite
# Run: ./test.sh

PASS=0
FAIL=0
API="https://hash21-backend.vercel.app"
SITE="https://hash21.studio"

pass() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }
check() { if [ "$1" = "true" ]; then pass "$2"; else fail "$2"; fi }

echo ""
echo "⚡ Hash21 Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# --- Backend ---
echo "🔧 Backend ($API)"

# Health
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/health")
check "$([ "$HEALTH" = "200" ] && echo true)" "Health endpoint → $HEALTH"

# Zap invoice generation
ZAP=$(curl -s -X POST "$API/api/zap" \
  -H "Content-Type: application/json" \
  -d '{"target":"libertad","amount":21,"message":"test"}' 2>&1)

HAS_INVOICE=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); print('true' if d.get('invoice','').startswith('lnbc') else 'false')" 2>/dev/null)
check "$HAS_INVOICE" "Invoice generation (LNURL-pay → WoS)"

HAS_SIG=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); print('true' if d.get('zapRequest',{}).get('sig') else 'false')" 2>/dev/null)
check "$HAS_SIG" "NIP-57 zap request signed"

CORRECT_KIND=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); print('true' if d.get('zapRequest',{}).get('kind')==9734 else 'false')" 2>/dev/null)
check "$CORRECT_KIND" "Zap request kind = 9734"

HAS_P_TAG=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); tags=d.get('zapRequest',{}).get('tags',[]); p=[t for t in tags if t[0]=='p']; print('true' if p else 'false')" 2>/dev/null)
check "$HAS_P_TAG" "Zap request has p tag (recipient)"

HAS_RELAYS=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); tags=d.get('zapRequest',{}).get('tags',[]); r=[t for t in tags if t[0]=='relays']; print('true' if r and len(r[0])>1 else 'false')" 2>/dev/null)
check "$HAS_RELAYS" "Zap request has relays tag"

LN_ADDR=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); print('true' if 'walletofsatoshi' in d.get('lnAddress','') else 'false')" 2>/dev/null)
check "$LN_ADDR" "Lightning Address → Wallet of Satoshi"

# Check endpoint (unpaid invoice should return false)
ZRID=$(echo "$ZAP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('zapRequest',{}).get('id',''))" 2>/dev/null)
RPUB=$(echo "$ZAP" | python3 -c "import json,sys; d=json.load(sys.stdin); tags=d.get('zapRequest',{}).get('tags',[]); p=[t[1] for t in tags if t[0]=='p']; print(p[0] if p else '')" 2>/dev/null)
CHECK=$(curl -s "$API/api/check?zapRequestId=$ZRID&recipientPubkey=$RPUB&since=$(date +%s)" 2>&1)
NOT_PAID=$(echo "$CHECK" | python3 -c "import json,sys; d=json.load(sys.stdin); print('true' if d.get('paid')==False else 'false')" 2>/dev/null)
check "$NOT_PAID" "Check endpoint → paid:false for unpaid invoice"

echo ""

# --- Frontend ---
echo "🌐 Frontend ($SITE)"

PAGES=("/" "/shop/" "/verify/" "/blocklab/" "/faq.html" "/terms.html" "/privacy.html" "/certification.html")
for page in "${PAGES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE$page")
  check "$([ "$CODE" = "200" ] && echo true)" "Page $page → $CODE"
done

echo ""

# --- Assets ---
echo "📦 Assets"

ASSETS=("style.css" "app.js" "zap.js" "lang.js")
for asset in "${ASSETS[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/$asset")
  check "$([ "$CODE" = "200" ] && echo true)" "$asset → $CODE"
done

IMAGES=("img/obra1.jpg" "img/obra2.jpg" "img/obra3.jpg" "img/obra4.jpg" "img/avatar.jpg" "favicon-32.png")
for img in "${IMAGES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/$img")
  check "$([ "$CODE" = "200" ] && echo true)" "$img → $CODE"
done

echo ""

# --- SSL ---
echo "🔒 SSL"

SSL_VALID=$(curl -s -o /dev/null -w "%{ssl_verify_result}" "$SITE")
check "$([ "$SSL_VALID" = "0" ] && echo true)" "SSL certificate valid"

SSL_BACKEND=$(curl -s -o /dev/null -w "%{ssl_verify_result}" "$API/api/health")
check "$([ "$SSL_BACKEND" = "0" ] && echo true)" "Backend SSL valid"

echo ""

# --- Summary ---
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((PASS+FAIL))
echo "  Total: $TOTAL tests | ✅ $PASS passed | ❌ $FAIL failed"
if [ "$FAIL" -eq 0 ]; then
  echo "  🏆 All tests passed!"
else
  echo "  ⚠️  $FAIL test(s) failed"
fi
echo ""

exit $FAIL
