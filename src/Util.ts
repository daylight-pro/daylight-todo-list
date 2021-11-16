import {Todo,RepeatTodo} from './types/type'

export default class Util{
	static dayOfWeekStr = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
	static zeroPadding(num:number,length:number){
   		return ('0000000000' + num).slice(-length);
	}
	static printDue(due: Date){
		return `${due.getFullYear()}/${this.zeroPadding(due.getMonth()+1,2)}/${this.zeroPadding(due.getDate(),2)}(${this.dayOfWeekStr[due.getDay()]}) ${this.zeroPadding(due.getHours(),2)}:${this.zeroPadding(due.getMinutes(),2)}`;
	}
	static printStart(start: Date){
		return `${start.getFullYear()}/${this.zeroPadding(start.getMonth()+1,2)}/${this.zeroPadding(start.getDate(),2)}(${this.dayOfWeekStr[start.getDay()]})`;
	}

	static printDate(date: Date){
		return `${date.getFullYear()}/${this.zeroPadding(date.getMonth()+1,2)}/${this.zeroPadding(date.getDate(),2)}(${this.dayOfWeekStr[date.getDay()]})`;
	}
	static canOpenDetail(todo:Todo|RepeatTodo){
		if(todo.subTasks.length !== 0)return true;
		if(todo.note !== null && todo.note !== "") return true;
		return false;
	}
	static isOpenDetail(todo:Todo | RepeatTodo, isOpenSubtasks:{ [key: string]: boolean; }){
		return isOpenSubtasks[todo.title] === true;
	}
}