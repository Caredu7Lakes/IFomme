import { describe, it, expect } from 'vitest';
import { mapDish, mapOrder, calculateOrderTotal } from './orders.js';

describe('calculateOrderTotal', () => {
  it('soma preço × quantidade de cada item', () => {
    expect(calculateOrderTotal([
      { price: 24.9, quantity: 2 },
      { price: 21.9, quantity: 1 },
    ])).toBeCloseTo(71.7, 2);
  });
  it('retorna 0 para carrinho vazio ou indefinido', () => {
    expect(calculateOrderTotal([])).toBe(0);
    expect(calculateOrderTotal(undefined)).toBe(0);
  });
  it('trata valores em string vindos do formulário', () => {
    expect(calculateOrderTotal([{ price: '10.00', quantity: '3' }])).toBe(30);
  });
});

describe('mapDish', () => {
  it('mapeia colunas do banco e converte o preço em número', () => {
    const dish = mapDish({
      id: 'd1', name: 'Feijoada', ingredients: null, description: null,
      price: '24.90', photo_url: 'http://x/y.jpg', available_today: true,
    });
    expect(dish).toMatchObject({
      id: 'd1', name: 'Feijoada', ingredients: '', description: '',
      photo: 'http://x/y.jpg', available: true,
    });
    expect(dish.price).toBe(24.9);
  });
});

describe('mapOrder', () => {
  it('mapeia o pedido e seus itens, convertendo valores monetários', () => {
    const order = mapOrder({
      id: 'o1', order_number: 101, customer_name: 'Maria',
      customer_phone: '(74) 99911-2233', address: 'Rua 1', payment: 'Pix na entrega',
      notes: '', status: 'recebido', total: '49.80', created_at: '2026-11-26T11:42:00',
      order_items: [{ dish_name: 'Feijoada', unit_price: '24.90', quantity: 2 }],
    });
    expect(order).toMatchObject({ number: 101, customer_name: 'Maria', status: 'recebido' });
    expect(order.total).toBe(49.8);
    expect(order.items).toEqual([{ name: 'Feijoada', price: 24.9, quantity: 2 }]);
  });
});