function renderTasks () {
	var tasks = JSON.parse(localStorage.getItem("tasks"));
	var tasksBlock = document.querySelector('.tasks');
	var submit = document.getElementById("submit");
	var editSubmit = document.getElementById("edit-submit");
	var removeSubmit = document.getElementById("remove-submit");
	tasksBlock.innerHTML = "";
	var status = "";

	for (var task in tasks) {
		if (!tasks[task].status) {
			status = "<button type='button' id = 'complete' class='btn btn-warning'>Not complete</button></div>";
		} else {
			status = "<button type='button' id = 'no-complete' class='btn btn-success'>Complete</button></div>";
		}

		tasksBlock.innerHTML = "<div id = '"+ task +"' class = 'task'><h1>"+ 
		tasks[task].title +"</h1><p>"+ tasks[task].comment +
		"</p><span id = 'edit' class='glyphicon glyphicon-pencil' aria-hidden='true'>"+
		"</span><span id = 'remove' class='glyphicon glyphicon-trash' aria-hidden='true'>"+
		"</span>" + status + tasksBlock.innerHTML;
	}

	submit.onclick = function (event) {
		event.preventDefault();
		var elems = document.querySelectorAll('.validate');
		var values = [];

		if (checkForm(elems)) {
			for (var i = 0; i < elems.length; i++) {
				values[elems[i].id] = elems[i].value;
			}
			createTask(values);
		} else {
			$('.notice').text('*Pleace fill all fields');
		}
	}

	document.onclick = function (event) {
		var action = event.target.id;
		var targetTask = event.target.parentNode;
		var taskId = targetTask.id;

		if (action == 'edit') {
			var title = targetTask.querySelector('h1').innerText;
			var comment = targetTask.querySelector('p').innerText;

			$('input#edit-title').val(title);
			$('textarea#edit-comment').text(comment);
			$('#editModal').modal('show');

			editSubmit.onclick = function (event) {
				event.preventDefault();
				editTask(taskId, $('input#edit-title').val(), $('textarea#edit-comment').val());
			}
		} else if (action == 'remove') {
			$('#removeModal').modal('show');
			removeSubmit.onclick = function () {
				delete tasks[taskId];
				editLocalStorage(tasks);
				$('#removeModal').modal('hide');
				renderTasks();
			}

		} else if (action == 'complete') {
			tasks[taskId].status = 1;
			editLocalStorage(tasks);
			renderTasks();

		} else if (action == 'no-complete') {
			tasks[taskId].status = 0;
			editLocalStorage(tasks);
			renderTasks();
		}
	}
}

function createTask (values) {
	var task = {};
	for (var i in values) {
		task[i] = values[i];
	}
	task["status"] = 0;
	task["created_at"] = Date.now();
	var id = ID();

	var tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks[id] = task;

	editLocalStorage(tasks);
	$('#myModal').modal('hide');
	renderTasks();
}

function editTask (id, title, comment) {
	if (title.length > 0 && comment.length > 0) {
		var tasks = JSON.parse(localStorage.getItem("tasks"));
		tasks[id]['title'] = title;
		tasks[id]['comment'] = comment;
		editLocalStorage(tasks);
		$('#editModal').modal('hide');
		renderTasks();
	} else {
		$('.notice').text('*Pleace fill all fields');
	}
}

function editLocalStorage (tasks) {
	var serialObj = JSON.stringify(tasks);
	localStorage.setItem("tasks", serialObj);
}

function ID () {
	return '_' + Math.random().toString(36).substr(2, 9);
}

function checkForm (elements) {
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].id == "title" && elements[i].value.length == 0) {
			return false;
		}

		if (elements[i].id == "comment" && elements[i].value.length == 0) {
			return false;
		}
	}
	return true;
}

renderTasks();
