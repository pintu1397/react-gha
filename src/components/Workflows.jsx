import React, { useState } from "react";
import { Octokit } from "@octokit/rest";

const Workflows = () => {
  const [responseMessage, setResponseMessage] = useState(null);

  const triggerWorkflow = async () => {
    try {
      const octokit = new Octokit({
        auth: "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", // Replace with your GitHub access token or authentication method
        baseUrl: "https://api.github.com",
      });

      const response = await octokit.actions.createWorkflowDispatch({
        owner: "pintu1397",
        repo: "imageWall",
        workflow_id: "main.yml", // Replace with your actual workflow ID
      });

      setResponseMessage(
        `Workflow triggered successfully: ${response.data.message}`
      );
    } catch (error) {
      setResponseMessage(`Error triggering workflow: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={triggerWorkflow}>Trigger Workflow</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Workflows;
