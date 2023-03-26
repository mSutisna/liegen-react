
// import user from '../src/img/user.png';
// import edit from '../src/img/edit.png';
// import inbox from '../src/img/envelope.png';
// import settings from '../src/img/settings.png';
// import help from '../src/img/question.png';
// import logout from '../src/img/log-out.png';
// import './App.css';

import React, {useState, useEffect, useRef} from 'react';

function App() {

  const [open, setOpen] = useState(false);

  let menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handler = (e: MouseEvent)=>{
      const target = e.target as Node;
      if(menuRef.current && !menuRef.current.contains(target)){
        setOpen(false);
      }      
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
      document.removeEventListener("mousedown", handler);
    }

  });

  return (
    <div className="App">
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
          <div>KANKER</div>
          {/* <img src={user}></img> */}
        </div>

        <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <h3>The Kiet<br/><span>Website Designer</span></h3>
          <ul>
            <li>Je kanker moeder</li>
            {/* <DropdownItem img = {user} text = {"My Profile"}/>
            <DropdownItem img = {edit} text = {"Edit Profile"}/>
            <DropdownItem img = {inbox} text = {"Inbox"}/>
            <DropdownItem img = {settings} text = {"Settings"}/>
            <DropdownItem img = {help} text = {"Helps"}/>
            <DropdownItem img = {logout} text = {"Logout"}/> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

// function DropdownItem(props) {
//   return(
//     <li className = 'dropdownItem'>
//       <img src={props.img}></img>
//       <a> {props.text} </a>
//     </li>
//   );
// }

export default App;