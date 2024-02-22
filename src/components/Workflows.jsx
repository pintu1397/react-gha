//workflows.jsx
import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import {  Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";


const Workflows = () => {
  const [responseMessage, setResponseMessage] = useState(null);

  const triggerWorkflow = async () => {
    try {
      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        //auth: "${{secrets.WORKFLOW_GITHUB_TOKEN}}",
        
        baseUrl: "https://api.github.com",
      });
//https://github.com/pintu1397/react-gha/actions/workflows/main.yaml
      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner: "pintu1397",
          repo: "react-gha",
          workflow_id: "main.yaml",
          // Optional: ref and inputs
          ref: 'main',
          
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      const statusResponse = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner: 'pintu1397',
        repo: 'react-gha',
        workflow_id: 'main.yaml',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      
      // Assuming the last run is at index 0
      const lastRun = statusResponse.data.workflow_runs[55];
      
      console.log(lastRun.status);

      setResponseMessage(
        `clicked successfully`
        //`Workflow triggered successfully`
      );
    }catch (error) {
      setResponseMessage(`Error triggering workflow: ${error.message}`);
    }
  };
// Button for Trigger Workflow
  return (
    <div>
      <Button className="btn btn-secondary" onClick={triggerWorkflow}>Publish</Button>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Workflows;
