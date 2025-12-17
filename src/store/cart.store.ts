import { create } from "zustand";

export type CartItemTicket = {
  id: string;                 // id interno del carrito
  type: "ticket";
  movieId: string;
  movieTitle: string;
  sessionId: string;
  sessionDateTime: string;    
  roomName: string;
  seats: string[];            // ["A1", "A2", ...]
  pricePerSeat: number;
  total: number;
};

export type CartItemMenu = {
  id: string;
  type: "menu";
  menuId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
};

export type CartItem = CartItemTicket | CartItemMenu;

interface CartState {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "id" | "total"> &
      Partial<Pick<CartItem, "total">>
  ) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}
//  usamos aqui zustand para mantener la persistencia del carrito
export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const id = crypto.randomUUID?.() ?? String(Date.now());

    let total = 0;

    if (item.type === "ticket") {
      const pricePerSeat = (item as any).pricePerSeat ?? 0;
      const seatsCount = (item as any).seats?.length ?? 0;
      total = pricePerSeat * seatsCount;
    } else if (item.type === "menu") {
      const raw = item as any;
      const quantity = raw.quantity ?? 1;
      const unit =
        raw.pricePerUnit ?? raw.price ?? 0; // soporta price o pricePerUnit
      total = unit * quantity;
    }

    const withTotal: CartItem =
      item.type === "ticket"
        ? ({
            ...(item as any),
            id,
            total,
          } as CartItemTicket)
        : ({
            ...(item as any),
            id,
            // normalizamos: siempre guardamos pricePerUnit
            pricePerUnit:
              (item as any).pricePerUnit ??
              (item as any).price ??
              0,
            quantity: (item as any).quantity ?? 1,
            total,
          } as CartItemMenu);

    set((state) => ({
      items: [...state.items, withTotal],
    }));
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.length,

  totalAmount: () => get().items.reduce((acc, item) => acc + item.total, 0),
}));
