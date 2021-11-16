import React, { useEffect } from 'react';
import {useState } from 'react'
import {AppBar,Toolbar,IconButton, Typography,Button,Dialog,Slide,TextField,List,ListItem,ListItemText,Box,Divider,FormControl,Collapse} from '@mui/material'
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Yamde from 'yamde';
import {TransitionProps} from '@mui/material/transitions'
import {RepeatTodo,SubTask} from '../../types/type'

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

type EditRepeatDialogPropsType = {
	repeat: RepeatTodo | null,
	setRepeat: React.Dispatch<React.SetStateAction<RepeatTodo | null>>,
	edit: (repeat: RepeatTodo, hidden?: boolean) => void,
	delete: (repeat: RepeatTodo, hidden?: boolean) => void
}

function EditRepeatDialog(props: EditRepeatDialogPropsType){
	const classes = useStyles();
	const [title,setTitle] = useState("");
	const [note,setNote] = useState("");
	const [due,setDue] = useState(new Date());
	const [day,setDay] = useState(0);
	const [subTasks,setSubTasks] = useState<SubTask[]>([]);
	useEffect(()=>{
		if(props.repeat != null){
			setTitle(props.repeat.title);
			setDue(props.repeat.due);
			setNote(props.repeat.note);
			setDay(props.repeat.day);
			setSubTasks(props.repeat.subTasks);
		}
	},[props.repeat]);
	const handleClose = ()=>{
		props.setRepeat(null);
	};

	const handleSave = ()=>{
		props.edit({
			title: title,
			due: due,
			day: isNaN(day)?7:day,
			subTasks:subTasks,
			note: note,
			id: props.repeat!.id
		})
		handleClose();
	}

	const handleDelete = ()=>{
		props.delete({
			title: title,
			due: due,
			day: day,
			subTasks:[],
			note: note,
			id: props.repeat!.id
		})
		handleClose();
	}

	const handleInsertSubTask = (idx: number) =>{
		const newSubTask = {
			title:"",
			completed:false,
		};
		let newSubTaskList = [...subTasks];
		newSubTaskList.splice(idx+1,0,newSubTask);
		setSubTasks(newSubTaskList);
	}

	const handleAddSubTasks = ()=>{
		const newSubTask = {
			title:"",
			completed:false,
		};
		let newSubTaskList = [...subTasks, newSubTask];
		setSubTasks(newSubTaskList);
	}

	const handleDeleteSubTasks = (index: number)=>{
		const newSubTasks = [...subTasks];
		newSubTasks.splice(index,1);
		setSubTasks(newSubTasks);
	}

	const handleChangeSubTasks = (title: string,idx :number)=>{
		subTasks[idx] = {
			title:title,
			completed:subTasks[idx].completed
		}
		setSubTasks([...subTasks]);
	}

	return(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
		<Dialog fullScreen open={props.repeat!=null} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
			<Toolbar>
				<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
				<CloseIcon />
				</IconButton>
				<Typography variant="h6" className={classes.title}>
				Edit Repeat Todo
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
							<FormControl>
								<TextField label="Title" style={{width: 350}} variant="outlined" value={title} onChange={(event) => setTitle(event.target.value)}></TextField>
							</FormControl>
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
							<Box display="inline" mr={5}>
								<FormControl>
									<TextField
										label="Day"
										type="number"
										id="day"
										variant="outlined"
										value={day}
										onChange={(event)=>setDay(parseInt(event.target.value))}
									/>
								</FormControl>
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
							<TextField label="Title" variant="outlined" fullWidth value={sub.title} onChange={(event) => handleChangeSubTasks(event.target.value,idx)} onKeyDown={e => {if (e.key === "Enter") {handleInsertSubTask(idx)}}}></TextField>
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

export default EditRepeatDialog;