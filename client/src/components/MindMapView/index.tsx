import { Button } from "@headlessui/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import plusIcon from "@/assets/plus.png";
import minusIcon from "@/assets/minus.png";
import addElementIcon from "@/assets/addElement.png";
import deleteIcon from "@/assets/trash.png";

export default function MindMapView() {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    scale: 1,
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });

  function resizing() {
    console.log(divRef.current.offsetWidth, divRef.current.offsetHeight);

    if (divRef.current) {
      setDimensions((prevDimensions) => ({
        ...prevDimensions,
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      }));
    }
  }

  useEffect(() => {
    resizing(); // 초기 크기 설정
    const resizeObserver = new ResizeObserver(() => {
      resizing();
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    return () => resizeObserver.disconnect();

    // resizing(); // 초기 렌더링 시 크기 설정
    // window.addEventListener("resize", resizing);
    // return () => window.removeEventListener("resize", resizing);
  }, [divRef]);

  return (
    //TODO : 캔버스 사이즈에 따라 확장
    <div ref={divRef} className="relative h-full min-h-0 w-full min-w-0 rounded-xl bg-white">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={dimensions.x}
        y={dimensions.y}
      >
        <Layer>
          <Rect fill="red" x={40} y={40} width={150} height={150}></Rect>
        </Layer>
      </Stage>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-2/4 -translate-y-2/4 items-center gap-3 rounded-full border px-10 py-2 shadow-md">
        <div className="flex items-center gap-3 border-r-2 px-5">
          <Button className="h-5 w-5">
            <img src={plusIcon} alt="확대하기" />
          </Button>
          <span className="text-sm font-bold text-black">{dimensions.scale * 100}%</span>
          <Button className="h-5 w-5">
            <img src={minusIcon} alt="축소하기" />
          </Button>
        </div>
        <Button className="w-8 border-r-2 pr-2">
          <img src={addElementIcon} alt="요소 추가" />
        </Button>
        <Button className="h-5 w-5">
          <img src={deleteIcon} alt="요소 삭제" />
        </Button>
      </div>
      <Button className="absolute right-0 top-[-50px] rounded-lg bg-grayscale-600 px-4 py-2 text-sm font-bold">
        캔버스 비우기
      </Button>
    </div>
  );
}
