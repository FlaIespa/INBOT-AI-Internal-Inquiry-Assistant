import React from "react";
import CodeBlock from "./CodeBlock"; // Reuse your CodeBlock component for highlighting

function SlackIntegration() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Integration with Slack</h1>
      <p className="mb-6 text-gray-700">
        Follow these steps to integrate the INBOT AI Library with Slack, allowing users to interact with the chatbot directly from Slack channels.
      </p>

      {/* Step 1: Create Slack App */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Step 1: Create a Slack App</h2>
        <p className="mb-4 text-gray-700">
          Go to the{" "}
          <a href="https://api.slack.com/apps" className="text-blue-500 underline">
            Slack API App Creation Page
          </a>{" "}
          and create a new app. Choose a name and the workspace for your app.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Navigate to <strong>OAuth & Permissions</strong> and add the following bot token scopes:
            <ul className="list-disc ml-6 mt-2">
              <li><code className="bg-gray-200 px-2 py-1 rounded-md">chat:write</code></li>
              <li><code className="bg-gray-200 px-2 py-1 rounded-md">channels:read</code></li>
              <li><code className="bg-gray-200 px-2 py-1 rounded-md">commands</code> (for slash commands)</li>
            </ul>
          </li>
          <li>Install the app to your workspace and copy the <strong>Bot User OAuth Token</strong>.</li>
        </ul>
      </div>

      {/* Step 2: Install Slack SDK */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Step 2: Install the Slack Bolt SDK</h2>
        <p className="mb-4 text-gray-700">
          Install the Slack Bolt SDK for Python by running the following command:
        </p>
        <CodeBlock language="bash" code={`pip install slack_bolt`} />
      </div>

      {/* Step 3: Set Up Integration Code */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Step 3: Set Up Integration Code</h2>
        <p className="mb-4 text-gray-700">
          Below is an example of how to set up a Python file for the Slack integration. This code listens for messages containing the word <strong>ask</strong> and uses the INBOT AI Library to respond.
        </p>
        <CodeBlock
          language="python"
          code={`from slack_bolt import App
            from slack_bolt.adapter.socket_mode import SocketModeHandler
            from inbot import INBOTChatbot

            slack_app = App(token="your-slack-bot-token")
            chatbot = INBOTChatbot(api_key="your-groq-api-key")

            @slack_app.message("ask")
            def handle_question(message, say):
            user_question = message['text'].replace("ask", "").strip()
             response = chatbot.ask_question(user_question)
            say(response)

            if __name__ == "__main__":
                handler = SocketModeHandler(slack_app, "your-slack-app-level-token")
                handler.start()`}
        />
      </div>

      {/* Step 4: Run and Test */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Step 4: Run and Test</h2>
        <p className="mb-4 text-gray-700">
          Run the bot using the following command in your terminal:
        </p>
        <CodeBlock language="bash" code={`python slack_integration.py`} />
        <p className="mt-4 text-gray-700">
          In your Slack workspace, send a message like <strong>ask What is the weather like today?</strong>, and the bot will respond with an answer from the INBOT AI Library.
        </p>
      </div>

      {/* Optional Step 5: Add Slash Commands */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Step 5 (Optional): Add Slash Commands</h2>
        <p className="mb-4 text-gray-700">
          If you want users to interact with the bot using a slash command (e.g., <code>/ask</code>), you can configure this in Slack's <strong>Slash Commands</strong> settings.
        </p>
        <p className="text-gray-700">
          Add a new slash command in the <strong>Slack App Dashboard</strong>, and update your code to handle the new command.
        </p>
      </div>
    </div>
  );
}

export default SlackIntegration;
