import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null, 
          title:'',
          completed:false,
        },
        editing:false,
      }
      this.Listing = this.Listing.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.Creation =this.Creation.bind(this)

      this.getCookie = this.getCookie.bind(this)


      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

componentWillMount(){
  this.Listing()
}

  // Task list display
  Listing(){
    console.log('Fetching....')
    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        todoList : data
      })
      )
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  // Task creation
  Creation(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)
    var csrftoken = this.getCookie('csrftoken');
    var url = 'http://127.0.0.1:8000/api/task-create/'
    if(this.state.editing === true){
      
      url='http://127.0.0.1:8000/api/task-update/' + this.state.activeItem.id  
      
      // url='http://127.0.0.1:8000/api/task-update/{{updateId}/'
      this.setState({
        editing: false
      })

    }
    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)  => {
        this.fetchTasks()
        this.setState({
           activeItem:{
          id:null, 
          title:'',
          completed:false,
        }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })

  }
//Editing component
  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

//deleting component
  deleteItem(task){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{

      this.fetchTasks()
    })
  }


  strikeUnstrike(task){

    task.completed = !task.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`


      fetch(url, {
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'completed': task.completed, 'title':task.title})
      }).then(() => {
        this.fetchTasks()
      })

    console.log('TASK:', task.completed)
  }


  render() {
    var tasks=this.state.todoList
    var self=this
    return(
      <div className="container">
        <div id='task-container'>
        <h1 id='h1'> TODO LIST</h1>
          <div id='forms'>
            <form id='form' onSubmit={this.Creation}>
              <div className='flex-wrapper'>
                <div style={{flex: 4}}>
                  <input onChange={this.handleChange} className='form-control' value={this.state.activeItem.title} id='title' type='text' name='title' placeholder='enter your task' />
                </div>
                <div style={{flex: 1}}>
                  <input className='btn ' id='submit' type='submit' name='add' />
                </div>
                
              </div>
            </form>
          </div>
          <div  id="list-wrapper">         
                    {tasks.map(function(task, index){
                      return(
                          <div key={index} className="task-wrapper flex-wrapper">

                            <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>

                                {task.completed == false ? (
                                    <span>{task.title}</span>

                                  ) : (

                                    <strike>{task.title}</strike>
                                  )}
  
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-dark">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
        </div>
        <h1 id='h1'> Note: completed Items are shown with strike -----</h1>

      </div>
    )
  }
}

export default App;
