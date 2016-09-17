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
$repo['nest'] = core\Spawn::item([
	'table' => core\Spawn::getTableName('Nest'),
	'where' => 'srl='.$nest_srl,
	'jsonField' => ['json']
]);


switch($_GET['type'])
{
	// article - view
	case 'view':
		if (!$_GET['srl'])
		{
			break;
		}
		hitUpdate($_GET['srl']);

		// get article
		$repo['article'] = core\Spawn::item([
			'table' => core\Spawn::getTableName('Article'),
			'where' => 'srl=' . (int)$_GET['srl'],
			'jsonField' => ['json']
		]);

		// get files
		$repo['files'] = core\Spawn::items([
			'table' => core\Spawn::getTableName('File'),
			'where' => 'article_srl=' . (int)$_GET['srl']
		]);

		// set output
		$output = [
			'srl' => $repo['article']['srl'],
			'img' => __GOOSE_URL__ . '/' . $repo['file']['loc'],
			'title' => $repo['article']['title']
		];
		break;

	// article - view index
	case 'viewIndex':

		$articles = core\Spawn::items([
			'table' => core\Spawn::getTableName('Article'),
			'field' => 'srl,title',
			'where' => 'nest_srl=' . $nest_srl
		]);

		foreach ($articles as $k=>$v)
		{
			$file = core\Spawn::item([
				'table' => core\Spawn::getTableName('File'),
				'field' => 'loc',
				'where' => 'article_srl=' . $v['srl']
			]);

			$output['result'][] = [
				'srl' => $v['srl'],
				'img' => __GOOSE_URL__ . '/' . $file['loc'],
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
		$_GET['page'] = ((int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;

		// get count
		$count = core\Spawn::count([
			'table' => core\Spawn::getTableName('Article'),
			'where' => 'nest_srl=' . $nest_srl
		]);

		if ($count)
		{
			// set paginate
			$paginate = new core\Paginate($count, $_GET['page'], [], $defaultItemCount, 10);

			// get article data
			$repo['articles'] = core\Spawn::items([
				'table' => core\Spawn::getTableName('Article'),
				'where' => 'nest_srl=' . $nest_srl,
				'limit' => [$paginate->offset, $paginate->size],
				'order' => 'srl',
				'sort' => 'asc',
				'jsonField' => ['json']
			]);

			// set output data
			foreach($repo['articles'] as $k=>$v)
			{
				$item = [
					'srl' => $v['srl'],
					'img' => __GOOSE_URL__.'/'.$v['json']['thumbnail']['url'],
					'title' => $v['title']
				];
				$output['result'][] = $item;
			}

			$next_page = $_GET['page'] + 1;
			$next_paginate = new core\Paginate($count, $next_page, [], $defaultItemCount, 10);
			$repo['next_article_count'] = core\Spawn::items([
				'table' => core\Spawn::getTableName('Article'),
				'field' => 'srl',
				'where' => 'nest_srl='.$nest_srl,
				'limit' => [$next_paginate->offset, $next_paginate->size]
			]);
			$output['next'] = (0 < count($repo['next_article_count'])) ? true : false;
		}
		break;
}


// print output
echo json_encode($output);

core\Goose::end();