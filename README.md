# ServerTrack- Serverless Infrastructure Inventory Management
ServerTrack is a serverless web app on AWS that lets teams add, view, update, and delete records of their cloud servers in one organized place.

Here are steps to create the application and get it running with various AWS Services Integrations.
## Step 1- Create the DynamoDB Table

1. Go to DynamoDB on AWS Console
2. Create table "ServerTrack" with partition "ServerID" (String)
3. Select your preferred configurations
4. Create table and wait till its active.

![Tables](/Documents/AWSProjects/ServerTrackDynamoDB/images/Create-table.png)

## Step 2- Select IAM role for Lambda

1. Go to IAM on AWS Console
2. Select Roles
3. Pick Lambda as the AWS Service to integrate with
4. Search and select the following policies;

*AmazonDynamoDBFullAccess
*CloudWatchLogsFullAccess
5. Role name: servertrack-lambda-role
6. Create Role

![Permission policies](/Documents/AWSProjects/ServerTrackDynamoDB/images/IAM role.png)

## Step 3- Create the Lambda function

1. Go to Lambda on AWS Console
2. Fill in:

*Function name:
*Runtime
*Architecture
*Under permission
*Select use an existing IAM role
*Choose servertrack-lambda-role

3. Click Create function
4. In the code editor, delete the default code and input the codes on lambda_function.py
5. Click Deploy
6. Under Configuration → General configuration, set Timeout to 30 seconds

## Step 4- Create API Gateway

1. Go to API Gateway
2. Click Create API
3. Under REST API, click Build

4. Fill in:

*API name: servertrack-api
*API endpoint type: Regional

5. Click Create API
 
### Create the /servers Resource

1. Click Create resource
2. Resource path: /
3. Resource name: servers
4. Enable CORS 
5. Click Create resource

###Create Methods on /servers

1. Click Create Method
2. Method type: GET
3. Integration type: Lambda Function
4. Lambda function: servertrack-api
5. Click Create method

### POST Method

1. Click Create method
2. Method type: POST
3. Integration type: Lambda Function
4. Lambda function: servertrack-api
5. Click Create method

### Create the /{server_id} Resource

1. Select the /servers resource
2. Click Create resource
3. Resource name: {server_id}
4. Resource path: {server_id}
5. Enable CORS 
6. Click Create resource

### Create Methods on /{server_id}

Select the /{server_id} resource, then create three methods:

GET, PUT, DELETE — each one with:

* Integration type: Lambda Function

* Lambda function: servertrack-api

### Deploy the API

1. Click Deploy API
2. Stage: New stage
3. Stage name: prod
4. Click Deploy
5. Copy the invoke URL: https://0s1lnbj0cf.execute-api.us-east-1.amazonaws.com/prod/servers \

_This URL will be needed for the front end_

This is how the API Page will look like:

![Resources](images/API page.png/)

## Step 5- Test the API

You can test the API directly from your terminal

Create a server:

```curl -s -X POST "https://0s1lnbj0cf.execute-api.us-east-1.amazonaws.com/prod/servers" -H "Content-Type: application/json" -d '{"server_name":"web-prod-01","environment":"production","instance_type":"t3.medium","ip_address":"10.0.1.25","region":"us-east-1","team":"platform","status":"running"}'```

If it returns a valid JSON response, it means your backend is working. Image below shows that the API is working

![Server Created](images/Server created.png)

## Step 6- Host the Frontend on S3

Ensure your Frontend files are on your local device (app.js, style.css & index.html). Make sure your API URL is inside your app.js for connection to be succesful.

1. Go to S3 in the console
2. Click Create bucket
3. Bucket name: servertrack-frontend-YOURINITIALS (must be globally unique)
4. Region: same as your other services
5. Uncheck Block all public access
6. Acknowledge the warning
7. Click Create bucket

Enable Static Website Hosting

1. Go into your bucket
2. Click the Properties tab
3. Scroll to Static website hosting and click Edit
4. Select Enable
5. Index document: index.html
6. Click Save changes

Add a policy for Public read Access

1. Click the Permissions tab
2. Under Bucket policy, click Edit
3. Paste the policy (replace YOUR-BUCKET-NAME):

![Version](images/Version.png)

