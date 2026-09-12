#!/bin/bash

set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
TEST_EMAIL="${TEST_EMAIL:?Define TEST_EMAIL para ejecutar el flujo}"
TEST_PASSWORD="${TEST_PASSWORD:?Define TEST_PASSWORD para ejecutar el flujo}"

echo "=== Prueba del Flujo de Compra ==="
echo ""

# 1. Login
echo "1. Haciendo login..."
LOGIN_RESPONSE=$(curl -fsS -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error en login"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "✓ Login exitoso"
echo "  Token: ${TOKEN:0:20}..."
echo ""

# 2. Obtener productos
echo "2. Obteniendo productos..."
PRODUCTS=$(curl -fsS "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN")

PRODUCT_ID=$(echo $PRODUCTS | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
PRODUCT_NAME=$(echo $PRODUCTS | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✓ Productos obtenidos"
echo "  ID: $PRODUCT_ID, Nombre: $PRODUCT_NAME"
echo ""

# 3. Checkout
echo "3. Procesando checkout..."
CHECKOUT_RESPONSE=$(curl -fsS -X POST "$API_URL/checkout" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"cart\":[{\"id\":$PRODUCT_ID,\"name\":\"$PRODUCT_NAME\",\"price\":100,\"quantity\":2}],\"shipping\":{\"address\":\"Calle Falsa 123\",\"city\":\"Santiago\",\"postalCode\":\"8320000\",\"phone\":\"+56912345678\"}}")

ORDER_ID=$(echo $CHECKOUT_RESPONSE | grep -o '"orderId":[0-9]*' | cut -d':' -f2)
TOTAL=$(echo $CHECKOUT_RESPONSE | grep -o '"total":[0-9.]*' | cut -d':' -f2)

if [ -z "$ORDER_ID" ]; then
  echo "❌ Error en checkout"
  echo $CHECKOUT_RESPONSE
  exit 1
fi

echo "✓ Compra realizada!"
echo "  Orden #$ORDER_ID, Total: \$$TOTAL"
echo ""

echo "=== ¡Flujo completado exitosamente! ==="
