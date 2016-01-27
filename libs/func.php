<?php

/**
 * hit update
 * 조회수 올리기
 *
 * @Param {Number} $srl : article_srl
 * @Return void
 */
function hitUpdate($srl)
{
	// 내부 아이피라면 조회수를 올리지 않는다.
	if (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']))
	{
		return false;
	}

	// get article data
	$article = Spawn::item([
		'table' => Spawn::getTableName('article')
		,'field' => 'srl,hit'
		,'where' => 'srl='.$srl
	]);

	// check article data
	if (!count($article))
	{
		return false;
	}

	if (!isset($_COOKIE['hit-'.$article['srl']]))
	{
		// set cookie
		setcookie('hit-'.$article['srl'], 1, time()+3600*24);
		// update db
		$article['hit'] += 1;
		$result = Spawn::update([
			'table' => Spawn::getTableName('article')
			,'where' => 'srl='.$article['srl']
			,'data' => [
				'hit='.$article['hit']
			]
		]);
	}
}