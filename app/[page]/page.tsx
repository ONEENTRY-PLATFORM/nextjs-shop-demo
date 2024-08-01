import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  // const page = await getPage(params.page);
  const page = {
    title: '',
    updatedAt: '',
    bodySummary: '',
    createdAt: '',
    seo: {
      title: '',
      description: '',
    },
  };

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: 'article',
    },
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  // const page = await getPage(params.page);
  console.log(params);

  const page = {
    title: 'title',
    updatedAt: '',
  };
  if (!page) return notFound();

  return <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>;
}
