import * as yup from 'yup';

const CodeSubmissionSchema = yup.object({
  body: yup.object({
    submission:
      yup.string()
        .required('A code submission is required.'),
    programmingLanguage:
      yup.string()
        .required('Programming language name is required.'),
    stdin:
      yup.string('Input must be a string.')
  })
});

export default CodeSubmissionSchema;
