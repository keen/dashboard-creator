import React, { FC } from 'react';

type Props = {
  /** Placeholder width */
  width?: string | number;
  /** Placeholder height */
  height?: string | number;
};

const Placeholder: FC<Props> = ({ width = '100%', height = 170 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 380 170"
    data-testid="thumbnail-placeholder"
  >
    <defs>
      <filter id="tile-placeholder-opacity-a">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-b" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-c" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-d">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-e" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-f" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-g">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-h" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-i" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-j">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-k" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-l" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-m">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-n" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-o" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-p">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-q" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-r" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-s">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-t" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-u" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-v">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-w" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-x" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-y">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-z" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-A" cx="3.277" cy="3.277" r="1.147" />
      <filter id="tile-placeholder-opacity-B">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.886275 0 0 0 0 0.607843 0 0 0 0 0.117647 0 0 0 1.000000 0"
        />
      </filter>
      <circle id="tile-placeholder-opacity-C" cx="3.277" cy="3.277" r="2.458" />
      <circle id="tile-placeholder-opacity-D" cx="3.277" cy="3.277" r="1.147" />
    </defs>
    <g
      fill="none"
      fillRule="evenodd"
      opacity=".1"
      transform="translate(-10 11)"
    >
      <g transform="translate(36.797 17)">
        <path
          fill="#85B4C3"
          d="M34.1172,0 C46.244931,0 57.4526859,6.46119572 63.5174001,16.9496215 C69.5821143,27.4380473 69.5821143,40.3604388 63.5174001,50.8488646 C60.769353,55.6015384 56.9061317,59.6169038 52.2604214,62.5508833 L46.8186432,53.9557302 C53.9934394,49.4250964 58.2029248,41.4147052 57.8617528,32.9432844 C57.5205808,24.4718636 52.6779752,16.8275842 45.1603096,12.8884922 C41.7536817,11.1036971 37.9651449,10.1697729 34.1172,10.1697729 L34.1172,0 Z"
        />
        <path
          fill="#CB5623"
          d="M52.2604214,62.5508833 C47.6147112,65.4848627 42.3256965,67.2459284 36.8482734,67.6883135 L36.0301395,57.5524399 C39.8645054,57.2439568 43.5664762,56.0083294 46.8186432,53.9557302 L52.2604214,62.5508833 Z"
        />
        <path
          fill="#3A5F45"
          d="M36.8482734,67.6883135 C24.7595819,68.6629168 13.0680758,63.1220855 6.17843821,53.155708 C2.52908597,47.8775959 0.454896,41.6723395 0.196895284,35.2636876 L10.3726472,34.8552017 C10.7138192,43.3266225 15.5564248,50.9709018 23.0740904,54.9099939 C27.0561278,56.9964923 31.5490744,57.9134668 36.0301395,57.5524399 L36.8482734,67.6883135 Z"
        />
        <path
          fill="#ED9D84"
          d="M0.196895284,35.2636876 C0.0492238209,31.617824 0.493935582,27.9736554 1.51066209,24.4684736 L11.2926235,27.2973655 C10.5814241,29.7499757 10.2691075,32.3025887 10.3726472,34.8552017 L0.196895284,35.2636876 Z"
        />
        <path
          fill="#FBBC57"
          d="M1.51066209,24.4684736 C4.88503988,12.8359484 14.2171974,3.88315829 25.9935722,0.98477301 C28.6516585,0.33051762 31.3793371,0 34.1172,0 L34.1172,10.1697729 C25.6269396,10.1697729 17.7833783,14.6919319 13.5382481,22.034508 C12.5792323,23.692181 11.8255986,25.4583315 11.2926235,27.2973655 L1.51066209,24.4684736 Z"
        />
      </g>
      <g transform="translate(190.297 47.407)">
        <rect width="11" height="88.043" x="152.703" y=".58" fill="#487650" />
        <rect
          width="11"
          height="70.435"
          x="109.703"
          y="19.167"
          fill="#6C9A74"
        />
        <rect width="11" height="61.63" x="131.703" y="26.993" fill="#F0AB30" />
        <rect width="11" height="45.978" x="87.703" y="43.624" fill="#FFD898" />
        <rect width="11" height="38.152" x="65.703" y="51.45" fill="#487650" />
        <rect width="11" height="30.326" x="22.703" y="58.298" fill="#6C9A74" />
        <rect width="11" height="26.413" x="44.703" y="62.211" fill="#F0AB30" />
        <rect width="11" height="20.543" x=".703" y="69.059" fill="#FFD898" />
      </g>
      <g transform="translate(0 .693)">
        <polyline
          stroke="#FAA432"
          strokeWidth="2"
          points="1 140.791 33.695 128.887 66.867 143.307 100.039 124.158 133.759 63.759 166.152 32.939 199.496 36.669 232.726 53.613 266.063 43.367 296.675 18.079 332.084 1.307 398 36.669"
          opacity=".8"
        />
        <g
          filter="url(#tile-placeholder-opacity-a)"
          transform="translate(231 50.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-b" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-c" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-d)"
          transform="translate(264 41.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-e" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-f" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-g)"
          transform="translate(295 17.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-h" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-i" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-j)"
          transform="translate(331 .307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-k" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-l" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-m)"
          transform="translate(31 127.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-n" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-o" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-p)"
          transform="translate(66 141.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-q" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-r" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-s)"
          transform="translate(97 123.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-t" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-u" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-v)"
          transform="translate(132 64.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-w" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-x" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-y)"
          transform="translate(165 31.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-z" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-A" />
          </g>
        </g>
        <g
          filter="url(#tile-placeholder-opacity-B)"
          transform="translate(198 34.307)"
        >
          <g transform="translate(-1.898 -.83)">
            <circle cx="3.277" cy="3.277" r="3.277" fill="#E29B1E" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-C" />
            <use fill="#E29B1E" xlinkHref="#tile-placeholder-opacity-D" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default Placeholder;
