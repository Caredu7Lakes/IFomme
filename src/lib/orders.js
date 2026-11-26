// Lógica de domínio pura, sem React — testável isoladamente.

export function mapDish(d) {
  return {
    ...d,
    id: d.id,
    ingredients: d.ingredients || '',
    description: d.description || '',
    price: Number(d.price),
    photo: d.photo_url || '',
    available: d.available_today,
  };
}

export function mapOrder(o) {
  return {
    ...o,
    id: o.id,
    number: o.order_number,
    customer_name: o.customer_name,
    phone: o.customer_phone,
    address: o.address,
    payment: o.payment,
    notes: o.notes,
    status: o.status,
    total: Number(o.total),
    created_at: o.created_at,
    items: (o.order_items || []).map((i) => ({
      name: i.dish_name,
      price: Number(i.unit_price),
      quantity: i.quantity,
    })),
  };
}

export function calculateOrderTotal(items) {
  return (items || []).reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0,
  );
}