import Button from "./Button";
import Buttons from "./Buttons";

const DonateButtons = () => (
  <Buttons justify="space-evenly" mb="1rem .5rem">
    <a href="https://ko-fi.com/xerolinux" target="_blank" rel="noreferrer noopener">
      <Button
        padding=".5rem 2rem"
        text="Buy me a Coffee or Two"
        primary
        themed
        fz="var(--fz-6)"
        icon={
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000"
                preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
            <path d="M130 280 c0 -11 5 -20 10 -20 6 0 10 9 10 20 0 11 -4 20 -10 20 -5 0
                    -10 -9 -10 -20z"/>
            <path d="M90 271 c0 -12 5 -21 10 -21 6 0 10 6 10 14 0 8 -4 18 -10 21 -5 3
                    -10 -3 -10 -14z"/>
            <path d="M170 270 c0 -11 5 -20 10 -20 6 0 10 9 10 20 0 11 -4 20 -10 20 -5 0
                    -10 -9 -10 -20z"/>
            <path d="M2 185 c7 -55 28 -89 70 -111 44 -23 99 -21 141 5 19 11 44 21 55 21
                     28 0 52 26 52 56 0 17 -5 24 -20 24 -15 0 -20 7 -20 25 l0 25 -141 0 -142 0 5
                     -45z m254 -7 c-9 -49 -38 -81 -83 -96 -35 -11 -46 -11 -77 2 -38 16 -76 67
                     -76 104 0 22 2 22 121 22 l122 0 -7 -32z m44 -33 c0 -15 -26 -32 -36 -23 -2 3
                     -2 13 2 22 8 20 34 21 34 1z"/>
            <path d="M97 183 c-16 -15 -6 -53 17 -68 21 -14 28 -14 46 -3 22 14 36 50 25
                     67 -7 12 -78 15 -88 4z m73 -28 c0 -21 -34 -37 -48 -23 -21 21 -13 35 18 36
                     19 0 30 -4 30 -13z"/>
            <path d="M70 30 c0 -6 30 -10 70 -10 40 0 70 4 70 10 0 6 -30 10 -70 10 -40 0
                     -70 -4 -70 -10z"/>
            </g>
         </svg>
        }
      />
    </a>
    <a href="https://fundrazr.com/xerolinux" target="_blank" rel="noreferrer noopener">
      <Button
        padding=".5rem 2rem"
        text="FundRazr"
        primary
        themed
        fz="var(--fz-6)"
        icon={
          <svg
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.373 4.51A9.962 9.962 0 0 1 12 2c5.523 0 10 4.477 10 10a9.954 9.954 0 0 1-1.793 5.715L17.5 12H20A8 8 0 0 0 6.274 6.413l-.9-1.902zm13.254 14.98A9.962 9.962 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.125.663-4.095 1.793-5.715L6.5 12H4a8 8 0 0 0 13.726 5.587l.9 1.902zM8.5 14H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V7h2v1h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 1 1 0 5h-1v1h-2v-1H8.5v-2z"></path>
          </svg>
        }
      />
    </a>
    <a href="https://github.com/sponsors/xerolinux" target="_blank" rel="noreferrer noopener">
      <Button
        padding=".5rem 2rem"
        text="Sponsor me on Github"
        primary
        themed
        fz="var(--fz-6)"
        icon={
          <svg
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="26"
            width="26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
          </svg>
        }
      />
    </a>
  </Buttons>
);


export default DonateButtons;
