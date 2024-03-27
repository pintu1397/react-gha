import React, { useState, useEffect } from "react";

function WorkflowStatus() {
  const [owner, setOwner] = useState("pintu1397"); // Replace with your username
  const [repo, setRepo] = useState("react-gha"); // Replace with your repo name
  const [workflowId, setWorkflowId] = useState("main.yaml"); // Replace with workflow ID
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    const fetchData = async () => {
      const token = process.env.REACT_APP_GITHUB_TOKEN; // Replace with your access token (store securely)
      //const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`;
        const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`;


      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching workflow runs");
      }

      const data = await response.json();
      const runningRun = data.workflow_runs.find(
        (run) => run.status === "in_progress"
      );

      if (runningRun) {
        setStatus(runningRun.status);
      } else {
        // Check for successful completion before setting "No workflow running"
        const successfulRun = data.workflow_runs.find(
          (run) => run.status === "completed" && run.conclusion === "success"
        );
        if (successfulRun) {
          setStatus("success");
        } else {
          setStatus("No workflow currently running");
        }
      }
    };

    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds (adjust as needed)

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [owner, repo, workflowId]);

  return (
    <div>
      <p>Workflow Status: {status}</p>
    </div>
  );
}

export default WorkflowStatus;
