import { api } from "@/src/data/api";
import { Products } from "@/src/data/types/products";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedProducts(): Promise<Products[]> {
  const response = await api("/products/featured", {
    next: {
      revalidate: 60 * 60, //1hr todos que acessarem a página vão receber o mesmo conteúdo
      // cache: "force-cache" Força o cache
      // cache: "no-cache", Não usa o cache
      // cache: "default", Usa o cache padrão
      // cache: "no-store", Não armazena o cache, carrega do zero
    },
  });
  const products = await response.json();
  return products;
}

//muda o título na aba do navegador, abaixo
export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts();

  return (
    <div className="grid max-h-[760px] grid-cols-9 grid-rows-6 gap-6">
      <Link
        href={`/products/${highlightedProduct.slug}`}
        className=" group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-center"
      >
        <Image
          className="group-hover:scale-105 transition-transform duration-500"
          src={highlightedProduct.image}
          width={920}
          height={920}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">{highlightedProduct.title}</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            {highlightedProduct.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </Link>

      {otherProducts.map((products) => {
        return (
          <Link
            key={products.id}
            href={`/products/${products.slug}`}
            className=" group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-center"
          >
            <Image
              src={products.image}
              className="group-hover:scale-105 transition-transform duration-500"
              width={435}
              height={435}
              quality={100}
              alt=""
            />

            <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="text-sm truncate">{products.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {products.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
