import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import { text } from 'express';

const Body = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const navigate = useNavigate()

  

  useEffect(() => {
   const jwtToken = Cookies.get('jwt')
    if (jwtToken === undefined){
     navigate('/login')
    }
  })

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { id: uuidv4(), text: task }]);
      setTask('');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditClick = (id, text) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  const handleUpdateTask = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editedText } : task))
    );
    setEditingTaskId(null);
    setEditedText('');
  };

  const removePermission = () => {
    Cookies.remove('jwt')
    navigate('/login')
  }

  return (
    <div className="task-manager">
      <h2>Today's Tasks</h2>
      <div className="task-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={() => handleUpdateTask(task.id)}
              />
            ) : (
              <span>{task.text}</span>
            )}
            <div className="task-actions">
              {editingTaskId === task.id ? (
                <span
                  onClick={() => handleUpdateTask(task.id)}
                  className="edit-icon"
                >
                  <i className="fa fa-check" />
                </span>
              ) : (
                <span
                  onClick={() => handleEditClick(task.id, task.text)}
                  className="edit-icon"
                >
                  <i className="fa fa-pencil" />
                </span>
              )}
              <span onClick={() => handleDeleteTask(task.id)} className="delete-icon">
                <i className="fa fa-trash" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={removePermission}>Logout</button>
    </div>
  );
};

export default Body;

