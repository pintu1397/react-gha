//workflows.jsx
import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const Workflows = ({setDeploymentStatus, setShowAlert, countSeconds, setFinalStateCompleted }) => {
  const triggerWorkflow = async () => {
    try {
      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });
      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner: "pintu1397",
          repo: "react-gha",
          workflow_id: "main.yaml",
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      
      setShowAlert(true);
      setFinalStateCompleted(false);
      setDeploymentStatus("Deployment Initiated");
      countSeconds();


    } catch (error) {
      console.log(`Error triggering workflow: ${error.message}`);
    }
  };

  return (
    <div>
      <Button className="btn btn-secondary" onClick={triggerWorkflow} disabled={alert === true}>
        Publish
      </Button>
    </div>
  );
};

export default Workflows;

