import React, { useState } from "react";
import { Octokit } from "octokit";
import WorkflowStatus from './WorkflowStatus'; // Import the WorkflowStatus component

// import {  Button } from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.min.css";

const Workflows = () => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [runId, setRunId] = useState(null); // State to store the run ID

  const triggerWorkflow = async () => {
    try {
      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });

      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        //"GET /repos/{owner}/{repo}/actions/artifacts",
        {
          owner: "pintu1397",
          repo: "react-gha",
          workflow_id: "main.yaml",
          // Optional: ref and inputs
          ref: "main",
          
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
    
     console.log(response.data);
  
      setResponseMessage(`Workflow triggered successfully`);
    } catch (error) {
      setResponseMessage(`Error triggering workflow: ${error.message}`);
    }
  };

  // Button for Trigger Workflow
  return (
    <div>
      <button
        style={{ padding: "5px", backgroundColor: "gray" }}
        onClick={triggerWorkflow}
      >
        Publish
      </button>

      {responseMessage && <p>{responseMessage}</p>}

      {/* Display Workflow Status */}
      {/* <WorkflowStatus /> Add the WorkflowStatus component */}
    </div>
  );
};

export default Workflows;
