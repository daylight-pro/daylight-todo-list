import React, { useEffect } from 'react';
import {useState } from 'react'
import {AppBar,Toolbar,IconButton, Typography,Button,Dialog,Slide,TextField,List,ListItem,ListItemText,Box,Divider,Collapse} from '@mui/material'
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {TransitionProps} from '@mui/material/transitions'
import Yamde from 'yamde';
import {Todo,SubTask} from '../../types/type'

const useStyles = makeStyles((theme)=>({
	title:{
		 marginLeft: 2,
   		 flex: 1,	
	},
	appBar: {
		position: 'relative',
	},
	nested: {
  	  paddingLeft: 5,
  	},
}));

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any,any>;
	}, 
	ref : React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type EditTodoDialogPropsType = {
	todo : Todo|null,
	setTodo : React.Dispatch<React.SetStateAction<Todo | null>>,
	edit : (todo: Todo, hidden?: boolean) => void,
	delete : (todo: Todo, hidden?: boolean) => void 
}

function EditTodoDialog(props:EditTodoDialogPropsType){
	const classes = useStyles();
	const [title,setTitle] = useState("");
	const [note,setNote] = useState("");
	const [due,setDue] = useState(new Date());
	const [start,setStart] = useState<Date|null>(null);
	const [subTasks,setSubTasks] = useState<SubTask[]>([])
	useEffect(()=>{
		if(props.todo != null){
			setTitle(props.todo.title);
			setDue(props.todo.due);
			setNote(props.todo.note);
			setStart(props.todo.start);
			setSubTasks(props.todo.subTasks);
		}
	},[props.todo]);
	const handleClose = ()=>{
		props.setTodo(null);
	};

	const handleSave = ()=>{
		props.edit({
			title: title,
			completed: props.todo!.completed,
			due: due,
			start: start,
			subTasks:subTasks,
			note: note,
			id: props.todo!.id
		})
		handleClose();
	}

	const handleDelete = ()=>{
		props.delete({
			title: title,
			completed: props.todo!.completed,
			due: due,
			start: start,
			subTasks: subTasks,
			note: note,
			id: props.todo!.id
		})
		handleClose();
	}

	const handleInsertSubTask = (idx:number) =>{
		const newSubTask = {
			title:"",
			completed:false,
		};
		let newSubTaskList = [...subTasks];
		newSubTaskList.splice(idx+1,0,newSubTask);
		setSubTasks(newSubTaskList);
	}

	const handleStart = (date : Date | null)=>{
		if (date != null){
			date.setSeconds(0);
			date.setMinutes(0);
			date.setHours(0);
			date.setMilliseconds(0);
			setStart(date);
		}else{
			setStart(null);
		}
	};

	const handleAddSubTasks = ()=>{
		const newSubTask = {
			title:"",
			completed:false,
		};
		let newSubTaskList = [...subTasks, newSubTask];
		setSubTasks(newSubTaskList);
	}

	const handleDeleteSubTasks = (index:number)=>{
		const newSubTasks = [...subTasks];
		newSubTasks.splice(index,1);
		setSubTasks(newSubTasks);
	}

	const handleChangeSubTasks = (title:string,idx:number)=>{
		subTasks[idx] = {
			title:title,
			completed:subTasks[idx].completed
		}
		setSubTasks([...subTasks]);
	}

	return(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
		<Dialog fullScreen open={props.todo!=null} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
			<Toolbar>
				<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
				<CloseIcon />
				</IconButton>
				<Typography variant="h6" className={classes.title}>
				Edit Todo
				</Typography>
				<Box mr={3}>
				<Button color="secondary" variant="outlined" onClick={handleDelete}>
				Delete
				</Button>
				</Box>
				<Button autoFocus color="inherit" variant="outlined" onClick={handleSave}>
				Save
				</Button>
			</Toolbar>
			</AppBar>
			<List sx={{mt:7}}>
				 <ListItem alignItems="flex-start" key={"title"} >

					<ListItemText
						primary={
							<React.Fragment>
							<Box display="inline" mr={5}>
							<TextField label="Title" style={{width: 350}} variant="filled" value={title} onChange={(event) => setTitle(event.target.value)}></TextField>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>

							<Box display="inline" mr={5}>
							      <DateTimePicker
									label="Due"
									value={due}
									onChange={(date)=>{setDue(date!);}}
									renderInput={(params) => <TextField sx={{width:'230px'}} {...params} />}
								/>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mt={1} mr={5}>
								<DesktopDatePicker
								label="Start"
								value={start}
								onChange={handleStart}
								renderInput={(params) => <TextField sx={{width:'150px'}} {...params} />}
								/>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mr={5}>
								<Button variant="outlined" disabled={start==null} color="secondary" onClick={()=>{setStart(null)}}>
									Reset Start
								</Button>
							</Box>
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider component="li"/>
				<ListItem alignItems="flex-start" key={"Note"} >

					<ListItemText
						primary={
							<React.Fragment>
							<Box>
							      <Yamde value={note} handler={setNote} theme="dark" />
							</Box>
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider component="li"/>
				<ListItem>
					<ListItemText
						primary={
							"Sub Tasks"
						}
					/>
				</ListItem>
				<Collapse in={true} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{subTasks.map((sub,idx)=>{
							return(
							<ListItem className={classes.nested} key={idx} >
							<TextField label="Title" variant="filled" fullWidth value={sub.title} onChange={(event) => handleChangeSubTasks(event.target.value,idx)} onKeyDown={e => {if (e.key === "Enter") {handleInsertSubTask(idx)}}}/>
							<Box ml={2}>
								<Button variant="outlined" color="secondary" onClick={(e)=>{handleDeleteSubTasks(idx)}}>
									Delete
								</Button>
							</Box>
							</ListItem>
							)
						})
						}
						<ListItem className={classes.nested} key="AddNewSub" >
							<Button variant="outlined" color="primary" onClick={handleAddSubTasks}>
								Add Sub Tasks
							</Button>
						</ListItem>
					</List>
				</Collapse>
			</List>
		</Dialog>
		</LocalizationProvider>
	);
}

export default EditTodoDialog;