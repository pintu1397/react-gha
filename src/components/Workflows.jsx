import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const Workflows = ({}) => {
  const [jobStatus, setJobStatus] = useState(null);

  const triggerWorkflow = async () => {
    try {
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

      // Fetch latest workflow run
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

      const latestRun = response.data.workflow_runs[0]; // Get the latest run

      // Fetch job statuses for the latest run
      const jobResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        {
          owner,
          repo,
          run_id: latestRun.id,
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const jobs = jobResponse.data.jobs || [];

      // Update job status
      if (jobs.length > 0) {
        setJobStatus(jobs[jobs.length-1]); // Set status of the first job (current job)
      }
    } catch (error) {
      console.log(`Error triggering workflow: ${error.message}`);
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
      {/* Display job status */}
      {jobStatus && (
        <p>
          Current Job Status: {`Job ${jobStatus.name} status: ${jobStatus.status}`}
        </p>
      )}
    </div>
  );
};

export default Workflows;
