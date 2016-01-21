var loop = 0;
var poll = {};
var self = {}
var candidates = [];
var candidate_count = 0;
var focus_row;
var focus_col;
var focus_problem;
var focus_politician;
var	focus_page = 0;
var focus_preference;
var	solution_string = "";
var	page_one_first = {text: "", button: "Start"};
var	page_one_more = {text: "", button: "Next Issue"};
var	page_one_done = {text: "There are no more issues. You can click on each condidate to see how they ranked and priorities the issues", button: ""};
var	page_two = {text: "Click on the issue to see the candidate's solutions. Use the arrows to change your prioritization of the issue.", button: "Results"};
var	page_three = {text: "Click on each proposal to read it's explanation. Use the arrows to set your preference for a solution", button: "Return"};
var	page_four = {text: "", button: "Back"};
var colorarray = ["gainsboro", "orangered", "darkorange" , "coral", "coral", "white", "yellow",  "yellow", "yellowgreen", "limegreen"];

$(document).ready(function(){
   $.ajax({ // ajax call starts
	  	url: 'json/Poll.json',
      	dataType: 'json',
		async: false
    })
    .done(function(data) {
		poll = data;
    });
	var	error_count = 0;
	var url = "";
	while (error_count == 0) {
		candidate_count ++;
		url = "json/Candidate" + candidate_count.toString() + ".json";

		$.ajax({ // ajax call starts
	      	url: url,
		  	dataType: 'json',
			async: false
		})
		.error(function() {
			error_count ++;
		})
		.done(function(data) {
			candidates.push(data);
		});
	}
	self.Name = self;
	self.Rank = [0, 1, 2, 3];
	self.Scores = [0, 0, 0, 0];
	self.Priority = [0, 1, 2, 3];
	self.Preference = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	self.Complete = [0, 0, 0, 0];
	candidates.push(self);
	candidate_count = candidates.length-1;

    $.fn.updatepage = function(){
		var	loop = 0;
		var row = 0;
		var col = 0;

		$(".table_cell").each(function( index, elm ){
			row = parseInt((loop / 3).toString());
			col = loop % 3;
			if (col == 0) {
				if ((row < poll.ProblemCount) && (focus_page == 1)) {
//					$(this).html("<span class=emoji>&#x1F44D;</span>");
					$(this).html("<span class='emoji clickable'>&#x2b06;</span>");
				} else if ((row < candidate_count) && (focus_page == 2)) {
					$(this).html("<span class='emoji clickable'>&#x1F44D;</span>");
				} else {
					$(this).text(" ");
				}
			}
			if (col == 1) {
				if ((row < candidate_count) && (focus_page == 0)) {
					$(this).text(candidates[self.Rank[row]].Name + " (" + self.Scores[self.Rank[row]].toString() + ")");
					$(".page_type").text("Candidate Compatibility");
				} else if ((row < poll.ProblemCount) && (focus_page == 1)) {
					$(this).text("#" + (row + 1).toString() + " " + poll.Problems[self.Priority[row]] + " (" + self.Complete[self.Priority[row]].toString() + "/" + candidate_count.toString() + ')');
					$(".page_type").text("Issues and Problems");
					$( this ).css("font-weight", "normal");
				} else if ((row < candidate_count) && (focus_page == 2)) {
					focus_preference = self.Preference[focus_problem*candidate_count+row];
					solution_string = candidates[row].Titles[focus_problem] + "  ";
					if (focus_preference > 5) {
						for (ii=0; ii<focus_preference-5; ii ++) { solution_string += '+'; }
					}
					if ((focus_preference < 5) && (focus_preference != 0)) {
						for (ii=0; ii<5-focus_preference; ii ++) { solution_string += '-'; }
					}
					$(this).text(solution_string);
					$(".page_type").text("Proposals and Solutions");
					$( this ).css("font-weight", "normal");
					// $(this).css("background-color", colorarray[focus_preference]);

          console.log('blahyo '+focus_preference);
          if (focus_preference > 5) {
            $(elm).removeClass('danger');
            $(elm).addClass('success');
          } else if (focus_preference < 5 && focus_preference != 0) {
            $(elm).removeClass('success');
            $(elm).addClass('danger');
          }

				} else if ((row == 0) && (focus_page == 3)) {
					$(this).html(candidates[focus_politician].Summaries[focus_problem]);
					$(".page_type").text(candidates[focus_politician].Titles[focus_problem]);
					$( this ).css("font-weight", "normal");
				} else if ((row == 1) && (focus_page == 3)) {
					$(this).text("***");
					$( this ).css("font-weight", "normal");
				} else if ((row == 2) && (focus_page == 3)) {
					$(this).html(candidates[focus_politician].Proposals[focus_problem]);
					$( this ).css("font-weight", "normal");
				} else {
					$(this).text(" ");
				}
				// if ((row < candidate_count) && (focus_page == 1)) {
        //   console.log('ho');
				// 	$(this).css("background-color", "#E0E0d1");
				// }
				// if ((row < candidate_count) && (focus_page == 3)) {
        //   console.log('hey');
				// 	$(this).css("background-color", "#E0E0d1");
				// }
			}
			if (col == 2) {
				if ((row < poll.ProblemCount) && (focus_page == 1)) {
					$(this).html("<span class='emoji clickable'>&#x2b07;</span>");
				} else if ((row < candidate_count) && (focus_page == 2)) {
					$(this).html("<span class='emoji clickable'>&#x1F44E;</span>");
				} else {
					$(this).text(" ");
				}
			}
			loop ++;
		});
   	};

    $.fn.updatepage();
    $.fn.updateaction = function(){
		if (focus_page == 0) {
			if (poll.ProblemCount == 0) {
        $(".actiontext").html(page_one_first.text);
				$(".actiondiv").html(page_one_first.button);
			} else if (poll.ProblemCount < poll.Problems.length) {
        $(".actiontext").html(page_one_more.text);
				$(".actiondiv").html(page_one_more.button);
			} else {
        $(".actiontext").html(page_one_done.text);
				$(".actiondiv").html(page_one_done.button);
      }
		}
		if (focus_page == 1) {
      $(".actiontext").html(page_two.text);
			$(".actiondiv").html(page_two.button);
		}
		if (focus_page == 2) {
      $(".actiontext").html(page_three.text);
			$(".actiondiv").html(page_three.button);
		}
		if (focus_page == 3) {
      $(".actiontext").html(page_four.text);
			$(".actiondiv").html(page_four.button);
		}
//		$('.acctiondiv').css({left:'50%',margin:'-'+($('.acctiondiv').height() / 2)+'px 0 0 -'+($('.acctiondiv').width() / 2)+'px'});
//		$(".completion").text(poll.Completed.toString() + " of " + race.total.toString());
    };


    $.fn.updaterankings = function(){
		for (ii=0; ii<candidate_count; ii++) {
			var score = 0;
			for (jj=0; jj<poll.Problems.length; jj++) {
				if (self.Preference[jj*candidate_count+ii] != 0) {
					score += (self.Preference[jj*candidate_count+ii] - 5) * ((poll.ProblemLimit * 2)  - self.Priority[jj]);
				}
			}
			self.Scores[ii] = score;
			for (jj = ii; jj > 0; jj--)	{
				if (self.Scores[self.Rank[jj]] < self.Scores[self.Rank[jj-1]])
					break;
				var temp = self.Rank[jj];
				self.Rank[jj] = self.Rank[jj-1];
				self.Rank[jj-1] = temp;
			}
		}

//		$(".completion").text(race.completed.toString() + " of " + race.total.toString());
    };


    $(".actiondiv").click(function(){
		if (focus_page == 0) {
			if (poll.ProblemCount < poll.Problems.length) {
				poll.ProblemCount ++;
			}
			focus_page = 1;
		} else {
			if (focus_page == 1) 	{
				focus_page = 0;
				$.fn.updaterankings();
			}
			if (focus_page == 2)
				focus_page = 1;
			if (focus_page == 3)
				focus_page = 2;
        }
	    $.fn.updatepage();
	    $.fn.updateaction();
	});
    $.fn.updateaction();


    $("td").click(function(){
		var thisobject = this;
		var	loop = 0;
		var row = 0;
		var col = 0;
		$(".table_cell").each(function( index, elm ){
			row = parseInt((loop / 3).toString());
			col = loop % 3;
			if (this == thisobject){
				focus_row = row;
				focus_col = col;
				if ((focus_page == 2) && (focus_col == 1) && (focus_row < candidates.length)) {
					focus_page = 3;
					focus_politician = focus_row;
				}
				if ((focus_page == 1) && (focus_col == 1) && (focus_row < poll.Problems.length)) {
					focus_page = 2;
					focus_problem = self.Priority[focus_row];
				}
				if ((focus_page == 0) && (focus_col == 1) && (focus_row < candidates.length)) {
//					self.Priority[0] = race.politicians[self.Rank[focus_row]].ppriority[0];
//					self.Priority[1] = race.politicians[self.Rank[focus_row]].ppriority[1];
//					self.Priority[2] = race.politicians[self.Rank[focus_row]].ppriority[2];
//					self.Priority[3] = race.politicians[self.Rank[focus_row]].ppriority[3];
					focus_page = 1;
				}
				if ((focus_page == 2) && (focus_col == 0) && (focus_row < candidate_count)) {
					if (self.Preference[focus_problem*candidate_count+focus_row] == 0) {
						self.Preference[focus_problem*candidate_count+focus_row] = 4;
						self.Complete[focus_problem] ++ ;
					}
					if (	self.Preference[focus_problem*candidate_count+focus_row] < (colorarray.length-1)){
						self.Preference[focus_problem*candidate_count+focus_row] ++;
					}
				}
				if ((focus_page == 2) && (focus_col == 2) && (focus_row < candidate_count)) {
					if (self.Preference[focus_problem*candidate_count+focus_row] == 0) {
						self.Preference[focus_problem*candidate_count+focus_row] = 6;
						self.Complete[focus_problem] ++ ;
					}
					if (	self.Preference[focus_problem*candidate_count+focus_row] > 1) {
						self.Preference[focus_problem*candidate_count+focus_row] --;
					}
				}

				if ((focus_page == 1) && (focus_col == 0) && (focus_row > 0)) {
					var temp = self.Priority[focus_row-1];
					self.Priority[focus_row-1] = self.Priority[focus_row];
					self.Priority[focus_row] = temp;
				}

				if ((focus_page == 1) && (focus_col == 2) && (focus_row < (poll.Problems.length-1))) {
					var temp = self.Priority[focus_row+1];
					self.Priority[focus_row+1] = self.Priority[focus_row];
					self.Priority[focus_row] = temp;
				}
			    $.fn.updatepage();
			    $.fn.updateaction();
				return false;
			}
			loop ++;
		});
	});


	// $("td").mouseover(function(){
	// 	var thisobject = this;
	// 	var	loop = 0;
	// 	var row = 0;
	// 	var col = 0;
	// 	if (focus_page == 3) {
	// 		return;
	// 	}
	// 	$(".table_cell").each(function( index ){
	// 		row = parseInt((loop / 3).toString());
	// 		col = loop % 3;
	// 		if ((row == focus_row) && (col == focus_col) && (col == 1)) {
	// 			$( this ).css("font-weight", "normal");
	// 		}
	// 		loop ++;
	// 	});
	// 	loop = 0;
	// 	$(".table_cell").each(function( index ){
	// 		row = parseInt((loop / 3).toString());
	// 		col = loop % 3;
	// 		if (this == thisobject) {
	// 			focus_row = row;
	// 			focus_col = 1;
	// 			loop = 0;
	// 			$(".table_cell").each(function( index ){
	// 				row = parseInt((loop / 3).toString());
	// 				col = loop % 3;
	// 				if ((row == focus_row) && (col == focus_col)) {
	// 					$( this ).css("font-weight", "bold");
	// 					return false;
	// 				}
	// 				loop ++;
	// 			});
	// 		}
	// 		loop ++;
	// 	});
	// });


});
