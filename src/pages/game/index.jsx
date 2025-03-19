import {useEffect,useRef} from 'react'
import {render,dec2bin,jiguchuanhua,linkedList,getToltal,getToltal2} from '@/utils/utils'


const Game = () => {
  
  const ref = useRef(null)

  const handleClick = ()=>{


    // console.log(getToltal([1,2,3,4,5],9));
    console.log(getToltal2([9,9,9,9,9,9,9,],[9,9,9,9]));

    // linkedList.append('A')
    // linkedList.append('B')
    // linkedList.append('C')
    // linkedList.append('D')
    // console.log(linkedList);
    // console.log(linkedList.toString());
    

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
