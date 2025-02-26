export default function Loading() {
  return (
    <div className='max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md mx-auto animate-pulse'>
        <div className='h-12 bg-gray-200 rounded-md mb-6'></div>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-12 bg-gray-200 rounded-md'></div>
          ))}
        </div>
        <div className='h-12 bg-gray-200 rounded-md mt-6'></div>
      </div>
    </div>
  );
}
