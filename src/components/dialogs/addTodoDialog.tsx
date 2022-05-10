import React, { useEffect } from 'react';
import {useState } from 'react';
import {yellow,blue,green,orange,red} from '@mui/material/colors';
import {AppBar,Toolbar,IconButton, Typography,Button,Dialog,Slide,TextField,List,ListItem,ListItemText,Box,Divider,Collapse,Select,MenuItem,Avatar} from '@mui/material'
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {TransitionProps} from '@mui/material/transitions';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PageviewIcon from '@mui/icons-material/Pageview';
import PendingIcon from '@mui/icons-material/Pending';
import EditIcon from '@mui/icons-material/Edit';
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
	out:{
		paddingLeft: 2,
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

type AddTodoDialogPropsType = {
	open:boolean,
	setIsOpenAddTodoDialog: React.Dispatch<React.SetStateAction<boolean>>,
	save:(todo: Todo, hidden?: boolean) => void
}


function AddTodoDialog(props:AddTodoDialogPropsType){
	const classes = useStyles();
	const [title,setTitle] = useState("");
	const [note,setNote] = useState("");
	const [due,setDue] = useState(new Date());
	const [start,setStart] = useState<Date|null>(null);
	const [subTasks,setSubTasks] = useState<SubTask[]>([]);
	const [color,setColor] = useState("red")
	useEffect(()=>{
		if(props.open){
			setTitle("");
			setDue(new Date());
			setNote("");
			setStart(null);
			setSubTasks([]);
			setColor("red")
		}
	},[props.open]);
	const handleClose = ()=>{
		props.setIsOpenAddTodoDialog(false);
	};
	const handleSave = ()=>{
		props.save({
			id:"",
			title: title,
			completed: false,
			due: due,
			start: start,
			subTasks:subTasks,
			note: note,
			color: color
		});
		handleClose();
	};

	const handleAddSubTasks = ()=>{
		const newSubTask = {
			title:"",
			completed:false,
		};
		let newSubTaskList = [...subTasks, newSubTask];
		setSubTasks(newSubTaskList);
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

	const handleStart = (date: Date | null)=>{
		if(date == null){
			setStart(null)
		}else{
			date.setSeconds(0);
			date.setMinutes(0);
			date.setHours(0);
			date.setMilliseconds(0);
			setStart(date);
		}
	};

	return(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
		<Dialog fullScreen open={props.open} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
			<Toolbar>
				<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
				<CloseIcon />
				</IconButton>
				<Typography variant="h6" className={classes.title}>
				Create New Todo
				</Typography>
				<Button autoFocus color="inherit" variant="outlined" onClick={handleSave}>
				Save
				</Button>
			</Toolbar>
			</AppBar>
			<List sx={{mt:7}}>
				 <ListItem alignItems="flex-start" key={"title"} >

					<ListItemText
						primary={
							<Box
								component="form"
								sx={{
									'& .MuiTextField-root': { m: 1, width: '25ch' },
								}}
								noValidate
								autoComplete="off"
							>
							<Box display="inline" mr={2}>
								<TextField label="Title" sx = {{width: 350}} variant="filled" onChange={(event) => setTitle(event.target.value)}/>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mr={2}>
							      <DateTimePicker
									label="Due"
									value={due}
									onChange={(date)=>{setDue(date!)}}
									renderInput={(params) => <TextField sx={{width:'230px'}} {...params} />}
								/>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mr={2}>
								<DesktopDatePicker
								label="Start"
								value={start}
								onChange={(date)=>{handleStart(date)}}
								renderInput={(params) => <TextField sx={{width:'150px'}} {...params} />}
								/>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mr={2}>
								<Button variant="outlined" disabled={start==null} color="secondary" onClick={()=>{setStart(null)}}>
									Reset Start
								</Button>
							</Box>
							<br className="br-sp"/>
							<br className="br-sp"/>
							<Divider className="br-sp"/>
							<br className="br-sp"/>
							<Box display="inline" mr={2}>
								<Select value={color} onChange={(event) => setColor(event.target.value)}>
									<MenuItem value="red">
										<Avatar sx={{ bgcolor: red[500] , width:30, height:30}}>
											<RemoveCircleIcon/>
										</Avatar>
									</MenuItem>
									<MenuItem value="orange">
										<Avatar sx={{ bgcolor: orange[500], width:30, height:30 }}>
											<AssignmentLateIcon/>
										</Avatar>
									</MenuItem>
									<MenuItem value="yellow">
										<Avatar sx={{ bgcolor: yellow[500], width:30, height:30 }}>
											<PendingIcon/>
										</Avatar>
									</MenuItem>
									<MenuItem value="green">
										<Avatar sx={{ bgcolor: green[500], width:30, height:30 }}>
											<EditIcon/>
										</Avatar>
									</MenuItem>
									<MenuItem value="blue">
										<Avatar sx={{ bgcolor: blue[500], width:30, height:30 }}>
											<PageviewIcon/>
										</Avatar>
									</MenuItem>
								</Select>
							</Box>
							</Box>
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
							<TextField label="Title" variant="filled" fullWidth value={sub.title} onChange={(event) => handleChangeSubTasks(event.target.value,idx)} onKeyDown={e => {if (e.key === "Enter") {handleInsertSubTask(idx)}}}></TextField>
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

export default AddTodoDialog;