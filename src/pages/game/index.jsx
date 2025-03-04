import {useEffect,useRef} from 'react'
import {render,dec2bin,jiguchuanhua} from '@/utils/utils'


const Game = () => {
  
  const ref = useRef(null)

  const handleClick = ()=>{
    const names = ["lily", "lucy", "tom", "tony", "jack"];
    const result = jiguchuanhua(names,4)
    console.log(result)
    // debugger
    // const time = new Date().getTime()
    // const element = <h1>{time}</h1>
    // render(element,ref.current)
  }
  return (
    <>
      <div ref={ref}></div>
      <button onClick={handleClick}>点击渲染</button>
    </>
  )
}

export default Game
