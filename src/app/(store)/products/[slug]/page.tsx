import { api } from "@/src/data/api";
import { Products } from "@/src/data/types/products";
import { Metadata } from "next";
import Image from "next/image";

interface ProductProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string): Promise<Products> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, //1hr
    },
  });
  const products = await response.json();
  return products;
}

//nessa parte ele está pegando o título do produto para aparecer na aba do navegador. Utiliza a função em cima para acessar o slug de cada produto
//Repare que o getProduct está sendo chamado 2x, o react vai de forma automática deduplicar (ele não fará a chamada duas vezes) -> Memoização (sim, é este nome)
export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: product.title,
  };
}

//cache pelo next
//OBS = Usar apenas em produtos que sejam os mais acessados ou destaque!!!
export async function generateStaticParams() {
  //obrigatoriamente esse nome 'generateStaticParams'
  const response = await api("/products/featured");
  const products: Products[] = await response.json();
  // return [
  //   { slug: 'titulo do produto aqui' }
  // ]
  return products.map((product) => {
    return { slug: product.slug };
  });
  //npm run build
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.slug);

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          src={product.image}
          alt="moletom"
          width={870}
          height={870}
          quality={100}
        />
      </div>

      <div className="flex flex-col justify-center px-12 ">
        <h1 className="text-3xl font-bold leading-tight ">{product.title}</h1>

        <p className="mt-2 leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
          <span className="text-sm text-zinc-400">
            {(product.price / 12).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <span className="block font-semibold">Tamanhos</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              P
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              M
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              G
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              GG
            </button>
          </div>
        </div>

        <button
          type="button"
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
