window.onload = initPage;
function initPage() {
	var question_num = document.getElementsByTagName('question_number');
	for (var i = 0; i < question_num.length; i++){
		var current_num = question_num[i];
		current_num.onclick = showQuestion;
	}
};