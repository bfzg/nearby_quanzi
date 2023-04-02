const db = uniCloud.database();
const utilsObj = uniCloud.importObject('UtilsObj', {
	customUI: true
});

//点赞请求
export async function likeFun(artid) {
	//判断用户是否再这张表上点赞
	let count = await db.collection("quanzi_like").where(`article_id=="${artid}" && user_id==$cloudEnv_uid`)
		.count();
	if (count.result.total) {
		db.collection("quanzi_like").where(`article_id=="${artid}" && user_id==$cloudEnv_uid`).remove();
		utilsObj.operation("quanzi_article", "like_count", artid, -1);
	} else {
		db.collection("quanzi_like").add({
			article_id: artid
		})
		utilsObj.operation("quanzi_article", "like_count", artid, 1);
	}
}