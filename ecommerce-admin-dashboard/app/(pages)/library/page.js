import PageHeader from '@/components/PageHeader';
import AssetsLibraryClient from './AssetsLibraryClient';
import { getAssets } from '@/lib/assets';
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default async function AssetsLibrary(searchParamsPromise) {
  const searchParams = await searchParamsPromise;
  const cursor = searchParams.cursor || '';
  const search = searchParams.search || '';
  
  const data = await getAssets(cursor, search);

  return (
    <div>
      <PageHeader title="Assets Library" actionHref="/library/upload" actionText="Upload New" Icon={ArrowUpTrayIcon}/>
      <AssetsLibraryClient 
        initialAssets={data.resources} 
        initialPagination={{
          next_cursor: data.next_cursor,
          total: data.total_count
        }}
        initialSearch={search}
      />
    </div>
  );
}
