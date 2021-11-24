export type SubTask = {
	completed: boolean,
	title: string
}

export type Todo = {
	id:string,
	title: string,
	completed: boolean,
	due: Date,
	start: Date | null,
	subTasks: SubTask[],
	note: string
}

export type RepeatTodo = {
	id:string,
	title: string,
	due: Date,
	day: number,
	subTasks: SubTask[],
	note: string
}

export type TodoType = "Working"|"All"|"Inbox"|"Later"|"Repeat"|"Home";