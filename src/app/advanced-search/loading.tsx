export default function Loading() {
  return (
    <div className='max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <div className='w-full animate-pulse'>
        <div className='h-10 bg-gray-200 rounded-md w-full max-w-lg mb-6'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='h-6 bg-gray-200 rounded-md w-32'></div>
              <div className='h-10 bg-gray-200 rounded-md w-full'></div>
            </div>
          ))}
        </div>
        <div className='h-12 bg-gray-200 rounded-md w-40 mt-8 mx-auto'></div>
      </div>
    </div>
  );
}
