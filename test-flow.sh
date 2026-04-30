#!/bin/bash

echo "=== Prueba del Flujo de Compra ==="
echo ""

# 1. Login
echo "1. Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}')

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
PRODUCTS=$(curl -s http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN")

PRODUCT_ID=$(echo $PRODUCTS | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
PRODUCT_NAME=$(echo $PRODUCTS | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✓ Productos obtenidos"
echo "  ID: $PRODUCT_ID, Nombre: $PRODUCT_NAME"
echo ""

# 3. Checkout
echo "3. Procesando checkout..."
CHECKOUT_RESPONSE=$(curl -s -X POST http://localhost:3000/checkout \
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
