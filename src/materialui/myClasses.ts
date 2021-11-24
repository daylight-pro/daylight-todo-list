import { DefaultTheme } from "@material-ui/styles";
import { makeStyles } from "@mui/styles";

export default class myClasses{
	static useStyles = 	makeStyles((theme:DefaultTheme)=>({
		todoIcon:{
			verticalAlign:"-6px"
		},
		titleIcon:{
			verticalAlign:"-6px"
		},
		soonDeadLine:{
			color:"#FFB83F"
		},
		over:{
			color:"#FF4CB1"
		},
		working:{
			color:"#7bc890"
		},
		inbox:{
			color:"#8A77B7"
		},
		later:{
			color:"#dc143c"
		},
		labelTitle:{
			color: "#9B95C9"
		},
		repeat:{
			color: "#ffff61"
		},
		todoContainer:{
			marginTop: "20px",
			marginLeft: "20px",
			marginRight: "20px",
			marginBottom:"20px",
			borderRadius: "5px",
			backgroundColor: "#333333"
		},
		note:{
			lineHeight:2.5
		},
		nested: {
			paddingLeft: 4,
		},
		expandButton:{
			border: "solid",
			borderRadius:"50%",
			fontSize:"30px"
		},
		button:{
			padding:"0"
		},
		todoViewCard:{
			border: "1"
		},
		todoViewTitle:{
			textAlign: "left",
			fontSize:"10pt"
		},
		todoViewDate:{
			textAlign: "left",
			fontSize:"8pt"
		},
		columnContainer:{
			display:"flex",
			flexDirection:"column"
		},
		taskList:{
			overflowY:"scroll",
			height:"90%"
		},
		fullHeight:{
			height:"100%",
		},
		dayHeader:{
			textAlign:"left",
			borderBottom:"medium solid #ffffff",
			fontSize:"15pt"
		},
		columnTitle:{
			borderBottom:"medium double #ffffff",
			borderBottomWidth: "7px",
			marginBottom:"20px"
		},
		completed:{
			color:"#ffff61"
		}
	}));
}