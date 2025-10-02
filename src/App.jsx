import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProject from "./pages/CreateProject";
import CreateTask from "./pages/CreateTask";
import AssignTasks from "./pages/AssignTasks";
import CreateProjectTasks from "./pages/CreateProjectTasks";
import MemberDashboard from "./pages/MemberDashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/assign-tasks" element={<AssignTasks />} />
        <Route path="/create-project-tasks" element={<CreateProjectTasks />} />
      </Routes>
    </>
  );
}

export default App;
