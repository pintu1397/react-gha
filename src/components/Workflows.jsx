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
        auth: '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',
        //"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", // Replace with your GitHub access token or authentication method
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
      console.log(response);
      setResponseMessage(
        `clicked successfully`
        //`Workflow triggered successfully`
      );
    } catch (error) {
      setResponseMessage(`Error triggering workflow: ${error.message}`);
    }
  };
// Button for Trigger Workflow
  return (
    <div>
      <Button class="btn btn-secondary" onClick={triggerWorkflow}>refresh</Button>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Workflows;
