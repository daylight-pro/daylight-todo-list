import AllTodo from './pages/Todo/AllTodo';
import WorkingTodo from './pages/Todo/WorkingTodo';
import InboxTodo from './pages/Todo/InboxTodo';
import LaterTodo from './pages/Todo/LaterTodo';
import Repeat from './pages/Todo/Repeat';
import Home from './pages/Todo/Home';
import AddTodoDialog from './components/dialogs/addTodoDialog'
import EditTodoDialog from './components/dialogs/editTodoDialog';
import AddRepeatDialog from './components/dialogs/addRepeatDialog';
import EditRepeatDialog from './components/dialogs/editRepeatDialog';
import './App.css'
import { makeStyles } from '@mui/styles';
import useTodo from './hooks/useTodo';
import { Fab, CircularProgress, AppBar, Typography,IconButton,Toolbar,Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react'; 
import DrawerMenuList from './components/drawerMenuList';
import { interval } from 'rxjs'
import {Todo,RepeatTodo,TodoType} from './types/type'

const useStyles = makeStyles((theme)=> ({
	icon:{
		borderRadius: "50%"
	}
}));

function App() {
	const state = useTodo();
	const classes = useStyles();

	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [isOpenAddTodoDialog,setIsOpenAddTodoDialog] = useState(false);
	const [isOpenAddRepeatDialog,setIsOpenAddRepeatDialog] = useState(false);
	const [editDialogTodo,setEditDialogTodo] = useState<Todo | null>(null);
	const [editDialogRepeat,setEditDialogRepeat] = useState<RepeatTodo | null>(null);
	const [isOpenSubTasks, setIsOpenSubTasks] = useState<{[key:string]:boolean}>({});
	const [isOpenRepeatSubTasks, setIsOpenRepeatSubTasks] = useState<{[key:string]:boolean}>({});

	useEffect(() => {
		const tick = (()=>{	
			const newTodoList : Todo[] = [];
			state.todoList.forEach((todo)=>{
				newTodoList.push(todo);
			});
			state.setTodoList(newTodoList);
		});
		const subscription = interval(10000).subscribe(() => {
			tick();
		})
		return () => {
			subscription.unsubscribe();
		}
	}, [state])

	useEffect(() => {
		const tick = (()=>{	
			("tick");
			const newRepeatList : RepeatTodo[] = [];
			state.repeatList.forEach((repeat)=>{
				newRepeatList.push(repeat);
			});
			state.setRepeatList(newRepeatList);
		});
		const subscription = interval(10000).subscribe(() => {
			tick();
		})
		return () => {
			subscription.unsubscribe();
		}
	}, [state])

	useEffect(()=>{
		 const ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('iphone') > 0 || ua.indexOf('ipod') > 0 || (ua.indexOf('android') > 0 && ua.indexOf('mobile') > 0)) {
            state.setDisplayMode("Working");
        } else {
            state.setDisplayMode("Home");
        }
	});

	const changeDisplay = ((info:TodoType)=>{
		setIsOpenDrawer(false);
		state.setDisplayMode(info);
	})

	return (
		<div className="App">
			<AppBar position="static">
				<Toolbar>
				<IconButton edge="start" color="inherit" aria-label="menu" onClick={()=>setIsOpenDrawer(true)}>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6">
				Daylight Todo List
				</Typography>
				</Toolbar>
			</AppBar>
			<Drawer open={isOpenDrawer} onClose={()=>setIsOpenDrawer(false)}>
				<DrawerMenuList mode={state.displayMode} changed={changeDisplay} inboxCount={state.inboxCount} inboxSoonCount={state.inboxSoonCount} workingCount={state.workingCount} workingSoonCount={state.workingSoonCount}/>
			</Drawer>
			<AddTodoDialog open={isOpenAddTodoDialog} setIsOpenAddTodoDialog={setIsOpenAddTodoDialog} save={state.addTodo}/>
			<EditTodoDialog todo={editDialogTodo} setTodo={setEditDialogTodo} edit={state.editTodo} delete={state.deleteTodo}/>
			<AddRepeatDialog open={isOpenAddRepeatDialog} setIsOpenAddRepeatDialog={setIsOpenAddRepeatDialog} save={state.addRepeat}/>
			<EditRepeatDialog repeat={editDialogRepeat} setRepeat={setEditDialogRepeat} edit={state.editRepeat} delete={state.deleteRepeat}/>
			{state.isLoading?
			<CircularProgress />
			:
				<div>
				{	state.displayMode === "All" && 
					<AllTodo
						todoList = {state.todoList}
						changeCompleted = {state.changeCompletedTodo}
						todoClicked = {setEditDialogTodo}
						isOpenSubtasks = {isOpenSubTasks}
						setIsOpenSubtasks = {setIsOpenSubTasks}
						edit={state.editTodo}
					/>
				}
				{
					state.displayMode === "Working" &&
					<WorkingTodo
						todoList = {state.todoList}
						changeCompleted = {state.changeCompletedTodo}
						todoClicked = {setEditDialogTodo}
						isOpenSubtasks = {isOpenSubTasks}
						setIsOpenSubtasks = {setIsOpenSubTasks}
						edit={state.editTodo}
					/>
				}
				{
					state.displayMode === "Inbox" &&
					<InboxTodo
						todoList = {state.todoList}
						changeCompleted = {state.changeCompletedTodo}
						todoClicked = {setEditDialogTodo}
						isOpenSubtasks = {isOpenSubTasks}
						setIsOpenSubtasks = {setIsOpenSubTasks}
						edit={state.editTodo}
					/>
				}
				{
					state.displayMode === "Later" &&
					<LaterTodo
						todoList = {state.todoList}
						changeCompleted = {state.changeCompletedTodo}
						todoClicked = {setEditDialogTodo}
						isOpenSubtasks = {isOpenSubTasks}
						setIsOpenSubtasks = {setIsOpenSubTasks}
						edit={state.editTodo}
					/>
				}
				{
					state.displayMode === "Repeat" &&
					<Repeat
						repeatList = {state.repeatList}
						repeatClicked={setEditDialogRepeat}
						isOpenSubtasks = {isOpenRepeatSubTasks}
						setIsOpenSubtasks = {setIsOpenRepeatSubTasks}
						edit={state.editRepeat}
					/>
				}
				{
					state.displayMode === "Home" &&
					<Home
						todoList = {state.todoList}
						edit={state.editTodo}
						setEditDialog={setEditDialogTodo}
					/>
				}
				</div>
			}
			<Fab className={classes.icon} color="primary" aria-label="add" onClick={()=>{state.displayMode === "Repeat"?setIsOpenAddRepeatDialog(true):setIsOpenAddTodoDialog(true)}}>
				<AddIcon />
			</Fab>
		</div>
	);
};

export default App;