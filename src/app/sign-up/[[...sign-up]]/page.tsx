'use client';
import React, { FormEvent, useMemo, useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { SignUpResource } from '@clerk/types';
import { insertUserFromClient } from '@/app/client';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';

const SignUp = () => {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userInfo, setUserInfo] = useState<SignUpResource>();
  const [error, setError] = useState('');

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
        firstName,
        lastName,
      });

      if (result.createdUserId) {
        setUserInfo(result);
        const response = await insertUserFromClient(result);
        if (response.status === 200) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  const validForm = useMemo(() => {
    return (
      Boolean(firstName) &&
      Boolean(lastName) &&
      Boolean(email) &&
      Boolean(password) &&
      Boolean(username) &&
      !Boolean(error)
    );
  }, [email, error, firstName, lastName, password, username]);

  return (
    <div
      className={`flex items-center justify-center ${styles.signUpContainer}`}
    >
      <div
        className={`sm:w-1/2 w-full h-3/4 bg-slate-400 bg-opacity-50 mx-4 sm:m-8 px-4 sm:px-0 flex justify-center items-center ${styles.innerContainer}`}
      >
        <form
          className='bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md'
          onSubmit={handleSignUp}
        >
          <h2 className='text-2xl font-bold text-white mb-6'>
            Sign Up For An Account
          </h2>
          <div className='grid md:grid-cols-2 md:gap-6'>
            <div className='relative z-0 w-full mb-5 group'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                name='floating_email'
                id='floating_email'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_email'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Email address
              </label>
            </div>
            <div className='relative z-0 w-full mb-5 group'>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type='text'
                name='floating_username'
                id='floating_username'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_username'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Username
              </label>
            </div>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              name='floating_password'
              id='floating_password'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_password'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Password
            </label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPasswordBlur}
              type='password'
              name='repeat_password'
              id='floating_repeat_password'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_repeat_password'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Confirm password
            </label>
          </div>
          {error && <p className='text-red-500 mb-5 group'>{error}</p>}
          <div className='grid md:grid-cols-2 md:gap-6'>
            <div className='relative z-0 w-full mb-5 group'>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                type='text'
                name='floating_first_name'
                id='floating_first_name'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_first_name'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                First name
              </label>
            </div>
            <div className='relative z-0 w-full mb-5 group'>
              <input
                onChange={(e) => setLastName(e.target.value)}
                type='text'
                name='floating_last_name'
                id='floating_last_name'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_last_name'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Last name
              </label>
            </div>
          </div>
          <button
            type='submit'
            className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
              !validForm
                ? styles.disabledBtn
                : 'hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            }`}
            disabled={!validForm}
          >
            Sign Up
          </button>

          <div id='clerk-captcha' />
        </form>

        {userInfo && (
          <div>
            <h2>User Information</h2>
            <h3>User Email: {userInfo.emailAddress}</h3>
            <h3>User ID: {userInfo.createdUserId}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
