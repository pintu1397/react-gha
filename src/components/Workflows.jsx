import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const Workflows = ({}) => {
  const [deployStatus, setDeployStatus] = useState(null);

  const triggerWorkflow = async () => {
    try {
      setDeployStatus("Deploying...");

      const owner = "pintu1397";
      const repo = "react-gha";

      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });

      // Trigger workflow
      await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner,
          repo,
          workflow_id: "main.yaml",
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      // Poll the workflow run status until it's completed
      let runStatus = "";
      while (runStatus !== "completed") {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/actions/runs",
          {
            owner,
            repo,
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const latestRun = response.data.workflow_runs[0];
        runStatus = latestRun.status;

        if (runStatus === "completed") {
          setDeployStatus("Completed");
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        }
      }
    } catch (error) {
      console.log(`Error triggering workflow: ${error.message}`);
      setDeployStatus("Failed"); // Set status to failed if an error occurs
    }
  };

  return (
    <div>
      <Button
        className="btn btn-secondary"
        onClick={triggerWorkflow}
        disabled={alert === true}
      >
        Publish
      </Button>
      {/* Display deploy status */}
      {deployStatus && (
        <p>{deployStatus}</p>
      )}
    </div>
  );
};

export default Workflows;
