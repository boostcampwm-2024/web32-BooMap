export function ratioSizing(e, dimensions, setDimensions) {
  e.evt.preventDefault();

  const scaleBy = 1.02;
  const stage = e.target.getStage();
  const oldScale = stage.attrs.scaleX;
  const pointer = stage.getPointerPosition();
  const mousePointTo = {
    // 포인터가 가르키는 x,y좌표를 기존 확대비율로 나눈 것에 stage의 x좌표에 기존 확대비율로 나눈 값을 뻄
    x: pointer.x / oldScale - stage.x() / oldScale,
    y: pointer.y / oldScale - stage.y() / oldScale,
  };

  // 새로운 비율을 deltaY가 0보다 작게 되면 기존 값에 1.02만큼 곱한 값을, 아니면 기존 값에 1.02만큼 나눈 값으로 설정
  // deltaY는 사용자가 휠을 스크롤한 양임
  // 위로 스크롤하면 양수, 아래로 스크롤하면 음수
  const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };

  setDimensions({
    ...dimensions,
    scale: newScale,
    x: newPos.x,
    y: newPos.y,
  });
}
