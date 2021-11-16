import { useState, useEffect} from 'react'; 
import firebase from 'firebase';
import '../components/fire';
import { useSnackbar } from 'notistack';
import {Todo, RepeatTodo,TodoType} from '../types/type'

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const convertDate = (d : any)=>{
	if (d == null){return null;}
	const ret = new Date(0);
	ret.setSeconds(d.seconds);
	ret.setMilliseconds(d.nanoseconds / 1000);
	return ret;
}

const useTodo = () => {
	const mytodo : Todo[] = []
	const myRepeat : RepeatTodo[] = []
	const { enqueueSnackbar } = useSnackbar();
	const [todoList, setTodoList] = useState(mytodo);
	const [repeatList, setRepeatList] = useState(myRepeat)
	const [isLoading, setIsLoading] = useState(false);
	const [displayMode, setDisplayMode] = useState<TodoType>("Working");
	const [inboxCount, setInboxCount] = useState(0);
	const [inboxSoonCount, setInboxSoonCount] = useState(0);
	const [workingCount, setWorkingCount] = useState(0);
	const [workingSoonCount, setWorkingSoonCount] = useState(0);
	
	const db = firebase.firestore(); // 追記

	useEffect(()=>{
		//リアルタイムで情報更新
		db.collection('todoList')
		.onSnapshot(function(snapshot) {
			setIsLoading(true);
			let newTodoList : Todo[] = [];
			snapshot.forEach(function(doc) {

				newTodoList.push({
					id: doc.id,
					title: doc.data().title,
					completed: doc.data().completed,
					due: convertDate(doc.data().due)!,
					start: convertDate(doc.data().start),
					subTasks: doc.data().subTasks,
					note: doc.data().note
				});
			});
			setTodoList(newTodoList);
			setIsLoading(false);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[db])

	useEffect(()=>{
		let newInboxCount = 0;
			let newInboxSoonCount = 0;
			let newWorkingCount = 0;
			let newWorkingSoonCount = 0;
			todoList.forEach((todo)=>{
				if(!todo.completed){
					if(todo.start == null){
						if(Math.floor((todo.due.getTime()-new Date().getTime())/1000/60/60) < 24){
							newInboxSoonCount++;
						}else{
							newInboxCount++;
						}
					}else if(Math.floor((todo.start.getTime()-new Date().getTime())/1000/60/60) < 0 ){
						if(Math.floor((todo.due.getTime()-new Date().getTime())/1000/60/60) < 24){
							newWorkingSoonCount++;
						}else{
							newWorkingCount++;
						}	
					}
				}
			});
			setInboxCount(newInboxCount);
			setInboxSoonCount(newInboxSoonCount);
			setWorkingCount(newWorkingCount);
			setWorkingSoonCount(newWorkingSoonCount);
	},[todoList]);

	useEffect(()=>{
	db.collection('repeatList')
		.onSnapshot(function(snapshot) {
			setIsLoading(true);
			let newRepeatList: RepeatTodo[] = [];
			snapshot.forEach(function(doc) {
				newRepeatList.push({
					id: doc.id,
					title: doc.data().title,
					due: convertDate(doc.data().due)!,
					day: doc.data().day,
					subTasks: doc.data().subTasks,
					note: doc.data().note
				});
			});
			setRepeatList(newRepeatList);
			setIsLoading(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[db])

	useEffect(() => {
		setIsLoading(true);
		auth.signInWithPopup(provider).then(result=>{
			enqueueSnackbar('ログインに成功しました。',{variant:'success'});
			setIsLoading(false);
		})
		.catch(err =>{
			enqueueSnackbar('ログインに失敗しました。',{variant:'error'});
			setIsLoading(false);
		})
	},[db, enqueueSnackbar])
	
	const addTodo = (todo:Todo,hidden=false) => {
		const ob = {
			title: todo.title,
			completed: todo.completed,
			due: todo.due,
			start: todo.start,
			subTasks: todo.subTasks,
			note: todo.note
		}
		db.collection('todoList').add(ob).then(ref=>{
			if(!hidden)enqueueSnackbar('ToDoを正常に作成しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('ToDoの作成に失敗しました。',{variant:'error'});
		});
	}

	const editTodo = (todo:Todo,hidden=false) => {
		const ob = {
			title: todo.title,
			completed: todo.completed,
			due: todo.due,
			start: todo.start,
			subTasks: todo.subTasks,
			note: todo.note
		}
		db.collection('todoList').doc(todo.id).update(ob).then(ref=>{
			if(!hidden)enqueueSnackbar('ToDoを正常に更新しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('ToDoの更新に失敗しました。',{variant:'error'});
		});
	}

	const changeCompletedTodo = (todo:Todo,hidden=false) => {
		if(todo.completed){
			db.collection('todoList').doc(todo.id).update({completed: false}).then(ref=>{
				if(!hidden)enqueueSnackbar('ToDoを未完了に変更しました。',{variant:'success'});
			})
			.catch(err =>{
				if(!hidden)enqueueSnackbar('ToDoの更新に失敗しました。',{variant:'error'});
			});
		}else{
			db.collection('todoList').doc(todo.id).update({completed: true}).then(ref=>{
				if(!hidden)enqueueSnackbar('ToDoを完了しました。',{variant:'success'});
			})
			.catch(err =>{
				if(!hidden)enqueueSnackbar('ToDoの更新に失敗しました。',{variant:'error'});
			});
		}
	}

	const deleteTodo = (todo:Todo,hidden=false) => {
		db.collection('todoList').doc(todo.id).delete().then(()=>{
			if(!hidden)enqueueSnackbar('ToDoを正常に削除しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('ToDoの削除に失敗しました。',{variant:'error'});
		});
	}

	const addRepeat = (repeat:RepeatTodo,hidden=false)=>{
		const ob = {
			title: repeat.title,
			due: repeat.due,
			day: repeat.day,
			subTasks: repeat.subTasks,
			note: repeat.note
		}
		db.collection('repeatList').add(ob).then(ref=>{
			if(!hidden)enqueueSnackbar('繰り返しToDoを正常に作成しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('繰り返しToDoの作成に失敗しました。',{variant:'error'});
		});
	}

	const editRepeat = (repeat:RepeatTodo,hidden=false) => {
		const ob = {
			title: repeat.title,
			due: repeat.due,
			day: repeat.day,
			subTasks: repeat.subTasks,
			note: repeat.note
		}
		db.collection('repeatList').doc(repeat.id).update(ob).then(ref=>{
			if(!hidden)enqueueSnackbar('繰り返しToDoを正常に更新しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('繰り返しToDoの更新に失敗しました。',{variant:'error'});
		});
	}

	const deleteRepeat = (repeat:RepeatTodo,hidden=false) => {
		db.collection('repeatList').doc(repeat.id).delete().then(()=>{
			if(!hidden)enqueueSnackbar('繰り返しToDoを正常に削除しました。',{variant:'success'});
		})
		.catch(err =>{
			if(!hidden)enqueueSnackbar('繰り返しToDoの削除に失敗しました。',{variant:'error'});
		});
	}

	return{
		todoList,
		setTodoList,
		repeatList,
		setRepeatList,
		isLoading,
		addTodo,
		editTodo,
		deleteTodo,
		changeCompletedTodo,
		addRepeat,
		editRepeat,
		deleteRepeat,
		displayMode,
		setDisplayMode,
		inboxCount,
		inboxSoonCount,
		workingCount,
		workingSoonCount,
		setInboxCount,
		setInboxSoonCount,
		setWorkingCount,
		setWorkingSoonCount
	}
}

export default useTodo;