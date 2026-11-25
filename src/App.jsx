import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Utensils,
  ClipboardList,
  ChartNoAxesCombined,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
  Bike,
  ChefHat,
  CalendarDays,
  Sparkles,
  X,
  Menu,
  ShoppingBag,
  ArrowLeft,
  CircleCheck,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const slug = import.meta.env.VITE_RESTAURANT_SLUG || "marmitaria-do-raimundo";
const STORE_KEY = "ifoome-demo-v1";
const today = () => new Date().toISOString().slice(0, 10);
const money = (n) =>
  Number(n || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
const sampleDishes = [
  {
    id: "d1",
    name: "Feijoada",
    ingredients: "Feijão preto, carne suína, linguiça, couve e arroz",
    description:
      "Feijoada caseira bem temperada, acompanhada de arroz soltinho e couve refogada.",
    price: 24.9,
    photo: "",
    available: true,
  },
  {
    id: "d2",
    name: "Frango Grelhado",
    ingredients: "Filé de frango, arroz, feijão e salada",
    description:
      "Filé de frango grelhado no ponto, com acompanhamentos fresquinhos.",
    price: 21.9,
    photo: "",
    available: true,
  },
  {
    id: "d3",
    name: "Strogonoff",
    ingredients: "Frango, creme de leite, molho, arroz e batata palha",
    description:
      "Strogonoff cremoso de frango, servido com arroz e batata palha crocante.",
    price: 23.9,
    photo: "",
    available: false,
  },
  {
    id: "d4",
    name: "Parmegiana",
    ingredients: "Filé de frango, queijo, molho de tomate e arroz",
    description:
      "Filé empanado com molho de tomate e queijo derretido, uma delícia!",
    price: 26.9,
    photo: "",
    available: true,
  },
];
const seed = () => {
  const date = today();
  return {
    restaurant: {
      id: "rest-demo",
      name: "Marmitaria do Seu Raimundo",
      slug,
      dono_id: "demo",
    },
    dishes: sampleDishes,
    orders: [
      {
        id: "o101",
        number: 101,
        customer_name: "Maria Oliveira",
        phone: "(74) 99911-2233",
        address: "Rua das Flores, 120",
        payment: "Pix na entrega",
        notes: "Pouco sal, por favor.",
        status: "recebido",
        total: 49.8,
        created_at: `${date}T11:42:00`,
        items: [{ name: "Feijoada", price: 24.9, quantity: 2 }],
      },
      {
        id: "o102",
        number: 102,
        customer_name: "João Santos",
        phone: "(74) 99822-3344",
        address: "Av. Central, 45",
        payment: "Dinheiro na entrega",
        notes: "Troco para R$ 100.",
        status: "em_preparo",
        total: 43.8,
        created_at: `${date}T12:05:00`,
        items: [{ name: "Frango Grelhado", price: 21.9, quantity: 2 }],
      },
      {
        id: "o103",
        number: 103,
        customer_name: "Ana Souza",
        phone: "(74) 99733-4455",
        address: "Rua do Comércio, 8",
        payment: "Cartão na maquininha",
        notes: "Entregar na recepção.",
        status: "saiu_para_entrega",
        total: 26.9,
        created_at: `${date}T12:18:00`,
        items: [{ name: "Parmegiana", price: 26.9, quantity: 1 }],
      },
    ],
    nextNumber: 104,
  };
};
function loadLocal() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY));
    if (v) return v;
  } catch {}
  const v = seed();
  localStorage.setItem(STORE_KEY, JSON.stringify(v));
  return v;
}
function saveLocal(v) {
  localStorage.setItem(STORE_KEY, JSON.stringify(v));
}
const statusNames = {
  recebido: "Recebido",
  em_preparo: "Em preparo",
  saiu_para_entrega: "Saiu para entrega",
};
const nextStatus = { recebido: "em_preparo", em_preparo: "saiu_para_entrega" };
const nextLabel = {
  recebido: "Iniciar preparo",
  em_preparo: "Saiu para entrega",
};
const formatTime = (s) =>
  new Date(s).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
const isPublicPath = () => location.pathname.startsWith("/r/");

export default function App() {
  const [data, setData] = useState(loadLocal);
  const [session, setSession] = useState(null);
  const [view, setView] = useState("pedidos");
  const [filter, setFilter] = useState("todos");
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today());
  const [route, setRoute] = useState(location.pathname);
  const publicMode = isPublicPath();
  const [cart, setCart] = useState({});
  const [checkout, setCheckout] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    const onPop = () => setRoute(location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!supabase) saveLocal(data);
  }, [data]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!supabase || !session) return;
    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => refreshSupabase(),
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session]);
  async function refreshSupabase() {
    if (!supabase) return;
    const { data: rest } = await supabase
      .from("restaurants")
      .select("*")
      .limit(1)
      .single();
    if (!rest) return;
    const [{ data: dishes }, { data: orders }] = await Promise.all([
      supabase
        .from("dishes")
        .select("*")
        .eq("restaurant_id", rest.id)
        .order("created_at"),
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("restaurant_id", rest.id)
        .order("created_at", { ascending: false }),
    ]);
    setData((old) => ({
      ...old,
      restaurant: rest,
      dishes: (dishes || []).map(mapDish),
      orders: (orders || []).map(mapOrder),
    }));
  }
  useEffect(() => {
    if (supabase && session) refreshSupabase();
  }, [session]);
  useEffect(() => {
    if (!supabase || !publicMode) return;
    let active = true;
    (async () => {
      const { data: rest } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!rest || !active) return;
      const { data: dishes } = await supabase
        .from("dishes")
        .select("*")
        .eq("restaurant_id", rest.id)
        .eq("available_today", true)
        .order("created_at");
      if (active)
        setData((old) => ({
          ...old,
          restaurant: rest,
          dishes: (dishes || []).map(mapDish),
        }));
    })();
    return () => {
      active = false;
    };
  }, [publicMode]);
  const notify = (m) => setToast(m);
  const updateData = (fn) => setData((old) => fn(structuredClone(old)));
  function navigate(path) {
    history.pushState({}, "", path);
    setRoute(path);
    setCart({});
    setCheckout(false);
    setConfirmed(null);
  }
  async function login(email, password) {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) notify("Não foi possível entrar. Confira e-mail e senha.");
      else notify("Bem-vindo!");
    } else if (email.trim() && password.length >= 4) {
      setSession({ user: { email } });
      notify("Modo demonstração: acesso liberado.");
    } else notify("Informe e-mail e senha (mínimo de 4 caracteres).");
  }
  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setView("pedidos");
  }
  async function saveDish(dish) {
    if (
      !dish.name.trim() ||
      !dish.ingredients.trim() ||
      !Number.isFinite(+dish.price) ||
      +dish.price <= 0
    ) {
      notify("Preencha nome, ingredientes e um preço válido.");
      return;
    }
    if (supabase) {
      const payload = {
        restaurant_id: data.restaurant.id,
        name: dish.name,
        ingredients: dish.ingredients,
        description: dish.description,
        price: +dish.price,
        photo_url: dish.photo || null,
        available_today: dish.available,
      };
      const q = dish.id
        ? supabase.from("dishes").update(payload).eq("id", dish.id)
        : supabase.from("dishes").insert(payload);
      const { error } = await q;
      if (error) {
        notify("Erro ao salvar prato.");
        return;
      }
      await refreshSupabase();
    } else
      updateData((d) => {
        const item = {
          ...dish,
          id: dish.id || crypto.randomUUID(),
          price: +dish.price,
        };
        d.dishes = dish.id
          ? d.dishes.map((x) => (x.id === dish.id ? item : x))
          : [item, ...d.dishes];
        return d;
      });
    setShowForm(false);
    setEditing(null);
    notify("Prato salvo!");
  }
  async function deleteDish(id) {
    if (!confirm("Deseja excluir este prato?")) return;
    if (supabase) {
      const { error } = await supabase.from("dishes").delete().eq("id", id);
      if (error) {
        notify("Não foi possível excluir.");
        return;
      }
      await refreshSupabase();
    } else
      updateData((d) => ({
        ...d,
        dishes: d.dishes.filter((x) => x.id !== id),
      }));
    notify("Prato excluído.");
  }
  async function toggleDish(dish) {
    const next = { ...dish, available: !dish.available };
    if (supabase) {
      const { error } = await supabase
        .from("dishes")
        .update({ available_today: next.available })
        .eq("id", dish.id);
      if (error) {
        notify("Não foi possível atualizar.");
        return;
      }
      await refreshSupabase();
    } else
      updateData((d) => ({
        ...d,
        dishes: d.dishes.map((x) => (x.id === dish.id ? next : x)),
      }));
    notify(
      next.available ? "Prato disponível hoje!" : "Prato indisponível hoje.",
    );
  }
  async function advanceOrder(order) {
    const status = nextStatus[order.status];
    if (!status) return;
    if (supabase) {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order.id);
      if (error) {
        notify("Não foi possível atualizar o pedido.");
        return;
      }
      await refreshSupabase();
    } else
      updateData((d) => ({
        ...d,
        orders: d.orders.map((o) => (o.id === order.id ? { ...o, status } : o)),
      }));
    notify(
      status === "em_preparo"
        ? "Pedido em preparo!"
        : "Pedido saiu para entrega!",
    );
  }
  async function placeOrder(form) {
    const items = data.dishes
      .filter((d) => d.available && cart[d.id] > 0)
      .map((d) => ({
        dish_id: d.id,
        name: d.name,
        price: +d.price,
        quantity: cart[d.id],
      }));
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    if (
      !items.length ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      form.phone.replace(/\D/g, "").length < 10
    ) {
      notify("Confira os itens e preencha nome, telefone e endereço.");
      return;
    }
    let created;
    if (supabase) {
      const { data: inserted, error } = await supabase.rpc(
        "create_public_order",
        {
          p_restaurant_slug: slug,
          p_customer_name: form.name,
          p_customer_phone: form.phone,
          p_address: form.address,
          p_payment: form.payment,
          p_notes: form.notes || "",
          p_items: items.map((i) => ({
            dish_id: i.dish_id,
            quantity: i.quantity,
          })),
        },
      );
      if (error) {
        notify("Não foi possível enviar o pedido. Tente novamente.");
        return;
      }
      created = { number: inserted };
    } else {
      created = {
        id: crypto.randomUUID(),
        number: data.nextNumber,
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        payment: form.payment,
        notes: form.notes,
        status: "recebido",
        total,
        created_at: new Date().toISOString(),
        items,
      };
      updateData((d) => ({
        ...d,
        nextNumber: d.nextNumber + 1,
        orders: [created, ...d.orders],
      }));
    }
    setConfirmed(created.number);
    setCheckout(false);
    setCart({});
  }
  const publicDishes = data.dishes.filter((d) => d.available);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = data.dishes.reduce(
    (s, d) => s + (cart[d.id] || 0) * d.price,
    0,
  );
  const todaysOrders = data.orders.filter(
    (o) => o.created_at?.slice(0, 10) === selectedDate,
  );
  const sales = todaysOrders.reduce((s, o) => s + Number(o.total), 0);
  const orderGroups = ["recebido", "em_preparo", "saiu_para_entrega"];
  if (publicMode)
    return (
      <PublicPage
        data={data}
        dishes={publicDishes}
        cart={cart}
        setCart={setCart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        checkout={checkout}
        setCheckout={setCheckout}
        confirmed={confirmed}
        placeOrder={placeOrder}
        notify={notify}
        navigate={navigate}
      />
    );
  if (!session) return <Login onLogin={login} demo={!supabase} />;
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="icon-btn mobile-only"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Abrir menu"
        >
          <Menu />
        </button>
        <div className="brand">
          <span className="brand-mark">
            <Utensils size={21} />
          </span>
          <span>
            iFoome <small>DELIVERY</small>
          </span>
        </div>
        <div className="top-right">
          <span className="restaurant-name">{data.restaurant.name}</span>
          <button className="icon-btn" onClick={logout} title="Sair">
            <LogOut size={19} />
          </button>
        </div>
      </header>
      <div className="dashboard">
        <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
          <div className="side-label">MENU PRINCIPAL</div>
          <NavButton
            active={view === "pedidos"}
            icon={<ClipboardList />}
            onClick={() => {
              setView("pedidos");
              setMobileMenu(false);
            }}
          >
            Pedidos
          </NavButton>
          <NavButton
            active={view === "cardapio"}
            icon={<Utensils />}
            onClick={() => {
              setView("cardapio");
              setMobileMenu(false);
            }}
          >
            Meu cardápio
          </NavButton>
          <NavButton
            active={view === "resumo"}
            icon={<ChartNoAxesCombined />}
            onClick={() => {
              setView("resumo");
              setMobileMenu(false);
            }}
          >
            Resumo do dia
          </NavButton>
          <div className="side-help">
            <ChefHat size={22} />
            <b>Bom trabalho!</b>
            <span>Organize seus pedidos com tranquilidade.</span>
          </div>
        </aside>
        <main className="main-content">
          {view === "pedidos" && (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">ACOMPANHAMENTO</p>
                  <h1>Pedidos</h1>
                  <p className="muted">
                    Acompanhe e atualize os pedidos do restaurante.
                  </p>
                </div>
                <span className="live-pill">
                  <i /> Atualização automática
                </span>
              </div>
              <div className="filter-row">
                {["todos", ...orderGroups].map((s) => (
                  <button
                    key={s}
                    className={`filter-chip ${filter === s ? "selected" : ""}`}
                    onClick={() => setFilter(s)}
                  >
                    {s === "todos" ? "Todos" : statusNames[s]}{" "}
                    <span>
                      {s === "todos"
                        ? data.orders.length
                        : data.orders.filter((o) => o.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="orders-list">
                {data.orders
                  .filter((o) => filter === "todos" || o.status === filter)
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at),
                  )
                  .map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      onAdvance={() => advanceOrder(o)}
                    />
                  ))}
                {!data.orders.length && (
                  <Empty text="Nenhum pedido por enquanto." />
                )}
              </div>
            </>
          )}
          {view === "cardapio" && (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">SEUS PRODUTOS</p>
                  <h1>Meu cardápio</h1>
                  <p className="muted">
                    Ative ou desative os pratos que você oferece hoje.
                  </p>
                </div>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setEditing(null);
                    setShowForm(true);
                  }}
                >
                  <Plus size={19} /> Adicionar prato
                </button>
              </div>
              <div className="share-banner">
                <div>
                  <b>Seu cardápio está pronto para compartilhar</b>
                  <span>
                    Envie o link aos seus clientes para receber pedidos.
                  </span>
                </div>
                <button
                  className="outline-btn"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(
                        `${location.origin}/r/${data.restaurant.slug}`,
                      )
                      .then(() => notify("Link do cardápio copiado!"))
                      .catch(() =>
                        notify(`${location.origin}/r/${data.restaurant.slug}`),
                      );
                  }}
                >
                  <Copy size={17} /> Copiar link do cardápio
                </button>
              </div>
              <div className="dish-grid">
                {data.dishes.map((d) => (
                  <div className="dish-card" key={d.id}>
                    <div className="dish-visual">
                      {d.photo ? (
                        <img src={d.photo} alt={d.name} />
                      ) : (
                        <span>🍲</span>
                      )}
                      <span
                        className={`availability ${d.available ? "on" : "off"}`}
                      >
                        {d.available ? "Disponível" : "Indisponível"}
                      </span>
                    </div>
                    <div className="dish-info">
                      <div className="dish-title">
                        <h3>{d.name}</h3>
                        <b>{money(d.price)}</b>
                      </div>
                      <p>{d.description || d.ingredients}</p>
                      <div className="dish-actions">
                        <label className="switch-label">
                          <input
                            type="checkbox"
                            checked={d.available}
                            onChange={() => toggleDish(d)}
                          />
                          <span className="switch" />
                          <small>Disponível hoje</small>
                        </label>
                        <div>
                          <button
                            className="icon-btn"
                            title="Editar"
                            onClick={() => {
                              setEditing(d);
                              setShowForm(true);
                            }}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Excluir"
                            onClick={() => deleteDish(d.id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {view === "resumo" && (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">RESULTADOS</p>
                  <h1>Resumo de vendas</h1>
                  <p className="muted">
                    Veja como foi o movimento do restaurante.
                  </p>
                </div>
              </div>
              <div className="date-filter">
                <CalendarDays size={19} />
                <label htmlFor="summary-date">Data:</label>
                <input
                  id="summary-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="stats-grid">
                <Stat
                  icon={<ShoppingBag />}
                  label="Quantidade de pedidos"
                  value={todaysOrders.length}
                />
                <Stat
                  icon={<ChartNoAxesCombined />}
                  label="Total vendido"
                  value={money(sales)}
                />
              </div>
              <section className="panel">
                <h2>Pedidos do dia</h2>
                {todaysOrders.length ? (
                  todaysOrders.map((o) => (
                    <div className="summary-row" key={o.id}>
                      <div>
                        <b>Pedido #{o.number}</b>
                        <span>
                          {o.customer_name} · {formatTime(o.created_at)}
                        </span>
                      </div>
                      <strong>{money(o.total)}</strong>
                    </div>
                  ))
                ) : (
                  <Empty text="Nenhum pedido nesta data." />
                )}
              </section>
            </>
          )}
        </main>
      </div>
      {showForm && (
        <DishModal
          dish={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={saveDish}
          notify={notify}
        />
      )}
      {toast && (
        <div className="toast">
          <CircleCheck size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
function mapDish(d) {
  return {
    ...d,
    id: d.id,
    ingredients: d.ingredients || "",
    description: d.description || "",
    price: Number(d.price),
    photo: d.photo_url || "",
    available: d.available_today,
  };
}
function mapOrder(o) {
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
function NavButton({ active, icon, children, onClick }) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      {children}
      <ChevronRight size={16} />
    </button>
  );
}
function Login({ onLogin, demo }) {
  const [email, setEmail] = useState("raimundo@ifoome.com");
  const [password, setPassword] = useState("123456");
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="brand-mark">
            <Utensils />
          </span>
          <span>
            iFoome <small>DELIVERY</small>
          </span>
        </div>
        <div className="login-illustration">🍛</div>
        <h1>Que bom ter você aqui!</h1>
        <p>Entre para organizar seus pedidos e seu cardápio.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(email, password);
          }}
        >
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Sua senha"
          />
          <button className="primary-btn full">Entrar</button>
        </form>
        {demo && (
          <div className="demo-note">
            Modo demonstração: use os dados preenchidos ou qualquer e-mail e
            senha com 4 caracteres ou mais.
          </div>
        )}
      </div>
    </div>
  );
}
function OrderCard({ order, onAdvance }) {
  return (
    <article className="order-card">
      <div className="order-top">
        <div>
          <span className="order-number">Pedido #{order.number}</span>
          <span className="order-time">
            <Clock size={14} />
            {formatTime(order.created_at)}
          </span>
        </div>
        <span className={`status-badge ${order.status}`}>
          {statusNames[order.status]}
        </span>
      </div>
      <div className="customer-line">
        <div className="avatar">{order.customer_name?.[0] || "C"}</div>
        <div>
          <b>{order.customer_name}</b>
          <span>
            <Phone size={13} />
            {order.phone}
          </span>
        </div>
      </div>
      <div className="order-detail">
        <MapPin size={16} />
        <span>{order.address}</span>
      </div>
      <div className="order-items">
        {(order.items || []).map((i, n) => (
          <div key={n}>
            <span>
              {i.quantity}x {i.name}
            </span>
            <b>{money(i.price * i.quantity)}</b>
          </div>
        ))}
      </div>
      <div className="order-meta">
        <span>Pagamento</span>
        <b>{order.payment}</b>
      </div>
      {order.notes && (
        <div className="notes">
          <b>Observações:</b> {order.notes}
        </div>
      )}
      <div className="order-bottom">
        <div>
          <span>Total do pedido</span>
          <strong>{money(order.total)}</strong>
        </div>
        {nextStatus[order.status] && (
          <button className="primary-btn" onClick={onAdvance}>
            {nextLabel[order.status]} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </article>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Empty({ text }) {
  return (
    <div className="empty-state">
      🍽️<b>{text}</b>
    </div>
  );
}
function DishModal({ dish, onClose, onSave, notify }) {
  const [form, setForm] = useState(
    dish || {
      name: "",
      ingredients: "",
      description: "",
      price: "",
      photo: "",
      available: true,
    },
  );
  const [generating, setGenerating] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  async function generate() {
    if (!form.name.trim() || !form.ingredients.trim()) {
      notify("Informe o nome e os ingredientes primeiro.");
      return;
    }
    setGenerating(true);
    try {
      const response = await fetch("/api/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          ingredients: form.ingredients,
        }),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      set("description", (result.description || "").slice(0, 300));
      if (!result.description) throw new Error();
      notify("Descrição gerada! Você pode editar antes de salvar.");
    } catch {
      const fallback = `${form.name}, preparado com ${form.ingredients.toLowerCase()}. Uma opção saborosa e feita com carinho para sua refeição!`;
      set("description", fallback);
      notify("Sugestão criada localmente. Revise e edite antes de salvar.");
    } finally {
      setGenerating(false);
    }
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">CARDÁPIO</p>
            <h2>{dish ? "Editar prato" : "Adicionar prato"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <label>Nome do prato *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            placeholder="Ex.: Frango grelhado"
          />
          <label>Ingredientes *</label>
          <textarea
            value={form.ingredients}
            onChange={(e) => set("ingredients", e.target.value)}
            required
            rows="2"
            placeholder="Ex.: frango, arroz, feijão e salada"
          />
          <label>Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows="3"
            maxLength="300"
            placeholder="Conte um pouco sobre o prato..."
          />
          <button
            type="button"
            className="ai-btn"
            onClick={generate}
            disabled={generating}
          >
            <Sparkles size={17} />
            {generating ? "Gerando..." : "Gerar descrição com IA"}
          </button>
          <label>Preço (R$) *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
            placeholder="Ex.: 24,90"
          />
          <label>Link da foto (opcional)</label>
          <input
            type="url"
            value={form.photo}
            onChange={(e) => set("photo", e.target.value)}
            placeholder="https://..."
          />
          <label className="modal-switch">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => set("available", e.target.checked)}
            />{" "}
            Disponível hoje
          </label>
          <div className="modal-actions">
            <button type="button" className="outline-btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-btn" type="submit">
              Salvar prato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function PublicPage({
  data,
  dishes,
  cart,
  setCart,
  cartCount,
  cartTotal,
  checkout,
  setCheckout,
  confirmed,
  placeOrder,
  notify,
  navigate,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "Pix na entrega",
    notes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  if (confirmed)
    return (
      <div className="public-shell">
        <div className="success-card">
          <div className="success-icon">
            <Check size={35} />
          </div>
          <h1>Pedido confirmado!</h1>
          <p>Seu pedido foi enviado para a cozinha.</p>
          <div className="confirmed-number">
            Pedido <b>#{confirmed}</b>
          </div>
          <p className="muted">
            O pagamento será feito na entrega, conforme a opção escolhida.
          </p>
          <button
            className="primary-btn full"
            onClick={() => navigate(`/r/${slug}`)}
          >
            Voltar ao cardápio
          </button>
        </div>
      </div>
    );
  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-brand">
          <span className="brand-mark">
            <Utensils />
          </span>
          <div>
            <b>{data.restaurant.name}</b>
            <span>Comida caseira feita com carinho</span>
          </div>
        </div>
        <div className="open-tag">
          <i /> Recebendo pedidos
        </div>
      </header>
      <section className="public-hero">
        <span>🍲 FEITO NA HORA, COM CARINHO</span>
        <h1>
          Uma refeição gostosa
          <br />
          deixa o dia melhor.
        </h1>
        <p>Escolha seus pratos favoritos e faça seu pedido.</p>
      </section>
      {checkout ? (
        <div className="checkout-wrap">
          <button className="back-link" onClick={() => setCheckout(false)}>
            <ArrowLeft size={17} /> Voltar ao cardápio
          </button>
          <h2>Finalizar pedido</h2>
          <div className="checkout-grid">
            <form
              className="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder(form);
              }}
            >
              <label>Seu nome *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                placeholder="Como podemos te chamar?"
              />
              <label>Telefone *</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
                minLength="10"
                placeholder="(00) 00000-0000"
              />
              <label>Endereço de entrega *</label>
              <textarea
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                required
                rows="2"
                placeholder="Rua, número, bairro e complemento"
              />
              <label>Como vai pagar na entrega?</label>
              <select
                value={form.payment}
                onChange={(e) => set("payment", e.target.value)}
              >
                <option>Pix na entrega</option>
                <option>Dinheiro na entrega</option>
                <option>Cartão na maquininha</option>
              </select>
              <label>Observações (opcional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows="2"
                placeholder="Alguma orientação para o pedido?"
              />
              <p className="privacy-note">
                🔒 Usaremos seus dados somente para organizar e entregar este
                pedido.
              </p>
              <button className="primary-btn full" type="submit">
                Confirmar pedido · {money(cartTotal)}
              </button>
            </form>
            <CartSummary data={data} cart={cart} total={cartTotal} />
          </div>
        </div>
      ) : (
        <>
          <main className="public-menu">
            <div className="menu-title">
              <div>
                <p className="eyebrow">CARDÁPIO DE HOJE</p>
                <h2>Escolha sua refeição</h2>
              </div>
              <span>{dishes.length} opções</span>
            </div>
            <div className="public-dish-grid">
              {dishes.map((d) => (
                <div className="public-dish" key={d.id}>
                  <div className="public-dish-photo">
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} />
                    ) : (
                      <span>🍛</span>
                    )}
                  </div>
                  <div className="public-dish-content">
                    <h3>{d.name}</h3>
                    <p>{d.description || d.ingredients}</p>
                    <div className="public-dish-bottom">
                      <b>{money(d.price)}</b>
                      <div className="quantity-control">
                        <button
                          aria-label="Diminuir"
                          disabled={!cart[d.id]}
                          onClick={() =>
                            setCart((c) => ({
                              ...c,
                              [d.id]: Math.max(0, (c[d.id] || 0) - 1),
                            }))
                          }
                        >
                          −
                        </button>
                        <b>{cart[d.id] || 0}</b>
                        <button
                          aria-label="Adicionar"
                          onClick={() =>
                            setCart((c) => ({
                              ...c,
                              [d.id]: (c[d.id] || 0) + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!dishes.length && <Empty text="Nenhum prato disponível hoje." />}
          </main>
          {cartCount > 0 && (
            <div className="cart-bar">
              <div>
                <span>
                  {cartCount} {cartCount === 1 ? "item" : "itens"}
                </span>
                <b>{money(cartTotal)}</b>
              </div>
              <button className="primary-btn" onClick={() => setCheckout(true)}>
                Ver pedido <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}
      <footer className="public-footer">
        iFoome Delivery · Pedido simples, comida boa.
      </footer>
    </div>
  );
}
function CartSummary({ data, cart, total }) {
  return (
    <aside className="cart-summary">
      <h3>Seu pedido</h3>
      {data.dishes
        .filter((d) => cart[d.id] > 0)
        .map((d) => (
          <div className="cart-line" key={d.id}>
            <span>
              {cart[d.id]}x {d.name}
            </span>
            <b>{money(d.price * cart[d.id])}</b>
          </div>
        ))}
      <div className="cart-total">
        <span>Total</span>
        <b>{money(total)}</b>
      </div>
      <small>Pagamento somente na entrega.</small>
    </aside>
  );
}
