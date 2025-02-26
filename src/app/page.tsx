import { Suspense } from 'react';
import HomeContainer from '@/components/HomeContainer/HomeContainer';

export default function Home() {
  return (
    <div className='max-w-screen-xl mx-auto items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:p-1'>
        <Suspense
          fallback={
            <div className='w-full animate-pulse'>
              <div className='h-8 bg-gray-200 rounded-md mb-4 w-3/4'></div>
              <div className='h-32 bg-gray-200 rounded-md mb-4'></div>
              <div className='h-8 bg-gray-200 rounded-md mb-4 w-1/2'></div>
            </div>
          }
        >
          <HomeContainer />
        </Suspense>
      </main>
    </div>
  );
}
