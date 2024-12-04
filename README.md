# 🗺 **BooMap**

<img width="1722" alt="스크린샷 2024-12-02 오전 2 11 50" src="https://github.com/user-attachments/assets/43132cc1-bad7-482b-885f-b8d5e3a01103">
<img src="https://i.imgur.com/fiAwuJA.gif">
<img src="https://github.com/user-attachments/assets/cee80201-0d26-40e5-9e1f-0ab1fc5edae3">
<img src="https://i.imgur.com/CXmg6H0.gif" />
<img src="https://github.com/user-attachments/assets/f60e5d7a-7ab1-4449-90a7-df186ba66d2e">
<img src="https://github.com/user-attachments/assets/a318b955-ad4b-457f-b1c4-03ce4c6ccb2f">

---

🧭 _당신의 프로젝트에 길잡이가 되어줄게요_ 🧭

**AI 기반 마인드맵 자동화 서비스**

> ✨ 당신의 아이디어를 연결하는 가장 스마트한 방법, BooMap! ✨
>
> - 회의록 기반으로 **마인드맵을 자동 생성**해요.
> - 시각화된 캔버스에서 **수정과 삭제**가 가능해요.
> - 만들어진 마인드맵을 팀원들과 **쉽게 공유**할 수 있어요.

<br>

<div align="center"><a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb32-BooMap&count_bg=%2360AEEF&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false"/></a></div>
 
<br>

---


## 🧐 두뇌풀가동팀의 두뇌풀가동


### 동시편집 소켓 문제 해결하기
저희 팀은 노드에 대한 동시편집을 가능하기 위해 socket.io에 도전해보았습니다.
동시 편집을 구현하는 과정에 있어서 어떤 문제와 고민들을 했을까요?

- 🕒 [io 객체 생성 타이밍과 HTTP 요청](https://luxurious-share-af6.notion.site/io-HTTP-d4557100f7c24787b1e87f1c6318e66c?pvs=4)
- 🤖 [aiResponse 이벤트 핸들러 중복 등록 문제](https://luxurious-share-af6.notion.site/aiResponse-1507725fa9ac80c4afebe1c7ec044638?pvs=4)
- 🛠️ [소켓 에러 해결하기 총본집](https://luxurious-share-af6.notion.site/cb17937f9c05446e827aecd5fabb5df0?pvs=4)
- 🖥️ [소켓을 연결했더니 캔버스가 마비된 건에 대하여..](https://luxurious-share-af6.notion.site/223e0029efef4945ae4073b3340324ad?pvs=4)
- 😱 [노드의 텍스트을 삭제했는데 화면의 텍스트가 살아있는 것에 대하여…](https://luxurious-share-af6.notion.site/e0451420b8c946e3b2cb9c8086197d7a?pvs=4)

### 마인드맵 그려내기
마인드맵은 캔버스 라이브러리를 이용하여 그려내지만, 노드들과 마인드맵을 만들어주는 로직은 처음부터 끝까지 저희 팀이 구현했습니다. 어떤 시도와 도전들이 있었는지 찾아보세요!

**옵시디언과 같은 메모 앱에서는 마인드맵 자식 요소들이 딸려오던데,, 우리도 한번 도전해볼까?** <br>
-> 🛠️ [노드들을 끌고오게 하기](https://luxurious-share-af6.notion.site/1417725fa9ac8060944ec3769d9056a8?pvs=4)

**각 부모와 자식 간을 이어주는 선을 직접 위치까지 계산해서 넣어야 했는데,, 보이는 것보다 더 개선할 수 있을까에 대한 고민을 공유합니다** <br>
-> 🎯 [드래그 시 노드를 따라가는 선 구현하기](https://luxurious-share-af6.notion.site/1377725fa9ac80b1af7fe19ee08a1110?pvs=4)

**사용자들이 브레인스토밍하면서 한 곳으로 관심사를 분류해놓긴 하지만, 텍스트를 보기 위해 겹쳐 놓지는 않을텐데,, 그럼 재미 요소로 노드들끼리 2D 물리엔진처럼 충돌이 되도록 구현해 볼까하는 생각에서 노드 충돌방지를 소개합니다.** <br>
-> ⚠️ [노드들의 충돌 감지 및 회피](https://luxurious-share-af6.notion.site/13a7725fa9ac80e8b96af725dbf70ba0?pvs=4)

**충돌 방지 기능을 넣었더니 노드가 많아졌을 때 프레임 드랍이 생겼습니다. 프레임 드랍을 해결하기 위한 문제 분석과 이를 해결하기 위한 시도를 공유합니다!** <br>
-> 🚀 [충돌 방지의 렌더링 성능 최적화](https://luxurious-share-af6.notion.site/13d7725fa9ac800798f5f44af7c4939f?pvs=4)

**이미지의 export 기능을 구현한 과정을 소개합니다!** <br>
-> 💾 [노드들의 이미지 다운로드하기](https://luxurious-share-af6.notion.site/1427725fa9ac8043a27ceffd0d387cdb?pvs=4)

**사용자가 나중에 노드가 많아졌을 때, 한번 노드들에 대해서 재정렬하거나 겹치지 않게끔 노드를 만들어주는 기능을 넣으면 사용자 경험에 좋은 영향을 끼칠 것이라 판단했습니다. 그렇다면 이를 어떻게 계산하여 반영했는지에 대한 과정을 소개합니다** <br>
-> 📍 [노드들이 겹치지 않게 펼치기](https://luxurious-share-af6.notion.site/782eba067f814852a11208f249996cdf?pvs=4)

---

### 회원과 비회원 전용 서비스 만들기
회원과 비회원 전용 서비스를 만들면서 어떻게 소유권을 관리해야 할지 정말 많은 케이스들이 발견되었습니다. 이를 해결하기 위한 저희만의 돌파구를 소개합니다.

- 🔑 [회원과 비회원의 소유권 관리하기](https://luxurious-share-af6.notion.site/14e7725fa9ac80eba893d0986a81e605?pvs=4)
- 📡 [로그인 후 대시보드 API를 불러오도록 타이밍 조절하기](https://luxurious-share-af6.notion.site/14e7725fa9ac8070aff8cd82157ca616?pvs=4)

---


### 마크다운 회의록 구현하기
모든 회의에서 대부분의 서기가 있다시피, 저희도 회의록을 두고 한 명이 이를 편집하면서 다른 사람들은 볼 수 있으면 좋겠다는 새로운 아이디어가 나와 회의록 기능을 추가했습니다. 에디터 라이브러리를 사용한 일지를 공유합니다.<br>

- 📝 [tiptap 에디터 도입하기](https://luxurious-share-af6.notion.site/tiptap-4f653362bcd34016a377fe4794b76455?pvs=4)

---

### 기타 고민과 도전들
팀원들이 순수 흥미와 호기심으로 했던 도전들과 직면했던 문제들을 해결하기 위한 시도들을 소개합니다!

**저작도구에서 중요했던 핵심 기능 중 하나는 '단축키'였습니다. 이와 함께 저희의 노드들의 상태를 되돌리기 할 수 있는 기능이 있다면 편집이 보다 쉬울 것이라 판단하여 시도했던 과정을 소개합니다.** <br>
->  🔄 [canvas에서 Ctrl + z로 뒤로가기를 해보자](https://luxurious-share-af6.notion.site/canvas-Ctrl-z-1cf4b1e309814aea859ea9b27e3ec82b?pvs=4)

다양한 문제들을 해결했던 과정들을 소개합니다.
- ⚙️ [이벤트 리스너 조절하기](https://luxurious-share-af6.notion.site/14a7725fa9ac8065b906fc9af6b94d1c?pvs=4)


---

## 🛠️ 기술스택

<div align="center">
<img width="697" alt="image" src="https://github.com/user-attachments/assets/47f18052-b896-4c99-9b2b-6a18860de0aa">
</div>

<br>

## 서버 아키텍처
<img width="697" alt="image" src="https://i.imgur.com/JbkxCKa.png">



---

## 🔗 Links
저희 팀에 대해서 더 알고 싶거나 서비스를 체험하고싶으신 분은 아래 링크를 통해 이동해주세요 😉 </br>

[![BOOMAP](https://img.shields.io/badge/BOOMAP-0A84FF?style=for-the-badge&logo=googlegemini&logoColor=white)](https://boomap.site)  </br>
[![TEAM NOTION](https://img.shields.io/badge/TEAM%20NOTION-0078D7?style=for-the-badge&logo=notion&logoColor=white)](https://luxurious-share-af6.notion.site/BOOMAP-1287725fa9ac80dd87d9c5fbad711b3d?pvs=4) </br>
[![Wiki](https://img.shields.io/badge/Wiki-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/boostcampwm-2024/web32-BooMap/wiki) </br>



## 🧠TEAM 두뇌풀가동

<div align="center">
<img src="https://i.imgur.com/nHeXf6r.png" height=400/>
</div>

<br>
<br>

### 👥 팀원

<div align="center">

|                            J001 강민주                             |                            J026 김남희                            |                            J155 양현호                             |                            J238 조민형                            |
| :----------------------------------------------------------------: | :---------------------------------------------------------------: | :----------------------------------------------------------------: | :---------------------------------------------------------------: |
| <img src="https://i.imgur.com/zjvZ2sa.jpeg" width=100 height=100/> | <img src="https://i.imgur.com/GMFP1FK.png" width=100 height=100/> | <img src="https://i.imgur.com/wtHJtfD.jpeg" width=100 height=100/> | <img src="https://i.imgur.com/wXzG6SX.png" width=100 height=100/> |
|             [@Minju9187](https://github.com/Minju9187)             |          [@kimnamheeee](https://github.com/kimnamheeee)           |                [@adkm12](https://github.com/adkm12)                |           [@alsgud8311](https://github.com/alsgud8311)            |
| Frontend| Frontend|Backend|Frontend|

</div>

<br>
