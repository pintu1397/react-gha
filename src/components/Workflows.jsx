import React, { useState, useEffect } from "react";
import { Octokit } from "octokit";

const Workflows = () => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState("queued"); // State to store the latest workflow status
  let intervalId;

  // Function to fetch latest workflow status
  const fetchWorkflowStatus = async () => {
    try {
      const octokit = new Octokit({
        auth: process.env.REACT_APP_SECRET_GITHUB_TOKEN,
        baseUrl: "https://api.github.com",
      });

      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        {
          owner: "pintu1397",
          repo: "react-gha",
          workflow_id: "main.yaml",
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      // Get the latest job status
      const latestStatus = response.data.workflow_runs[0].status;
      console.log(latestStatus);
      setWorkflowStatus(latestStatus);
      setResponseMessage(`Status : ${latestStatus}`);

      // Check if the latest job is completed
      if (latestStatus === "completed") {
        clearInterval(intervalId); // Clear interval to stop further fetches
        setTimeout(() => {
          setResponseMessage(null);
        }, 5000);
      }
    } catch (error) {
      setResponseMessage(`Error fetching workflow status: ${error.message}`);
    }
  };

  useEffect(() => {
    // Set timeout to delay initial execution of fetchWorkflowStatus after 10 seconds
    const timeoutId = setTimeout(() => {
      // Fetch latest workflow status initially
      fetchWorkflowStatus();

      // Fetch latest workflow status every 5 seconds
      intervalId = setInterval(fetchWorkflowStatus, 5000);
    }, 30000); // Delay initial execution by 10 seconds

    // Clear the interval and timeout on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array to run effect only once

  // Button to manually trigger workflow
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
          },
        }
      );

      setResponseMessage(`Status : ${workflowStatus}`);
    } catch (error) {
      setResponseMessage(`Error triggering workflow: ${error.message}`);
    }
  };

  return (
    <div>
      <button
        style={{ padding: "5px", backgroundColor: "gray" }}
        onClick={triggerWorkflow}
      >
        Publish
      </button>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Workflows;
