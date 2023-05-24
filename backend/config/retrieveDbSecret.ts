import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// Create a Secrets Manager client
const secretsmanager = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

async function getMongoConnectionString() {
  const secretName = 'helsinki-bike-app-mongoUrl';

  try {
    const response = await secretsmanager.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    if (response.SecretString) {
      const secret = JSON.parse(response.SecretString);
      return secret.mongoConnectionString;
    } else {
      throw new Error("SecretString is undefined");
    }
    
  } catch (err) {
    console.log(err);
  }
}

export default getMongoConnectionString;