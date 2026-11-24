import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/site/Layout";
import { categories, neighborhoods } from "@/data/demo";
import { createSeller } from "@/data/mock-db";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Divulgue seu negócio — MaricáMais" },
      { name: "description", content: "Cadastre seu pequeno negócio de Maricá na vitrine demonstrativa." },
      { property: "og:title", content: "Divulgue seu negócio — MaricáMais" },
      { property: "og:description", content: "Cadastro demonstrativo de empreendedores de Maricá." },
    ],
  }),
  component: Cadastro,
});

const req = ["responsavel", "nome", "descricao", "categoria", "bairro", "contato"] as const;

function Cadastro() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    req.forEach((k) => { if (!String(fd.get(k) ?? "").trim()) errs[k] = "Campo obrigatório."; });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const category = categories.find((item) => item.slug === fd.get("categoria"));
    if (!category) {
      setErrors({ categoria: "Selecione uma categoria válida." });
      return;
    }

    setLoading(true);
    try {
      createSeller({
        owner: String(fd.get("responsavel")).trim(),
        name: String(fd.get("nome")).trim(),
        description: String(fd.get("descricao")).trim(),
        category: category.slug,
        neighborhood: String(fd.get("bairro")),
        contact: String(fd.get("contato")).trim(),
        mumbuca: fd.get("mumbuca") === "sim" ? "sim" : fd.get("mumbuca") === "nao" ? "nao" : "nao-informado",
      });
      toast.success("Negócio cadastrado!", { description: "Registro salvo nesta demonstração neste navegador." });
      navigate({ to: "/painel" });
    } catch (error) {
      console.error("Falha ao salvar o negócio na base simulada.", error);
      toast.error("Não foi possível salvar o cadastro.", { description: "Verifique o armazenamento local do navegador e tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const F = ({ name, label, children }: { name: string; label: string; children: React.ReactNode }) => (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {errors[name] && <span className="text-sm text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <Page>
      <div className="container-page max-w-2xl py-10">
        <h1 className="text-3xl font-bold text-secondary md:text-4xl">Divulgue seu negócio</h1>
        <p className="mt-2 text-muted-foreground">Cadastro demonstrativo — os dados ficam salvos localmente neste navegador.</p>
        <form onSubmit={onSubmit} noValidate className="card-surface mt-8 grid gap-5 p-6 sm:grid-cols-2">
          <F name="responsavel" label="Nome do responsável"><input name="responsavel" className="field" /></F>
          <F name="nome" label="Nome comercial"><input name="nome" className="field" /></F>
          <div className="sm:col-span-2"><F name="descricao" label="Descrição do negócio"><textarea name="descricao" className="field h-24 py-2" /></F></div>
          <F name="categoria" label="Categoria"><select name="categoria" className="field" defaultValue=""><option value="">Selecione</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></F>
          <F name="bairro" label="Bairro"><select name="bairro" className="field" defaultValue=""><option value="">Selecione</option>{neighborhoods.map((n) => <option key={n}>{n}</option>)}</select></F>
          <div className="sm:col-span-2"><F name="contato" label="Informações de contato (e-mail ou rede social)"><input name="contato" className="field" /></F></div>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">Aceita Mumbuca?</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="mumbuca" value="sim" />Sim</label>
              <label className="flex items-center gap-2"><input type="radio" name="mumbuca" value="nao" />Não</label>
              <label className="flex items-center gap-2"><input type="radio" name="mumbuca" value="nao-informado" defaultChecked />Não informado</label>
            </div>
          </fieldset>
          <div className="sm:col-span-2"><F name="foto" label="Foto ou logotipo"><input name="foto" type="file" accept="image/*" className="text-sm" /></F></div>
          <button disabled={loading} className="btn btn-primary sm:col-span-2">{loading ? "Enviando…" : "Cadastrar negócio"}</button>
        </form>
      </div>
    </Page>
  );
}
