import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


function Footer() {
  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden flex-col items-center px-8 pt-12 pb-4 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-center items-center self-stretch px-12 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col justify-between items-center self-stretch my-auto min-h-[96px] min-w-[240px] w-[400px]">
            <div className="flex gap-2.5 justify-center items-center px-9 w-24 h-24 bg-neutral-950 min-h-[96px] rounded-[48px] max-md:px-5">
              <Image
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3bcf48db236504250f6ffe760c007e4cc67b808ea545db4f479b11a9995608ba?placeholderIfAbsent=true&apiKey=51af9e6119e94e64a4295796d4ac2659"
                alt="Company logo"
                className="object-contain self-stretch my-auto w-6 aspect-[0.37]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-wrap flex-1 shrink gap-10 justify-center items-start self-stretch px-12 py-5 my-auto text-sm font-medium leading-10 basis-0 min-w-[240px] text-white text-opacity-80 tracking-[4.62px] max-md:px-5 max-md:max-w-full">
            <ul>
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/">À propos</Link>
              </li>
              <li>
                <Link href="/">Contact</Link>
              </li>
              <li>
                <Link href="/">FAQ</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/">Mentions légales</Link>
              </li>
              <li>
                <Link href="/">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/">Conditions générales de vente</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-6 items-center mt-8 h-[39px]">
          <Link href="/">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_164_314)">
                <path d="M2.18182 0.5C0.976364 0.5 0 1.47636 0 2.68182V22.3182C0 23.5236 0.976364 24.5 2.18182 24.5H21.8182C23.0236 24.5 24 23.5236 24 22.3182V2.68182C24 1.47636 23.0236 0.5 21.8182 0.5H2.18182ZM5.07102 5.95455H10.1016L13.0376 10.152L16.6705 5.95455H18.2536L13.7493 11.1705L19.2592 19.0455H14.2287L10.9709 14.3878L6.94815 19.0455H5.33949L10.255 13.3672L5.07102 5.95455ZM7.50426 7.24574L14.8722 17.7479H16.8239L9.45384 7.24574H7.50426Z" fill="white"/>
              </g>
              <defs>
                <g clipPath="url(#clip0_164_314)">
                  <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                </g>
              </defs>
            </svg>
          </Link>
          <Link href="/">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.18182 0.5C0.976364 0.5 0 1.47636 0 2.68182V22.3182C0 23.5236 0.976364 24.5 2.18182 24.5H21.8182C23.0236 24.5 24 23.5236 24 22.3182V2.68182C24 1.47636 23.0236 0.5 21.8182 0.5H2.18182ZM2.18182 2.68182H21.8182V9.22727H18.2621C16.8819 7.25046 14.5938 5.95455 12 5.95455C9.40619 5.95455 7.11807 7.25046 5.73793 9.22727H2.18182V2.68182ZM18.5455 4.86364V7.04545H20.7273V4.86364H18.5455ZM12 8.13636C15.0076 8.13636 17.4545 10.5833 17.4545 13.5909C17.4545 16.5985 15.0076 19.0455 12 19.0455C8.99236 19.0455 6.54545 16.5985 6.54545 13.5909C6.54545 10.5833 8.99236 8.13636 12 8.13636ZM12 10.3182C11.4949 10.3182 11.0235 10.4423 10.5959 10.6463C10.789 10.8427 10.9091 11.1113 10.9091 11.4091C10.9091 12.0113 10.4204 12.5 9.81818 12.5C9.52036 12.5 9.25176 12.3799 9.0554 12.1868C8.8514 12.6144 8.72727 13.0858 8.72727 13.5909C8.72727 15.3985 10.1924 16.8636 12 16.8636C13.8076 16.8636 15.2727 15.3985 15.2727 13.5909C15.2727 11.7833 13.8076 10.3182 12 10.3182Z" fill="white"/>
            </svg>
          </Link>
          <Link href="/">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_164_312)">
                <path d="M21.8182 0.5H2.18182C0.976364 0.5 0 1.47636 0 2.68182V22.3182C0 23.5236 0.976364 24.5 2.18182 24.5H13.0909V14.6818H9.81818V11.4091H13.0909V9.65164C13.0909 6.32436 14.712 4.86364 17.4775 4.86364C18.8018 4.86364 19.5022 4.96182 19.8338 5.00655V8.13636H17.9476C16.7738 8.13636 16.3636 8.756 16.3636 10.0105V11.4091H19.8044L19.3375 14.6818H16.3636V24.5H21.8182C23.0236 24.5 24 23.5236 24 22.3182V2.68182C24 1.47636 23.0225 0.5 21.8182 0.5Z" fill="white"/>
              </g>
              <defs>
                <g clipPath="url(#clip0_164_312)">
                  <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                </g>
              </defs>
            </svg>
          </Link>
        </div>
        <div className="mt-8 text-xs font-medium leading-4 text-white tracking-[3.3px]">
          <span className="leading-3">© 2025 I</span>
          <span className="font-bold leading-3">nfluenca</span>
          <span className="leading-3">. Tous droits réservés</span>.
        </div>
      </div>
    </div>
  )
}

export default Footer; 