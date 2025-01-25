'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryBall from '../../../public/assets/luxuryball.png';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import styles from './Header.module.scss';

const Header = () => {
  const pathname = usePathname();

  const isCurrentPage = useMemo(() => {
    return (currentPathname: string) => pathname === currentPathname;
  }, [pathname]);

  const activeClass = `block py-2 px-3 text-activeRed bg-blue-700 rounded md:bg-transparent md:activeRed md:p-0 dark:text-activeRed md:dark:activeRed ${styles.active}`;
  const inactiveClass =
    'block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';

  return (
    <nav className='sticky border-gray-200 bg-transparent'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 '>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            POK<span className={styles.textCallout}>É</span> COLLECTOR
          </span>
          <Image
            src={LuxuryBall}
            alt='Luxury Ball'
            width={30}
            height={30}
            className={styles.pokeball}
          />
        </Link>
        <button
          data-collapse-toggle='navbar-default'
          type='button'
          className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
          aria-controls='navbar-default'
          aria-expanded='false'
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            className='w-5 h-5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 17 14'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 1h15M1 7h15M1 13h15'
            />
          </svg>
        </button>
        <div
          className='hidden w-full md:block md:w-auto'
          id='navbar-default bg-gray-50 dark:bg-gray-800'
        >
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ${styles.navContainer}`}
          >
            <li>
              <Link
                href='/'
                className={isCurrentPage('/') ? activeClass : inactiveClass}
                aria-current='page'
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/search/cards'
                className={
                  isCurrentPage('/search/cards') ? activeClass : inactiveClass
                }
              >
                Cards
              </Link>
            </li>
            <li>
              <Link
                href='/search/sets'
                className={
                  isCurrentPage('/search/sets') ? activeClass : inactiveClass
                }
              >
                Sets
              </Link>
            </li>
            <li>
              <Link
                href='/search/advanced-search'
                className={
                  isCurrentPage('/search/advanced-search')
                    ? activeClass
                    : inactiveClass
                }
              >
                Advanced Search
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link
                  href='/collections'
                  className={
                    isCurrentPage('/collections') ? activeClass : inactiveClass
                  }
                >
                  Collections
                </Link>
              </li>

              <li>
                <UserButton />
              </li>
            </SignedIn>
            <SignedOut>
              <li>
                <SignInButton mode='modal' />
              </li>
              <li>
                <Link
                  href='/sign-up'
                  className={
                    isCurrentPage('/sign-up') ? activeClass : inactiveClass
                  }
                >
                  Sign Up
                </Link>
              </li>
            </SignedOut>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
