# Photo exhibition for Goose

온라인 사진전시회에 쓰려고 만든 사진 전시회 프로그램입니다.
어떻게 생겼는지는 아래 링크를 참고해주세요.

----------------------------

* 4TH Online Photo Exhibition : http://display.redgoose.me/4th/
* DEMO : __http://...__

----------------------------


## Install

...

### {APP}/libs/base.user.php

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


## Development

...
