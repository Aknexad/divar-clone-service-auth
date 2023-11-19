import { ZodIssue } from 'zod';
import { generateErrorMessage } from 'zod-error';

const ValidateEnv = (issues: void | ZodIssue[]) => {
  if (issues) {
    console.error('Invalid environment variables, check the errors ');
    console.error(
      generateErrorMessage(issues, {
        delimiter: { error: '\\n' },
      })
    );
    process.exit(-1);
  }

  console.log('The environment variables are valid');
};

export default ValidateEnv;
