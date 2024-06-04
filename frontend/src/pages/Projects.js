import React from 'react';

const ProjectDisplay = () => {
  return (
    <div className="project-display">
      <div className="project-header">
        <h2>Employee Overview</h2>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Person</th>
            <th>Current Utilization</th>
            <th># Projects</th>
            <th>Technology</th>
            <th>Solution Engineering</th>
            <th>Self Management</th>
            <th>Communication Skills</th>
            <th>Employee Leadership</th>
            <th>Location</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Esthera Jackson</td>
            <td>75%</td>
            <td>3</td>
            <td>5/20</td>
            <td>11/15</td>
            <td>9/15</td>
            <td>12/20</td>
            <td>13/18</td>
            <td>Munich</td>
            <td>Edit</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDisplay;
