import ImageUploadWithMetadata from '@/components/ImageUploadWithMetadata';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="container mx-auto p-4">
      <Link
        href="/library"
        className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Library
      </Link>
      <ImageUploadWithMetadata />
    </div>
  );
}