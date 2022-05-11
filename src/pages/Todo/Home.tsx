import React from 'react';
import {Todo} from '../../types/type'
import {Box} from '@mui/material';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import WorkingColumn from '../../components/workingColumn';
import InboxColumn from '../../components/inboxColumn';
import LaterColumn from '../../components/laterColumn';
import CompletedColumn from '../../components/completedColumn';
import myClasses from '../../materialui/myClasses';
import Util from '../../Util'
import EditColumn from '../../components/editColumn';


type HomePropsType = {
	todoList : Todo[],
	edit : (todo: Todo, hidden?: boolean) => void,
	setEditDialog: React.Dispatch<React.SetStateAction<Todo>>
}


function Home(props:HomePropsType){

	const classes = myClasses.useStyles();


	const handleOnDragEnd = (result:DropResult)=>{
		const todoList : Todo[] = [];
		const curTodoList : Todo[][] = [];
		for(let i = 0; i < 7;i++){
			curTodoList.push([]);
		}
		const laterTodoList : Todo[] = [];
		props.todoList.forEach((todo)=>{
			if(todo.start != null){
				const days = Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60/24);
				if(days>=0){
					if(days < 7){
						curTodoList[days].push(todo);
					}else{
						laterTodoList.push(todo);
					}
				}
			}
		});
		curTodoList.forEach((innerTodoList)=>{
			innerTodoList.sort((a,b)=>{
					return a.due.getTime() - b.due.getTime();
			});
		});
		laterTodoList.sort((a,b)=>{
			if(a.start!.getTime() === b.start!.getTime()) return a.due.getTime() - b.due.getTime();
			return a.start!.getTime() - b.start!.getTime();
		});
		curTodoList.forEach((innerTodoList,ind)=>{
			const date = new Date();
			date.setDate(date.getDate() + 1 + ind);
			todoList.push({title:""+(ind+1)+" Days Before ["+Util.printDate(date)+"]",start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader",color:"red"})
			innerTodoList.forEach((todo)=>{
					todoList.push(todo)
			});
		});
		todoList.push({title:"Later",start:new Date(),due:new Date(),id:"",completed:false,subTasks:[],note:"DayHeader",color:"red"})
		laterTodoList.forEach((todo)=>{
			todoList.push(todo)
		});
		const headerInd:number[] = [];
		todoList.forEach((todo,index)=>{
			if(todo.note==="DayHeader"){
				headerInd.push(index)
			}
		});
		const {draggableId,source,destination} = result
		if(!destination){
			return;
		}

		if(	destination.droppableId === source.droppableId &&
			destination.index === source.index) { 
      		return;
    	}
		const todo = props.todoList.find(todo=>todo.id===draggableId);
		if(!todo){
			return;
		}
		if(destination.droppableId === "working"){
			const newStart = new Date();
			newStart.setHours(0);
			newStart.setMinutes(0);
			newStart.setSeconds(0);
			newStart.setMilliseconds(0);
			props.edit({
				id: todo.id,
				title: todo.title,
				note: todo.note,
				due: todo.due,
				completed: false,
				subTasks: todo.subTasks,
				start: newStart,
				color: todo.color
			},false);
		}else if(destination.droppableId === "inbox"){
			props.edit({
				id: todo.id,
				title: todo.title,
				note: todo.note,
				due: todo.due,
				completed: false,
				subTasks: todo.subTasks,
				start: null,
				color: todo.color
			},false);
		}else if(destination.droppableId === "later"){
			let index = -1;
			headerInd.forEach((header,ind) => {
				let h = header;
				if(source.droppableId === "later" && h > source.index && h <= destination.index)h-=1;
				console.log(h+" "+destination.index)
				if(h >= destination.index){
					if(index === -1)index = ind-1;
				}
			});
			if(index === -1)return;
			const newStart = new Date();
			newStart.setHours(0);
			newStart.setMinutes(0);
			newStart.setSeconds(0);
			newStart.setMilliseconds(0);
			newStart.setDate(newStart.getDate() + 1 + index);
			console.log(newStart);
			props.edit({
				id: todo.id,
				title: todo.title,
				note: todo.note,
				due: todo.due,
				completed: false,
				subTasks: todo.subTasks,
				start: newStart,
				color: todo.color
			},false);
		}else if(destination.droppableId === "completed"){
			props.edit({
				id: todo.id,
				title: todo.title,
				note: todo.note,
				due: todo.due,
				completed: true,
				subTasks: todo.subTasks,
				start: todo.start,
				color: todo.color
			},false);
		}else if(destination.droppableId === "edit"){
			let todo : Todo|null = null;
			props.todoList.forEach(t=>{
				if(t.id === draggableId){
					todo = t;
				}
			})
			if(todo){
				props.setEditDialog(todo);
			}
		}
	}
	return(
		<DragDropContext
			onDragEnd={handleOnDragEnd}
		>
			<Box className={classes.columnContainer} sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', minWidth:"200px", flexGrow: 1 }}>
				<InboxColumn todoList={props.todoList}/>
				<LaterColumn todoList={props.todoList}/>
				<WorkingColumn todoList={props.todoList}/>
				<Box>
					<CompletedColumn todoList={props.todoList}/>
					<EditColumn/>
				</Box>
			</Box>
		</DragDropContext>
	);
}

export default Home;