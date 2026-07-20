export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const pix = (n: number) => n * 0.95;

export const parcelas = (n: number, max = 6) => {
  const v = n / max;
  return `${max}x de ${brl(v)} sem juros`;
};

export const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
