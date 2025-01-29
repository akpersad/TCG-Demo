import HomeContainer from '@/components/HomeContainer/HomeContainer';

export default function Home() {
  return (
    <div className='max-w-screen-xl mx-auto items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:p-1'>
        <HomeContainer />
      </main>
    </div>
  );
}
