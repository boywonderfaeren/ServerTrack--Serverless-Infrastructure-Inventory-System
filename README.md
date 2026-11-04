# ServerTrack- Serverless Infrastructure Inventory Management
ServerTrack is a serverless web app on AWS that lets teams add, view, update, and delete records of their cloud servers in one organized place.

Here are steps to create the application and get it running with various AWS Services Integrations.
## Step 1- Create the DynamDB Table

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

