import { z } from "zod";
import data from "../data.json";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  //   console.log(params) {params: {slug: 'moletom'}};
  // console.log(params.slug);

  const slug = z.string().parse(params.slug);

  const product = data.products.find((product) => product.slug === slug);

  if (!product) {
    return Response.json(
      { message: "Produto não encontrado!" },
      { status: 400 }
    );
  }
  return Response.json(product);
}
