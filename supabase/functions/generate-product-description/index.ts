// Edge Function: gera uma descrição comercial de produto usando a IA do Lovable (Gemini).
// Só administradores podem chamar. A LOVABLE_API_KEY é provisionada pelo Lovable Cloud.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  nome?: string;
  categoria?: string;
  tipo?: string;
  rascunho?: string;
  atributos?: {
    cores?: string[];
    tamanhos?: string[];
    volumes?: string[];
    notas?: string[];
    ativos?: string[];
    tecido?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Configuração do Supabase ausente na função.");
    }
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY ausente — verifique a IA do Lovable Cloud.");
    }

    // --- valida que o chamador é admin ---
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Não autenticado." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Acesso restrito a administradores." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- monta o prompt ---
    const body = (await req.json()) as Payload;
    const attrs: string[] = [];
    const a = body.atributos ?? {};
    if (a.cores?.length) attrs.push(`Cores: ${a.cores.join(", ")}`);
    if (a.tamanhos?.length) attrs.push(`Tamanhos: ${a.tamanhos.join(", ")}`);
    if (a.volumes?.length) attrs.push(`Volumes: ${a.volumes.join(", ")}`);
    if (a.tecido) attrs.push(`Tecido: ${a.tecido}`);
    if (a.notas?.length) attrs.push(`Notas olfativas: ${a.notas.join(", ")}`);
    if (a.ativos?.length) attrs.push(`Ativos: ${a.ativos.join(", ")}`);

    const contexto = [
      body.nome ? `Produto: ${body.nome}` : "",
      body.categoria ? `Categoria: ${body.categoria}` : "",
      body.tipo ? `Tipo: ${body.tipo}` : "",
      attrs.length ? attrs.join("\n") : "",
      body.rascunho ? `Observações da lojista: ${body.rascunho}` : "",
    ].filter(Boolean).join("\n");

    const systemPrompt =
      "Você é copywriter de uma boutique digital brasileira de moda feminina, perfumaria e cosméticos chamada Ka Lamour Store. " +
      "Escreva descrições de produto sofisticadas, sensoriais e comerciais, em português do Brasil, com tom elegante e desejável (nunca exagerado ou apelativo). " +
      "Retorne apenas a descrição, sem título, sem aspas, sem marcadores. Entre 2 e 4 frases, no máximo ~60 palavras.";

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Escreva a descrição comercial deste produto:\n\n${contexto}` },
        ],
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Limite de uso da IA atingido. Tente novamente em instantes." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const detail = await aiResp.text();
      throw new Error(`Falha na IA (${aiResp.status}): ${detail.slice(0, 200)}`);
    }

    const aiData = await aiResp.json();
    const description = aiData?.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Erro inesperado." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
