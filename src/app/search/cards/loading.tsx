import ApiStatusModal from '@/components/ApiStatusModal/ApiStatusModal';

export default function Loading() {
  return (
    <div className='w-full relative'>
      <ApiStatusModal />
      <div className='animate-pulse'>
        {/* Search controls skeleton */}
        <div className='mb-6'>
          <div className='h-10 bg-gray-200 rounded-md w-full max-w-md mb-4'></div>
          <div className='flex flex-wrap gap-2'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-8 bg-gray-200 rounded-md w-24'></div>
            ))}
          </div>
        </div>

        {/* Cards grid skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='h-64 bg-gray-200 rounded-md'></div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className='mt-6 flex justify-center'>
          <div className='h-10 bg-gray-200 rounded-md w-64'></div>
        </div>
      </div>
    </div>
  );
}
