import React from "react";

export interface IAnimHomeIconProps {}

export interface AnimHomeIconProps
  extends React.SVGAttributes<HTMLOrSVGElement> {}
const AnimHomeIcon = React.forwardRef<HTMLOrSVGElement, AnimHomeIconProps>(
  (props, ref: any) => {
    return (
      <svg
        ref={ref}
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        className="size-[24px]"
        viewBox="1 0 19.167 23"
      >
        <path
          d="M17.77,3H15.878a.369.369,0,0,0-.378.359V3.4l2.648,2.011V3.359A.369.369,0,0,0,17.77,3Z"
          transform="translate(-1.173)"
          fill="none"
        />
        <path
          d="M10.75,9.148a.947.947,0,1,1,.946.9A.923.923,0,0,1,10.75,9.148Z"
          transform="translate(-0.862 -0.623)"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M18.634,9.87l.7.539a.685.685,0,0,0,.94-.1.631.631,0,0,0-.1-.908L12.922,3.8a3.434,3.434,0,0,0-4.177,0L1.5,9.4a.631.631,0,0,0-.1.908.685.685,0,0,0,.94.1l.7-.539v8.864H1.919a.646.646,0,1,0,0,1.292H19.748a.646.646,0,1,0,0-1.292H18.634ZM8.382,8.612a2.453,2.453,0,1,1,2.452,2.369A2.411,2.411,0,0,1,8.382,8.612Zm2.5,3.23a12.725,12.725,0,0,1,1.512.053,2.02,2.02,0,0,1,1.2.515,1.89,1.89,0,0,1,.533,1.159,10.56,10.56,0,0,1,.055,1.355v3.81H12.839V15.073a10.982,10.982,0,0,0-.043-1.332c-.039-.28-.1-.368-.153-.417a.7.7,0,0,0-.432-.148,12.167,12.167,0,0,0-1.378-.042,12.164,12.164,0,0,0-1.378.042.7.7,0,0,0-.432.148c-.051.049-.114.137-.153.417a10.973,10.973,0,0,0-.043,1.332v3.661H7.49v-3.7a11.482,11.482,0,0,1,.055-1.461,1.89,1.89,0,0,1,.533-1.159,2.02,2.02,0,0,1,1.2-.515,12.724,12.724,0,0,1,1.512-.053Z"
          transform="translate(0 -0.026)"
          fill="none"
          className="fill-primary"
          fillRule="evenodd"
        />
        <path
          d="M10.75,9.148a.947.947,0,1,1,.946.9A.923.923,0,0,1,10.75,9.148Z"
          transform="translate(-0.862 -0.623)"
          fill="none"
          className="fill-primary"
          fillRule="evenodd"
        />
      </svg>
    );
  }
);

export default AnimHomeIcon;
