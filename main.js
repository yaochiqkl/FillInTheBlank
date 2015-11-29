 		$(function(){
 			initPage();
		}); 
	function initPage(){
		//init Options randomly
		initOptions();
		//init triangle
		initTriangle();
		//init dragable function
		bindResize(document.getElementById('main')); 4
		//bind click events
		$(".question,.question_number").click(clickEffect);
		$("td").mouseover(mouseOver).mouseout(mouseOut).click(tableClick);
		//Submit and Checkout
		$(".submit").click(submitAnswers);
		$(".popUpWin .inquery").click(closePopUpWin);
	}
	function initOptions(){
		options.sort(function(a,b){ return Math.random()>0.5 ? -1 : 1;});
		var $ol = $(".content .foot .answer td");
		var i = 0;
		$ol.each(function(){$(this).html(options[i++]);});
	}
	function initTriangle(){
	   	$("#triangle").remove();
		var triangle = "<span id = 'triangle'>▲</div>";
		$(".number").append(triangle);
		$("#triangle").css({
			"position":"relative",
			"left":"-124px"
		});
	}
	function moveTriangle($n){
		$("#triangle").remove();
		var triangle = "<span id = 'triangle'>▲</div>";
		$(".number").append(triangle);
		var left = $n*27.6 - 124;
		$("#triangle").css({
			"position":"relative",
			"left":left+"px"
		});
	}
	function bindResize(el){ 
	       var els = el.style, 
	           y = 0; 
	       $("#drag").mousedown(function(e){ 
	           //按下元素后，计算当前鼠标与对象计算后的坐标 
	           y = e.clientY - el.offsetHeight + 20; 
	           $(document).bind("mousemove",move).bind("mouseup",up) ;
	           e.preventDefault() ;
	       }); 
	       function move(e){ 
	           els.height = e.clientY - y + 'px' ;
	       } 
	       function up(){ 
	            $(document).unbind("mousemove", move).unbind("mouseup", up) ;
	       } 
	} 
	function clickEffect(){
	   	var $n = parseInt($(this).attr("id").slice(-1));
	   	$(".question").removeClass("selected");
	   	$(".question:eq("+$n+")").addClass("selected");
	   	//跳转锚点
	   	//location.hash="question"+$n;
	    $(".content .main").animate({scrollTop:$("#quesion0")},800);
	   	//三角
	   	moveTriangle($n);
	}
	function mouseOver(){
		$(this).addClass("mouseover");
		var answer = $(this).text();
		var $answer_box = $(".question.selected");
		$answer_box.text(answer); 
	}
	function mouseOut(){
		$(this).removeClass("mouseover");
		$(".selected:not(.answered)").text("");
	}
	function tableClick(){
		var $current = $(".selected");
		if ($current.length>0) {
			var $n = parseInt($current.attr("id").slice(-1));
			$current.removeClass("mouseover").removeClass("selected").addClass("answered");
			$(".question_number:eq("+$n+")").addClass("answered");
			$(this).addClass("answered");
			var answer = $(this).text();
			var $answer_box = $(".question.selected");
			$answer_box.text(answer); 
		}
	}
	function submitAnswers(){
		$(".popUpWin,.maskLayer").css({
			display:"block"
		});
		checkAnswers();
		showAnalysis();
	}
	function closePopUpWin(){
		$(".popUpWin,.maskLayer").css({
			display:"none"
		});
		return false;
	}
	function checkAnswers () {
		var accuracy = 0;
		var answer = null;
		$(".question").removeClass("selected").removeClass("answered");
		$(".question_number").removeClass("selected").removeClass("answered");
		for(var i = 0; i < 10; i++){
			answer = $("#question"+i).text();
			if( answer == answers[i]){
				accuracy++;
				$(".popUpWin .main td:eq("+i+")").addClass("correct");
				$(".content .foot .number span:eq("+i+")").addClass("correct");
				$("#question"+i).addClass("correct");
			} else {
				$(".popUpWin .main td:eq("+i+")").addClass("incorrect");
				$(".content .foot .number span:eq("+i+")").addClass("incorrect");
				$("#question"+i).addClass("incorrect");
				//插入正确答案
				if ($("#question"+i).text() === '') {
					$("#question"+i).html("<span style='color:black;text-decoration:none;display:inline-block;'>-</span>");
					$("#question"+i).addClass("undo");
				}
				var correct_answer = "<span class = 'correct_answer'>"+answers[i]+"</span>";
				$("#question"+i).after(correct_answer);
			}
		}

		accuracy = accuracy*10+"%";
		$(".outcome").text(accuracy);
	}
	function showAnalysis(){
		initTriangle();
		var $text = $("<div id='analysis'><div class='title'>答案</div><div class='content result'></div><div class='title'>结构</div><div class='content structure'></div></div>");
		$(".content .answer table").remove();
		$(".content .answer").append($text);
		$("#analysis .result").text(analysis[0].answer);
		$("#analysis .structure").text(analysis[0].structure);
		$(".question,.question_number").unbind("click",clickEffect).click(showAnalysisClick);
		$(".submit").remove();
		location.hash="question0";
		$(".tip0").addClass("highlight");
	}
	function showAnalysisClick(){
		removeHighlight();
		//cancel the solution of getting index
		var $n = parseInt($(this).attr("id").slice(-1));
		moveTriangle($n);
		showDetails($n);
		addHighlight($n);
		location.hash="question"+$n;
	}
	function showDetails($n){
		$("#analysis .result").text(analysis[$n].answer);
		$("#analysis .structure").text(analysis[$n].structure);
	}
	function addHighlight($n){
		$(".tip"+$n).addClass("highlight");
	}
	function removeHighlight(){
		$(".content .main .text span").removeClass("highlight");
	}