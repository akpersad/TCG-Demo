import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-transparent text-white py-4'>
      <div className='container mx-auto text-center'>
        <p className='text-base'>
          Made By{' '}
          <Link
            href='http://github.com/akpersad/'
            target='_blank'
            className='underline'
          >
            Andrew Persad
          </Link>
        </p>
        <p className='text-sm'>
          Heavily inspired by{' '}
          <Link
            href='https://pokemontcg.guru/'
            target='_blank'
            className='underline'
          >
            Pokemon TCG Guru
          </Link>
          . Thank you!
        </p>
        <p className='text-sm'>
          Data made possible by{' '}
          <Link
            href='https://pokemontcg.io/'
            target='_blank'
            className='underline'
          >
            Pokemon TCG API
          </Link>{' '}
          and{' '}
          <Link
            href='https://pokenode-ts.vercel.app/'
            target='_blank'
            className='underline'
          >
            Pokenode-ts
          </Link>
        </p>
        <p className='text-sm'>
          &copy; {currentYear === 2025 ? currentYear : `2025 - ${currentYear}`}.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
