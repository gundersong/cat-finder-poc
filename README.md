# Preface
This project has been deliberately over-engineered to demonstrate understanding of the technologies used within.

# Description
An Express application which returns the top 5 cat breeds, 'top' being the most child, stranger and dog friendly.

Deployable to AWS using the Serverless Framework and using Express to orchestrate the endpoint mapping.

## Security
The deployment of this Application to AWS requires the current user or role in the local environment to have sufficient permissions to deploy to and manage AWS services.

The API Deployed to AWS requires an API key passed in the `x-api-key` header to Authenticate.

The secrets used within the application to call the [Cat API](https://developers.thecatapi.com) are stored within AWS Secrets Manager and retrieved by the application running in AWS.

When running locally, the application will look for the secrets within `CAT_API_URL` and `CAT_API_KEY` environment variables, if they do not exist, it will also attempt to get the secrets from Secrets Manager.

To populate this secret in AWS, the following command can be used (make sure to replace the `apiKey`, `stage` and `region` values):
e.g. `aws secretsmanager create-secret --name {STAGE}/cat-api --secret-string '{"apiKey":"{YOUR_CAT_API_KEY}","url":"https://api.thecatapi.com/v1"}' --region {AWS_REGION}`

# Usage
### Running locally
When running the API locally, retrieving the Cat API secrets from AWS can be bypassed by setting the following environment variables:
- `CAT_API_URL` - The URL of the Cat Api e.g. `https://api.thecatapi.com/v1`
- `CAT_API_KEY` - Your API Key received when signing up for `https://developers.thecatapi.com`

If these are not set, the local CLI will need to have access to an AWS user with permission to access Secrets Manager, the following environment variables are needed to allow access to SecretsManager:
- `STAGE` - The stage in which the secret namespace is in (default is `dev`)
- `AWS_REGION` - The region the secrets are stored in

### Starting local service
1. `yarn` or `npm install`
2. `yarn start:local` or `npm run start:local` 

Instead of exporting the environment variables before running the app, they can also be passed as part of the start command e.g.:
`CAT_API_URL=https://api.thecatapi.com/v1 CAT_API_KEY={YOUR_API_KEY} yarn start:local`
or
`STAGE=dev AWS_REGION=ap-southeast-2 yarn start:local`

This will start the express server locally with ts-node.
This local endpoint can then be called with no API key, e.g. `curl localhost:3000/cats/top`

### Deployment to AWS
When runing the application in AWS, the secrets mentioned in the security section above must be populated in the AWS account.

1. `yarn` or `npm install`
2. `yarn sls deploy` or `npx sls deploy`

Once this has been deployed you will receive an output with both an API Key, called CatService, and the endpoint of the service itself e.g.
```
api keys:
  CatService: abc123
endpoint: GET - https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/dev/cats/top
```

These can then be called with the following CURL command:
`curl https://xxxxxxxxxx.execute-api.ap-southeast-2.amazonaws.com/dev/cats/top -H "x-api-key:abc123"`

### Params
By defult the top 5 cats will be returned, but you can return as many as you want by passing the `limit` query parameter e.g.:
`curl -X GET "localhost:3000/cats/top?limit=2"`
