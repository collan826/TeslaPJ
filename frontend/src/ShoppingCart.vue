<template>
  <div class="shopping-cart-wrapper">
    <!-- 购物车图标 -->
    <button 
      class="cart-icon-button" 
      @click="toggleCart"
      :class="{ 'has-items': cartItems.length > 0 }"
    >
      🛒
      <span v-if="cartItems.length > 0" class="cart-badge">{{ cartItems.length }}</span>
    </button>

    <!-- 购物车面板 -->
    <div v-if="showCart" class="cart-panel">
      <div class="cart-header">
        <h3>🛒 购物车</h3>
        <button @click="toggleCart" class="close-button">✕</button>
      </div>

      <div v-if="cartItems.length === 0" class="cart-empty">
        <p>购物车是空的</p>
        <p>快去选购商品吧！</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <img :src="getProductImage(index)" :alt="item.name" class="cart-item-image" />
          <div class="cart-item-info">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-price">¥{{ item.price.toFixed(2) }}</div>
          </div>
          <div class="cart-item-quantity">
            <button @click="decreaseQuantity(index)" class="quantity-button">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button @click="increaseQuantity(index)" class="quantity-button">+</button>
          </div>
          <button @click="removeFromCart(index)" class="remove-button">🗑️</button>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>总计：</span>
          <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="checkout" class="checkout-button">🛒 去结算</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ShoppingCart',
  props: {
    cartItems: {
      type: Array,
      required: true
    },
    getProductImage: {
      type: Function,
      required: true
    }
  },
  emits: ['toggle-cart', 'remove-item', 'update-quantity', 'checkout'],
  setup(props, { emit }) {
    const showCart = ref(false)

    const totalPrice = computed(() => {
      return props.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    const toggleCart = () => {
      showCart.value = !showCart.value
      emit('toggle-cart', showCart.value)
    }

    const removeFromCart = (index) => {
      emit('remove-item', index)
    }

    const increaseQuantity = (index) => {
      emit('update-quantity', { index, change: 1 })
    }

    const decreaseQuantity = (index) => {
      emit('update-quantity', { index, change: -1 })
    }

    const checkout = () => {
      emit('checkout')
      showCart.value = false
    }

    return {
      showCart,
      totalPrice,
      toggleCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      checkout
    }
  }
}
</script>

<style scoped>
.shopping-cart-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.cart-icon-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.cart-icon-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.5);
}

.cart-icon-button.has-items {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(147, 51, 234, 0.7);
  }
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.cart-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
}

.cart-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cart-empty {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.cart-empty p {
  margin: 10px 0;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.cart-item:hover {
  background: #f9f9f9;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.cart-item-price {
  font-size: 14px;
  color: #9333ea;
  font-weight: bold;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-button {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.quantity-button:hover {
  background: #9333ea;
  color: white;
  border-color: #9333ea;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.remove-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.remove-button:hover {
  background: #fee;
}

.cart-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
}

.total-price {
  font-size: 22px;
  font-weight: bold;
  color: #9333ea;
}

.checkout-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.checkout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
}
</style>
