# Photo exhibition for Goose

온라인 사진전시회에 쓰려고 만든 사진 전시회 프로그램입니다.  
어떻게 생겼는지는 다음 데모 링크를 참고해주세요.

----------------------------

* 4TH Online Photo Exhibition  
http://display.redgoose.me/4th/
* Demo  
http://projects.redgoose.me/2015/goose/app/photo-exhibition/
* goose-dev article  
http://src.goose-dev.com/article/3/

----------------------------



## Install

앱을 설치하기 전에 goose가 설치되어있는지 확인해봅니다. `/goose`에 설치되어있다고 가정하겠습니다.  
다음 명령어를 통하여 저장소를 복제합니다.

```
git clone https://github.com/dev-goose/PhotoExhibition.git
```


### make base.user.php

다음 내용으로 `{APP}/libs/base.user.php` 경로와 파일 이름으로 만들어주시고, 자신의 서버 환경에 맞게 경로와 둥지 번호를 꼭 설정해주세요.

```
<?php
header("content-type:text/html; charset=utf-8");
session_cache_expire(30);
session_start();

define('__GOOSE__', true);
define('__GOOSE_ROOT__', 'http://localhost/goose');
define('__GOOSE_LIB__', '../goose/core/lib.php');
define('__PWD__', str_replace('basic.user.php', '', str_replace('\\', '/', __FILE__)));
define('__URL__', 'http://localhost/PhotoExihibition');
define('__ROOT__', '/PhotoExihibition');

// nest_srl
$nest_srl = 1;

// page per item count
$defaultItemCount = 20;
```

* \__GOOSE_ROOT__ : Goose 전체경로
* \__GOOSE_LIB__ : Goose 라이브러리 파일 경로 (상대경로)
* \__URL__ : Photo Exhibition 앱 전체경로
* \__ROOT__ : Photo Exhibition 앱 내부경로
* $nest_srl : nest srl 번호
* $defaultItemCount : 한페이지에 출력되는 글 갯수


## Development

CSS나 Javascript를 개발할때 개발환경을 만들어둬야 합니다. 우선 node.js가 설치되어 npm을 사용할 수 있는 환경이어야 합니다.  
다음과 같은 명령을 실행하여 node module을 설치합니다.

```
npm install
```

#### CSS build

이 앱은 scss로 만들어져 있기때문에 scss를 수정하고 다음과 같은 명령으로 css로 변환시켜 줍니다.
```
gulp scss
```
파일이 변경될때마다 자동으로 빌드하게 하려면 작업 전 다음과 같은 명령을 실행합니다.
```
gulp scss:watch
```

#### Javascript build

스크립트 소스파일의 위치는 `/src/js/`, `/src/jsx/` 경로에 있는 js와 jsx파일 전부 사용하고 빌드하게 되면 모든 소스를 합치게 됩니다.

스크립트는 react 라이브러리를 사용했습니다. 이 소스를 수정하고 빌드하려면 다음과 같은 명령을 실행합니다.
```
gulp js
```
파일이 변경될때마다 자동으로 빌드하게 하려면 작업 전 다음과 같은 명령을 실행합니다.
```
gulp js:watch
```
