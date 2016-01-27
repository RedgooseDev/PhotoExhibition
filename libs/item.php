<?php
if (file_exists('base.user.php'))
{
	require_once('base.user.php');
}
else
{
	echo "NOT FOUND \"base.user.php\"";
}

// is debug
if (defined(__DEBUG__))
{
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
}


require_once('func.php');
require_once(__GOOSE_LIB__);


$nest_srl = (isset($nest_srl)) ? $nest_srl : 1;
$defaultItemCount = (isset($defaultItemCount)) ? $defaultItemCount : 20;

$repo = [];
$output = [ 'result' => [] ];

// set nest data
$nest = Module::load('nest');
$repo['nest'] = $nest->getItem([
	'where' => 'srl='.$nest_srl
])['data'];


switch($_GET['type'])
{
	// article - view
	case 'view':
		if (!$_GET['srl'])
		{
			break;
		}
		hitUpdate($_GET['srl']);

		// set article
		$article = Module::load('article');
		$file = Module::load('file');

		// get article
		$repo['article'] = $article->getItem([
			'where' => 'srl='.(int)$_GET['srl']
		]);
		$repo['article'] = ($repo['article']['state'] == 'success') ? $repo['article']['data'] : null;

		// get files
		$repo['files'] = $file->getItems([
			'where' => 'article_srl='.(int)$_GET['srl'],
			'debug' => false
		]);
		$repo['file'] = ($repo['files']['state'] == 'success') ? $repo['files']['data'][0] : null;

		// set output
		$output = [
			'srl' => $repo['article']['srl'],
			'img' => __GOOSE_URL__.'/'.$repo['file']['loc'],
			'title' => $repo['article']['title']
		];
		break;

	// article - view index
	case 'viewIndex':

		$articles = Spawn::items([
			'table' => Spawn::getTableName('article'),
			'field' => 'srl,title',
			'where' => 'nest_srl='.$nest_srl
		]);

		foreach ($articles as $k=>$v)
		{
			$file = Spawn::item([
				'table' => Spawn::getTableName('file'),
				'field' => 'loc',
				'where' => 'article_srl='.$v['srl']
			]);

			$output['result'][] = [
				'srl' => $v['srl'],
				'img' => __GOOSE_URL__.'/'.$file['loc'],
				'title' => $v['title']
			];
		}
		break;

	// article - update hit count
	case 'updateHit':
		hitUpdate($_GET['srl']);
		$output = [ "state" => "success" ];
		break;

	// article - index
	default:
		require_once(__GOOSE_PWD__.'core/classes/Paginate.class.php');

		$_GET['page'] = ((int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

		// set article
		$article = Module::load('article');

		// get count
		$count = $article->getCount([
			'where' => 'nest_srl='.$nest_srl
		])['data'];

		if ($count)
		{
			// set paginate
			$paginate = new Paginate($count, $_GET['page'], [], $defaultItemCount, 10);

			// get article data
			$repo['articles'] = $article->getItems([
				'where' => 'nest_srl='.$nest_srl,
				'limit' => [$paginate->offset, $paginate->size],
				'sort' => 'asc',
				'debug' => false
			]);
			$repo['articles'] = ($repo['articles']['state'] == 'error') ? [] : $repo['articles']['data'];

			// set output data
			foreach($repo['articles'] as $k=>$v)
			{
				$item = [
					'srl' => $v['srl'],
					'img' => __GOOSE_URL__.'/'.$v['json']['thumnail']['url'],
					'title' => $v['title']
				];
				$output['result'][] = $item;
			}

			$next_page = $_GET['page'] + 1;
			$next_paginate = new Paginate($count, $next_page, [], $defaultItemCount, 10);
			$repo['next_article_count'] = $article->getItems([
				'field' => 'srl',
				'where' => 'nest_srl='.$nest_srl,
				'limit' => [$next_paginate->offset, $next_paginate->size],
				'debug' => false
			])['data'];
			$output['next'] = (0 < count($repo['next_article_count'])) ? true : false;
		}
		break;

}


// print output
echo json_encode($output);

Goose::end();