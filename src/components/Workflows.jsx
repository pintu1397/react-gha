import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const Workflows = ({ workflowId, owner, repo }) => {
  const [deployStatus, setDeployStatus] = useState(null);

  const triggerWorkflow = async () => {
    try {
      setDeployStatus("Deploying...!");

      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });

      // Trigger workflow
      await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner:"pintu1397",
          repo:"react-gha",
          workflow_id:"main.yaml",
          ref: "main", 
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
    } catch (error) {
      console.error(`Error triggering workflow: ${error.message}`);
      setDeployStatus("Failed"); // Set status to failed if an error occurs
    }
  };

  // Fetch and display workflow run status
  useEffect(() => {
    const fetchRunStatus = async () => {
      if (!workflowId || !owner || !repo) {
        console.error("Missing workflow ID, owner, or repo details");
        return;
      }

      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });

      try {
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
        console.error(`Error fetching workflow run status: ${error.message}`);
        setDeployStatus("Failed"); // Set status to failed in case of errors
      }
    };

    fetchRunStatus();
  }, [workflowId, owner, repo]); // Re-run useEffect on workflow ID, owner, or repo changes

  return (
    <div>
      <Button
        className="btn btn-secondary"
        onClick={triggerWorkflow}
        disabled={deployStatus === "Deploying"} // Disable button during deployment
      >
        Publish
      </Button>
      {deployStatus && <p>{deployStatus}</p>}
    </div>
  );
};

export default Workflows;
