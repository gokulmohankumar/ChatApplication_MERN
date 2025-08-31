# G-CHAT: A Real-Time Chat Application

```xml
<Project>
  <Name>G-CHAT: A Real-Time Chat Application</Name>

  <Overview>
    G-CHAT is a modern, real-time chat application built using the MERN stack.
    It allows users to send and receive messages instantly, facilitating both
    one-on-one and group conversations. This project was developed as part of
    an evaluation for ZenThink Technologies.
  </Overview>

  <Features>
    <Feature>Real-Time Messaging: Instantaneous message delivery using Socket.io.</Feature>
    <Feature>User Authentication: Secure user registration and login functionality.</Feature>
    <Feature>Persistent Conversations: All messages and chats are stored in a MongoDB database.</Feature>
    <Feature>One-on-One Chat: Users can search for and initiate private chats with other registered users.</Feature>
    <Feature>Group Chat: Users can create group conversations with multiple participants.</Feature>
    <Feature>Responsive UI: A clean, intuitive interface built with React and Tailwind CSS.</Feature>
  </Features>

  <TechStack>
    <Backend>
      <Item>Node.js: JavaScript runtime environment.</Item>
      <Item>Express.js: Web application framework for REST APIs.</Item>
      <Item>MongoDB: NoSQL database for storing user, chat, and message data.</Item>
      <Item>Socket.io: Library for real-time communication.</Item>
      <Item>bcryptjs: For password hashing.</Item>
      <Item>cloudinary: Profile image upload</Item>
      <Item>jsonwebtoken: For user authentication.</Item>
    </Backend>
    <Frontend>
      <Item>React: JavaScript library for UI.</Item>
      <Item>React Router DOM: Client-side routing.</Item>
      <Item>Context API: Global state management.</Item>
      <Item>Axios: API requests.</Item>
      <Item>Socket.io-client: Real-time communication with backend.</Item>
    </Frontend>
  </TechStack>

  <GettingStarted>
    <Prerequisites>
      <Item>Node.js (v14 or higher)</Item>
      <Item>MongoDB (local or cloud-hosted instance)</Item>
    </Prerequisites>

    <Installation>
      <Step>Clone the repository:</Step>
      <Command>git clone [Your Repository Link Here]</Command>
      <Command>cd [Your Repository Name]</Command>

      <BackendSetup>
        <Command>cd backend</Command>
        <Command>npm install</Command>
        <EnvFile>
          <Var>MONGO_URI = "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/gchat?retryWrites=true&amp;w=majority"</Var>
          <Var>JWT_SECRET = "your-jwt-secret"</Var>
        </EnvFile>
      </BackendSetup>

      <FrontendSetup>
        <Command>cd ../frontend</Command>
        <Command>npm install</Command>
        <EnvFile>
          <Var>REACT_APP_API_BASE_URL = "http://localhost:5100"</Var>
        </EnvFile>
      </FrontendSetup>
    </Installation>
  </GettingStarted>

  <Running>
    <Backend>
      <Command>npm start</Command>
      <URL>http://localhost:5100</URL>
    </Backend>
    <Frontend>
      <Command>npm start</Command>
      <URL>http://localhost:5173</URL>
    </Frontend>
  </Running>
</Project>
