import React from 'react';

export default ({ oColor, tColor, cColor, rColor }) => (
    <svg viewBox="0 0 200 200">
        <g fill-rule="evenodd">
            <circle fill={oColor || '#F1F1F1'} cx="100" cy="100" r="100"/>
            <path 
                fill={tColor || '#FFF'}
                d="M96.63 30.143c1.862-3.393 4.88-3.392 6.74 0l10.26 18.714c1.862 3.393.232 6.143-3.634 6.143H90.004c-3.868 0-5.495-2.75-3.635-6.143l10.26-18.714z"
            />
            <circle fill={cColor || '#FFF'} cx="100" cy="100" r="15" />
            <rect
                fill={rColor || '#FFF'}
                x="86" y="145" width="28" height="28" rx="7"
            />
        </g>
    </svg>
);