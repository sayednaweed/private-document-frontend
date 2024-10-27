import { useState } from 'react'

export interface ICloseButtonProps {
  dismissModel: () => void
  className?: string
}

export default function CloseButton(props: ICloseButtonProps) {
  const { dismissModel, className } = props
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={dismissModel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className=" shadow-md border h-[26px] relative w-[26px] rounded-full cursor-pointer bg-secondary transition-background ease-in-out duration-1000"
    >
      <div
        className={`pb-[2px] w-[14px] absolute top-[50%] left-[5px] rotate-45 ${
          hover && 'bg-red-400 animate-pulse'
        }  bg-red-500 rounded-full ${className}`}
      />
      <div
        className={`pb-[2px] w-[14px] absolute top-[50%] left-[5px] -rotate-45 ${
          hover && 'animate-pulse'
        } bg-primary rounded-full`}
      />
    </div>
  )
}
