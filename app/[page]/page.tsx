import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageByUrl } from '../api/serverSideProps';

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const page = await getPageByUrl(params.page, 'en_US');
  // const page = {
  //   title: '',
  //   updatedAt: '',
  //   bodySummary: '',
  //   createdAt: '',
  //   seo: {
  //     title: '',
  //     description: '',
  //   },
  // };
  // console.log(page.pageData);

  if (page?.statusCode) return notFound();

  return {
    // title: page.seo?.title || page.title,
    // description: page.seo?.description || page.bodySummary,
    // openGraph: {
    //   publishedTime: page.createdAt,
    //   modifiedTime: page.updatedAt,
    //   type: 'article',
    // },
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const page = await getPageByUrl(params.page, 'en_US');
  // console.log(page);

  // const page = {
  //   title: 'title',
  //   updatedAt: '',
  // };
  // if (page.pageUrl === '404') return notFound();

  return (
    <div className='flex flex-col w-full min-h-80 max-w-screen-xl mx-auto py-8'>
      <h1 className="mb-8 text-3xl">{page?.localizeInfos.title}</h1>
    </div>
  );
}
