import dotenv from "dotenv";
dotenv.config();

// Jodi typescript use na kortam, tahole aivabe likhlei hoia jeto. But typescript use korai type checking and interface use korte hobe.
// export const envVars = {
//   PORT: process.env.PORT,
//   DB_URL: process.env.DB_URL,
//   NODE_ENV: process.env.NODE_ENV,
// };

// For typescript using interface and type checking
interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production"; // ai 2ta valuer moddhei hote hobe.
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];

  // array ke map kore key gulo nissa. Jodi requiredEnvVariables array er kono key .env file er moddhe na thake, tahole error through korbe.
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!, // last a ! or not symbol dewa mane, ai line er type nia error dibana. and uporer line er comment ta holo: eslint er error ke stop kora hoiase, ai line er jonno.
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVariables();
